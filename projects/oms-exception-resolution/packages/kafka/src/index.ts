import { Kafka, logLevel } from 'kafkajs';
import { eventSchema } from '@oms/shared-schemas';
import { TOPICS, type FeatureEvent, type Topic } from '@oms/shared-types';
import { env, internalRequest, log } from '@oms/server-kit';

export type EventHandler = (event: FeatureEvent) => Promise<unknown>;
export type Outbox = {
  pending(): Promise<FeatureEvent[]>;
  published(id: string): Promise<unknown>;
};
const deadLetter = 'oms.dead-letter';
export async function startEvents(options: {
  service: string; destination: string; topics: Topic[]; receive: EventHandler; outbox: Outbox;
}) {
  const {service, destination, topics, receive, outbox} = options;
  let publish = (event: FeatureEvent): Promise<unknown> => event.topic.startsWith('investigation.')
    ? internalRequest(destination + '/internal/events', event)
    : Promise.resolve();
  if (env.kafka) {
    const kafka = new Kafka({
      clientId: service, brokers: (process.env.KAFKA_BROKERS ?? 'localhost:19092').split(','),
      logLevel: logLevel.WARN, retry: {retries: 8},
    });
    const admin = kafka.admin();
    await admin.connect();
    try {
      await admin.createTopics({topics: [...TOPICS, deadLetter].map(topic => ({topic, numPartitions: 1, replicationFactor: 1}))});
    } finally { await admin.disconnect(); }
    const producer = kafka.producer({idempotent: true});
    const consumer = kafka.consumer({groupId: service});
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({topics, fromBeginning: true});
    publish = event => producer.send({topic: event.topic, messages: [{key: event.caseId, value: JSON.stringify(event)}]});
    await consumer.run({
      eachMessage: async ({topic, partition, message, heartbeat}) => {
        const keepAlive = setInterval(() => {
          void heartbeat().catch(error => log.warn({err: error, topic}, 'Consumer heartbeat failed'));
        }, 3000);
        try {
          const raw = message.value?.toString() ?? '';
          let lastError: unknown;
          for (let attempt = 0; attempt < 3; attempt++) {
            try {
              const event = eventSchema.parse(JSON.parse(raw));
              if (event.topic !== topic) throw new Error('Event topic mismatch');
              await receive(event);
              return;
            } catch (error) {
              lastError = error;
              await heartbeat();
              await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)));
            }
          }
          log.error({err: lastError, topic, partition, offset: message.offset}, 'Event moved to dead-letter topic');
          await producer.send({topic: deadLetter, messages: [{key: message.key, value: JSON.stringify({
            topic, partition, offset: message.offset, payload: raw, error: String(lastError),
          })}]});
        } finally { clearInterval(keepAlive); }
      },
    });
  }
  let publishing = false;
  const tick = async () => {
    if (publishing) return;
    publishing = true;
    try {
      for (const event of await outbox.pending()) {
        await publish(event);
        await outbox.published(event.id);
      }
    } catch (error) {
      log.warn({err: error, service}, 'Outbox delivery deferred');
    } finally { publishing = false; }
  };
  const timer = setInterval(() => void tick(), 600);
  timer.unref();
  void tick();
}

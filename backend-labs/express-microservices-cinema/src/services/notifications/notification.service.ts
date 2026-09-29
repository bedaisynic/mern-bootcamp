// given — "sends" an email by storing it and logging it.

import { HttpError } from "../../lib/http-error";
import { Email, notificationRepository } from "./notification.repository";

export const notificationService = {
  async send(userId: unknown, subject: unknown, body: unknown): Promise<Email> {
    if (!Number.isInteger(userId) || typeof subject !== "string" || !subject) {
      throw new HttpError(400, "userId (integer) and subject are required");
    }
    const email = notificationRepository.create({
      userId: userId as number,
      subject,
      body: typeof body === "string" ? body : "",
    });
    if (!process.env.VITEST) console.log(`📧 to user ${email.userId}: ${email.subject}`);
    return email;
  },

  async listForUser(userId: number): Promise<Email[]> {
    return notificationRepository.findByUser(userId);
  },
};

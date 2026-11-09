const DAY = 86_400_000;
const anchor = Date.UTC(2026, 10, 9);
export const dayAt = (daysAgo: number) => new Date(anchor - daysAgo * DAY).toISOString().slice(0, 10);
export const snapshotDate = dayAt(0);
export const periodStart = dayAt(29);

export const facilities = [
  {id: 'RNO', name: 'Reno Distribution Center', region: 'West'},
  {id: 'DFW', name: 'Dallas Fulfillment Center', region: 'Central'},
  {id: 'COL', name: 'Columbus Distribution Center', region: 'Midwest'},
  {id: 'ATL', name: 'Atlanta Fulfillment Center', region: 'Southeast'},
];
const productLines = [
  ['PB', 'Toscana Dining Table', 1899], ['PB', 'Cameron Roll Arm Sofa', 2199], ['PB', 'Benchwright Console', 899],
  ['PB', 'Sausalito Nightstand', 649], ['WE', 'Anton Solid Wood Desk', 999], ['WE', 'Mid-Century Media Console', 1099],
  ['WE', 'Harmony Modular Chair', 1299], ['WE', 'Organic Cotton Quilt', 199], ['WS', 'Signature Stainless Cookware Set', 599],
  ['WS', 'Classic Dinnerware Set', 169], ['WS', 'Marble Serving Board', 79], ['WS', 'Belgian Linen Napkin Set', 59],
] as const;
const brands = {PB: 'Pottery Barn', WE: 'West Elm', WS: 'Williams Sonoma'};
const furnitureFinishes = ['Natural', 'Warm Oak', 'Charcoal', 'Ivory', 'Slate', 'Classic'];
const tabletopFinishes = ['Classic', 'White', 'Slate', 'Ivory', 'Stone', 'Matte Black'];
const variants = ['01', '02', '03', '04'];
const catalog = productLines.flatMap(([brandCode, name, price], line) =>
  (brandCode === 'WS' ? tabletopFinishes : furnitureFinishes).flatMap((finish, finishIndex) => variants.map((variant, index) => ({
    sku: `${brandCode}-${100 + line}-${finishIndex + 1}${variant}`,
    name: name + ' · ' + finish, brandCode, brand: brands[brandCode], price: price + 20 * index, freight: price >= 600,
  }))),
);
const given = ['Ava', 'Jordan', 'Mia', 'Oliver', 'Zoe', 'Ethan', 'Noah', 'Sofia', 'Kai', 'Isabella', 'Leo', 'Maya', 'Amelia', 'Lucas', 'Nora', 'Riley'];
const family = ['Nguyen', 'Mitchell', 'Rivera', 'Patel', 'Brooks', 'Kim', 'Torres', 'Chen', 'Wilson', 'Park', 'Garcia', 'Johnson', 'Singh', 'Martinez', 'Lewis', 'Davis'];
export const channels = ['Online', 'Retail store', 'Customer Care'] as const;

type Fulfillment = 'Unfulfilled' | 'Scheduled' | 'Fulfilled' | 'On hold' | 'Canceled';
type WarehouseStage = 'Awaiting release' | 'Picking' | 'Packing' | 'Ready to dispatch' | 'Dispatched' | 'On hold';
type DeliveryStage = 'Scheduled' | 'In transit' | 'Out for delivery' | 'Delayed' | 'Delivered';

function randomFrom(seed: number) {
  let state = seed;
  return (max: number) => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return Math.floor(state / 2 ** 32 * max);
  };
}
const random = randomFrom(20261109);
let sequence = 89000;
function buildOrder(age: number) {
  const product = catalog[random(catalog.length)];
  const facility = facilities[random(facilities.length)];
  const customer = given[random(given.length)] + ' ' + family[random(family.length)];
  const channelRoll = random(100);
  const channel = channels[channelRoll < 73 ? 0 : channelRoll < 94 ? 1 : 2];
  const quantity = 1 + (product.freight ? random(2) : random(4));
  const plannedDispatch = product.freight ? 3 + random(3) : random(10) < 2 ? 0 : 1 + random(2);
  const dispatchDelay = random(100) < 10 ? 1 + random(3) : 0;
  const actualDispatch = plannedDispatch + dispatchDelay;
  const travel = product.freight ? 4 + random(4) : 2 + random(3);
  const plannedArrival = plannedDispatch + travel;
  const actualArrival = actualDispatch + travel + (random(100) < 9 ? 1 + random(3) : 0);
  const statusRoll = random(100);
  const canceled = statusRoll < 4;
  const onHold = !canceled && statusRoll < 9 && age < 12;
  const dispatched = !canceled && !onHold && age >= actualDispatch;
  const scheduled = !canceled && !onHold && !dispatched && product.freight && age >= 1;
  const fulfillment: Fulfillment = canceled ? 'Canceled' : onHold ? 'On hold' : dispatched ? 'Fulfilled' : scheduled ? 'Scheduled' : 'Unfulfilled';
  const warehouseStage: WarehouseStage = onHold ? 'On hold' : dispatched ? 'Dispatched' : age === 0 ? 'Awaiting release'
    : age + 1 >= actualDispatch ? 'Ready to dispatch' : age >= 2 ? 'Packing' : 'Picking';
  const deliveryStage: DeliveryStage = scheduled ? 'Scheduled' : age >= actualArrival ? 'Delivered'
    : age >= plannedArrival ? 'Delayed' : age + 1 === actualArrival ? 'Out for delivery' : 'In transit';
  const payment = canceled ? (age > 1 ? 'Refunded' : 'Voided') : age === 0 && !dispatched && channel !== 'Retail store' && statusRoll < 55 ? 'Authorized' : 'Paid';
  const orderNumber = --sequence;
  return {
    id: product.brandCode + '-' + orderNumber, customer, product, quantity, total: product.price * quantity, channel,
    placed: dayAt(age), facility, fulfillment, payment,
    work: canceled ? undefined : {id: 'WO-' + orderNumber, status: warehouseStage, due: dayAt(age - plannedDispatch),
      dispatchedAt: dispatched ? dayAt(age - actualDispatch) : undefined, overdue: !dispatched && age > plannedDispatch},
    shipment: dispatched || scheduled ? {
      id: 'SH-' + orderNumber, carrier: product.freight ? 'White Glove Network' : ['UPS', 'FedEx', 'USPS'][random(3)],
      service: product.freight ? 'Room of choice' : 'Ground',
      tracking: dispatched ? 'TRK' + (40000000 + orderNumber) : undefined,
      status: deliveryStage, promised: dayAt(age - plannedArrival),
      delivered: deliveryStage === 'Delivered' ? dayAt(age - actualArrival) : undefined,
      onTime: deliveryStage === 'Delivered' && actualArrival <= plannedArrival,
    } : undefined,
  };
}
export const orders = Array.from({length: 30}, (_, age) =>
  Array.from({length: 71 + ((age * 17 % 30) * 53 + 11) % 55}, () => buildOrder(age)),
).flat();
export const shipments = orders.flatMap(order => order.shipment ? [{order, shipment: order.shipment}] : []);
export const warehouseWork = orders.flatMap(order => order.work ? [{order, work: order.work}] : []);
const committedByLocation = new Map<string, number>();
for (const {order, work} of warehouseWork) {
  if (work.dispatchedAt) continue;
  const key = order.product.sku + '/' + order.facility.id;
  committedByLocation.set(key, (committedByLocation.get(key) ?? 0) + order.quantity);
}
export const inventory = catalog.flatMap(product => facilities.map(facility => {
  const key = product.sku + '/' + facility.id;
  const available = random(100) < 9 ? random(5) : 12 + random(product.freight ? 73 : 280);
  const committed = committedByLocation.get(key) ?? 0;
  const unavailable = random(5);
  const incoming = random(100) < 22 ? 12 + random(75) : 0;
  return {id: key, product, facility, available, committed, unavailable, incoming, onHand: available + committed + unavailable};
}));
export const delivered = shipments.filter(({shipment}) => shipment.status === 'Delivered');
export const booked = orders.filter(order => order.fulfillment !== 'Canceled');
export const openWork = warehouseWork.filter(({work}) => !work.dispatchedAt);

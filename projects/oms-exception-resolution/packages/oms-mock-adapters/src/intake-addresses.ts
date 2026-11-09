type DeliveryAddress = {streetNumber: string; street: string; city: string; state: string; postalCode: string};
const address = (streetNumber: string, street: string, city: string, postalCode: string): DeliveryAddress =>
  ({streetNumber, street, city, postalCode, state: 'CA'});
const liam = address('214', 'Cedar Lane', 'San Francisco', '94114');

export const deliveryAddresses: Record<string, DeliveryAddress> = {
  'PB-10245': address('128', 'Juniper Lane', 'San Francisco', '94110'),
  'PB-10246': address('362', 'Oakview Drive', 'San Mateo', '94402'),
  'PB-10247': address('87', 'Bayside Court', 'Alameda', '94501'),
  'PB-10248': address('491', 'Maple Walk', 'Oakland', '94611'),
  'PB-10249': address('53', 'Harbor Grove', 'Richmond', '94804'),
  'PB-10250': address('710', 'Willow Lane', 'Berkeley', '94705'),
  'PB-10251': address('185', 'Sycamore Drive', 'Walnut Creek', '94596'),
  'PB-10252': address('429', 'Canyon Way', 'San Rafael', '94901'),
  'PB-10253': address('262', 'Meadow Court', 'Redwood City', '94062'),
  'PB-10254': liam,
  'PB-10255': address('147', 'Birch Way', 'Pacifica', '94044'),
  'PB-10256': address('308', 'Hillside Lane', 'Daly City', '94015'),
  'PB-10257': address('69', 'Cypress Court', 'South San Francisco', '94080'),
  'PB-10258': liam,
};

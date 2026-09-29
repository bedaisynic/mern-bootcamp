-- ONE database for all eight modules. Foreign keys cross module lines freely:
-- handy today, and the reason nobody can change `users` without checking
-- every other module's queries first.

CREATE TABLE users (                 -- users module
  id    SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name  TEXT NOT NULL
);

CREATE TABLE products (              -- catalog module
  sku      TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  price    NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL
);

CREATE TABLE inventory (             -- inventory module
  sku     TEXT PRIMARY KEY REFERENCES products (sku),
  on_hand INT  NOT NULL CHECK (on_hand >= 0)
);

CREATE TABLE cart_items (            -- cart module
  user_id  INT  NOT NULL REFERENCES users (id),
  sku      TEXT NOT NULL REFERENCES products (sku),
  quantity INT  NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (user_id, sku)
);

CREATE TABLE orders (                -- orders module
  id         SERIAL PRIMARY KEY,
  user_id    INT            NOT NULL REFERENCES users (id),
  status     TEXT           NOT NULL,
  total      NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  order_id   INT            NOT NULL REFERENCES orders (id),
  sku        TEXT           NOT NULL REFERENCES products (sku),
  quantity   INT            NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (order_id, sku)
);

CREATE TABLE payments (              -- payments module
  id         SERIAL PRIMARY KEY,
  order_id   INT            NOT NULL REFERENCES orders (id),
  amount     NUMERIC(10, 2) NOT NULL,
  status     TEXT           NOT NULL,
  created_at TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE TABLE notifications (         -- notifications module
  id         SERIAL PRIMARY KEY,
  user_id    INT         NOT NULL REFERENCES users (id),
  type       TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed data. The same users, SKUs, and stock levels as the microservices version.
INSERT INTO users (email, name) VALUES
  ('alice@shop.com', 'Alice'),
  ('bob@shop.com',   'Bob'),
  ('carol@shop.com', 'Carol');

INSERT INTO products (sku, name, price, category) VALUES
  ('SKU-1001', 'Running Shoes',        89.99,   'footwear'),
  ('SKU-1002', 'Hiking Boots',         149.00,  'footwear'),
  ('SKU-2001', '85" 8K TV',            5999.00, 'electronics'),  -- over $5,000: payment is declined
  ('SKU-2002', 'Wireless Headphones',  199.99,  'electronics'),
  ('SKU-2003', 'USB-C Cable',          12.99,   'electronics'),
  ('SKU-3001', 'Coffee Mug',           14.50,   'kitchen'),      -- only 1 in stock
  ('SKU-3002', 'Chef Knife',           79.00,   'kitchen');

INSERT INTO inventory (sku, on_hand) VALUES
  ('SKU-1001', 25),
  ('SKU-1002', 10),
  ('SKU-2001', 3),
  ('SKU-2002', 40),
  ('SKU-2003', 200),
  ('SKU-3001', 1),
  ('SKU-3002', 15);

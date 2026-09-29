-- One Postgres SERVER, four separate DATABASES, four separate LOGINS.
-- Each service's login can connect only to its own database, so Orders
-- physically cannot JOIN into the users table. In production these would
-- usually be four separate database instances; locally, sharing one server
-- keeps the container count down without sharing any data.

CREATE USER users_svc     WITH PASSWORD 'users_svc';
CREATE USER inventory_svc WITH PASSWORD 'inventory_svc';
CREATE USER orders_svc    WITH PASSWORD 'orders_svc';
CREATE USER payments_svc  WITH PASSWORD 'payments_svc';

CREATE DATABASE users_db     OWNER users_svc;
CREATE DATABASE inventory_db OWNER inventory_svc;
CREATE DATABASE orders_db    OWNER orders_svc;
CREATE DATABASE payments_db  OWNER payments_svc;

REVOKE CONNECT ON DATABASE users_db     FROM PUBLIC;
REVOKE CONNECT ON DATABASE inventory_db FROM PUBLIC;
REVOKE CONNECT ON DATABASE orders_db    FROM PUBLIC;
REVOKE CONNECT ON DATABASE payments_db  FROM PUBLIC;

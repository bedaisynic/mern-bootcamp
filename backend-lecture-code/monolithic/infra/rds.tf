# ---------------------------------------------------------------------------
# RDS Postgres — the managed relational database.
#
# Free-tier / cost choices:
#   - db.t3.micro, 20 GB gp2, Single-AZ (Multi-AZ is NOT free)
#   - backups disabled (backup_retention_period = 0) so there are no snapshot
#     charges and `destroy` is instant
#   - skip_final_snapshot + no deletion protection so teardown never blocks
# ---------------------------------------------------------------------------

# Generated password. We are intentionally NOT using Secrets Manager yet (it is
# a paid service). Instead this password is written into the EC2 instance's
# .env by user-data — which is exactly the pattern Secrets Manager exists to
# replace. Good talking point for the lecture.
resource "random_password" "db" {
  length  = 20
  special = false # keep it URL-safe for the DATABASE_URL connection string
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-db-subnets"
  subnet_ids = aws_subnet.private[*].id
  tags       = { Name = "${var.project}-db-subnets" }
}

# Custom parameter group so we can turn OFF forced SSL. RDS Postgres 15+ ships
# with rds.force_ssl = 1 by default, which rejects the app's plain (non-SSL)
# `pg` connection. The database sits in a private subnet reachable only from
# the app's security group, so unencrypted-in-VPC is acceptable for this demo.
# (Production alternative: keep SSL on and give the pg client the RDS CA cert.)
resource "aws_db_parameter_group" "main" {
  name_prefix = "${var.project}-pg-"
  family      = "postgres18"

  parameter {
    name         = "rds.force_ssl"
    value        = "0"
    apply_method = "immediate"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_db_instance" "main" {
  identifier     = "${var.project}-db"
  engine         = "postgres"
  instance_class = var.db_instance_class

  allocated_storage = var.db_allocated_storage
  storage_type      = "gp2"
  storage_encrypted = true # encryption at rest is free

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result
  port     = 5432

  db_subnet_group_name   = aws_db_subnet_group.main.name
  parameter_group_name   = aws_db_parameter_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = false

  # Cost + easy-teardown settings
  backup_retention_period = 0
  skip_final_snapshot     = true
  deletion_protection     = false
  apply_immediately       = true

  # Send Postgres logs to CloudWatch Logs (retention set in cloudwatch.tf).
  enabled_cloudwatch_logs_exports = ["postgresql"]

  tags = { Name = "${var.project}-db" }

  # Create the log group (with our retention) before RDS starts exporting, so
  # RDS reuses it instead of auto-creating a second, infinite-retention one.
  depends_on = [aws_cloudwatch_log_group.rds]
}

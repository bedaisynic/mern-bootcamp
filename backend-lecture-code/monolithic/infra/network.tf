# ---------------------------------------------------------------------------
# VPC — a small private network with public + private subnets.
#
# There is deliberately NO NAT Gateway (that is the one component here that
# would cost real money, ~$32/month). The EC2 box sits in a PUBLIC subnet with
# its own public IP so it can reach the internet directly. RDS sits in PRIVATE
# subnets and never needs outbound internet, so it needs no NAT either.
# ---------------------------------------------------------------------------

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = { Name = "${var.project}-vpc" }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "${var.project}-igw" }
}

# --- Public subnets (EC2 / load balancers live here) -----------------------
resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = { Name = "${var.project}-public-${count.index}" }
}

# --- Private subnets (RDS lives here; two AZs because RDS requires it) ------
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = { Name = "${var.project}-private-${count.index}" }
}

# --- Routing: public subnets get a default route to the internet -----------
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "${var.project}-public-rt" }
}

resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private subnets use the VPC's default route table (local traffic only) —
# no internet route, which is exactly what a database subnet should have.

# ---------------------------------------------------------------------------
# Security groups — the per-resource firewall from the Notes.
# ---------------------------------------------------------------------------

# EC2: allow the API port from anywhere (so the demo is reachable), SSH only
# when a key pair is configured, and all outbound.
resource "aws_security_group" "ec2" {
  name_prefix = "${var.project}-ec2-"
  description = "Backend EC2 instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "Express API"
    from_port   = var.api_port
    to_port     = var.api_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  dynamic "ingress" {
    for_each = var.key_name == null ? [] : [1]
    content {
      description = "SSH"
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = [var.allowed_ssh_cidr]
    }
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project}-ec2-sg" }

  lifecycle {
    create_before_destroy = true
  }
}

# RDS: accept Postgres (5432) ONLY from the EC2 security group. This is the
# "a rule can point at another security group" example from the Notes.
resource "aws_security_group" "rds" {
  name_prefix = "${var.project}-rds-"
  description = "RDS Postgres - reachable only from the app servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Postgres from EC2 only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project}-rds-sg" }

  lifecycle {
    create_before_destroy = true
  }
}

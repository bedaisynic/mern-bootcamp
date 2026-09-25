variable "project" {
  description = "Name prefix applied to every resource."
  type        = string
  default     = "monolithic-lecture"
}

variable "region" {
  description = "AWS region. us-east-1 is the cheapest and has the widest free-tier coverage."
  type        = string
  default     = "us-east-1"
}

# ---------------------------------------------------------------------------
# Compute
# ---------------------------------------------------------------------------
variable "ec2_instance_type" {
  description = "EC2 size. t3.micro is Free Tier eligible (750 hrs/month for 12 months)."
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = <<-EOT
    Optional EC2 key pair name for SSH. Leave null to skip SSH entirely and
    connect with SSM Session Manager instead (no key, no open port 22 needed):
      aws ssm start-session --target <instance-id>
  EOT
  type        = string
  default     = null
}

variable "allowed_ssh_cidr" {
  description = "CIDR allowed to reach SSH (22). Ignored unless key_name is set. Tighten to your IP/32 in real use."
  type        = string
  default     = "0.0.0.0/0"
}

variable "api_port" {
  description = "Port the Express app listens on (matches PORT in the app)."
  type        = number
  default     = 3100
}

# ---------------------------------------------------------------------------
# Database (RDS Postgres)
# ---------------------------------------------------------------------------
variable "db_instance_class" {
  description = "RDS size. db.t3.micro is Free Tier eligible (750 hrs/month for 12 months)."
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS storage in GB. Free Tier includes up to 20 GB."
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Initial database name (matches the app's DATABASE_URL)."
  type        = string
  default     = "lecture_db"
}

variable "db_username" {
  description = "Master DB username (matches the app's DATABASE_URL)."
  type        = string
  default     = "lecture"
}

# ---------------------------------------------------------------------------
# Frontend (S3 static website)
# ---------------------------------------------------------------------------
variable "frontend_dir" {
  description = <<-EOT
    Path to the built frontend to publish to S3, relative to this infra folder.
    Defaults to the monolithic-frontend Vite build. Build it with the deployed
    API URL first (see `make frontend-build`): the app bakes VITE_API_URL into
    the bundle at build time. If the folder does not exist yet, the bucket is
    created empty and you can build + re-apply later.
  EOT
  type        = string
  default     = "../../monolithic-frontend/dist"
}

# ---------------------------------------------------------------------------
# Ops
# ---------------------------------------------------------------------------
variable "log_retention_days" {
  description = "CloudWatch Logs retention. Keeps the bill flat (logs are kept forever by default)."
  type        = number
  default     = 7
}

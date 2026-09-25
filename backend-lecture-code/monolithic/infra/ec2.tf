# ---------------------------------------------------------------------------
# EC2 — the always-on backend server.
#
# Amazon Linux 2023, Free-Tier t3.micro, in a public subnet with a public IP.
# On boot, user-data installs Node + Redis, pulls the app tarball from S3,
# runs the DB migration, builds, and starts the API as a systemd service.
# ---------------------------------------------------------------------------

# Latest Amazon Linux 2023 AMI, resolved at apply time (no hard-coded AMI id).
data "aws_ssm_parameter" "al2023" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

locals {
  database_url = "postgres://${var.db_username}:${random_password.db.result}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${var.db_name}"

  user_data = templatefile("${path.module}/user_data.sh.tftpl", {
    region             = var.region
    deploy_bucket      = aws_s3_bucket.deploy.id
    app_object_key     = aws_s3_object.app_bundle.key
    src_hash           = local.src_hash # forces instance replacement on code change
    api_port           = var.api_port
    database_url       = local.database_url
    redis_url          = "redis://localhost:6379"
    app_log_group      = aws_cloudwatch_log_group.ec2_app.name
    userdata_log_group = aws_cloudwatch_log_group.ec2_userdata.name
    # #demo-s3 / #demo-secrets-manager
    s3_bucket      = aws_s3_bucket.uploads.id
    claude_api_key = "fake-demo-key-not-a-real-key"
  })
}

resource "aws_instance" "app" {
  ami                    = data.aws_ssm_parameter.al2023.value
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name
  key_name               = var.key_name

  user_data                   = local.user_data
  user_data_replace_on_change = true # redeploy code on `apply` by replacing the box

  root_block_device {
    volume_size = 10 # GB, gp3; well within the 30 GB Free-Tier EBS allowance
    volume_type = "gp3"
  }

  tags = { Name = "${var.project}-api" }

  # The app can't come up until the database exists, the tarball is
  # uploaded, and the uploads bucket exists (referenced in user_data).
  depends_on = [aws_db_instance.main, aws_s3_object.app_bundle, aws_s3_bucket.uploads]
}

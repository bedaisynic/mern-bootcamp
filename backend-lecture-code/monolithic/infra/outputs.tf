output "frontend_url" {
  description = "Public S3 website URL for the React frontend."
  value       = "http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}"
}

output "api_url" {
  description = "Backend API base URL (EC2 public DNS + app port)."
  value       = "http://${aws_instance.app.public_dns}:${var.api_port}"
}

output "api_health_check" {
  description = "Quick way to confirm the backend + RDS are up."
  value       = "http://${aws_instance.app.public_dns}:${var.api_port}/health"
}

output "lambda_url" {
  description = "Public Function URL for the hello-world Lambda."
  value       = aws_lambda_function_url.hello.function_url
}

output "ec2_instance_id" {
  description = "Connect with: aws ssm start-session --target <id>"
  value       = aws_instance.app.id
}

output "ec2_public_ip" {
  value = aws_instance.app.public_ip
}

output "rds_endpoint" {
  description = "RDS Postgres host:port (private — reachable only from the EC2 box)."
  value       = "${aws_db_instance.main.address}:${aws_db_instance.main.port}"
}

output "cloudwatch_dashboard_url" {
  value = "https://${var.region}.console.aws.amazon.com/cloudwatch/home?region=${var.region}#dashboards/dashboard/${aws_cloudwatch_dashboard.main.dashboard_name}"
}

output "uploads_bucket" {
  description = "S3 bucket product images are uploaded to (#demo-s3)."
  value       = aws_s3_bucket.uploads.id
}

output "db_password" {
  description = "Generated DB password (would live in Secrets Manager in a real setup)."
  value       = random_password.db.result
  sensitive   = true
}

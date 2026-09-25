# ---------------------------------------------------------------------------
# CloudWatch — logs, one alarm, and a dashboard.
#
# Every log group has an explicit retention. Log groups keep logs FOREVER by
# default (the Notes' gotcha), which is the usual way a "free" setup starts
# costing money.
# ---------------------------------------------------------------------------

# --- Log groups the EC2 CloudWatch agent ships into ------------------------
resource "aws_cloudwatch_log_group" "ec2_app" {
  name              = "/${var.project}/ec2/app"
  retention_in_days = var.log_retention_days
}

resource "aws_cloudwatch_log_group" "ec2_userdata" {
  name              = "/${var.project}/ec2/user-data"
  retention_in_days = var.log_retention_days
}

# --- Lambda's log group. Lambda logs to CloudWatch automatically, but the
# group is created here so its retention is capped instead of infinite. -----
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${var.project}-hello"
  retention_in_days = var.log_retention_days
}

# --- RDS Postgres log group (populated by enabled_cloudwatch_logs_exports) --
resource "aws_cloudwatch_log_group" "rds" {
  name              = "/aws/rds/instance/${var.project}-db/postgresql"
  retention_in_days = var.log_retention_days
}

# --- Alarm: fires when EC2 CPU is pegged. No notification action is wired up
# (that would need SNS); the point is to show what an alarm looks like and how,
# in a real setup, it would drive an Auto Scaling action. --------------------
resource "aws_cloudwatch_metric_alarm" "ec2_cpu_high" {
  alarm_name          = "${var.project}-ec2-cpu-high"
  alarm_description   = "EC2 CPU over 80% for 10 minutes"
  namespace           = "AWS/EC2"
  metric_name         = "CPUUtilization"
  statistic           = "Average"
  period              = 300
  evaluation_periods  = 2
  threshold           = 80
  comparison_operator = "GreaterThanThreshold"
  treat_missing_data  = "notBreaching"

  dimensions = {
    InstanceId = aws_instance.app.id
  }
}

# --- One dashboard tying the whole stack together --------------------------
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = var.project

  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric", x = 0, y = 0, width = 12, height = 6,
        properties = {
          title   = "EC2 CPU %",
          region  = var.region,
          metrics = [["AWS/EC2", "CPUUtilization", "InstanceId", aws_instance.app.id]]
        }
      },
      {
        type = "metric", x = 12, y = 0, width = 12, height = 6,
        properties = {
          title   = "EC2 memory % (CloudWatch agent)",
          region  = var.region,
          metrics = [["Monolithic/EC2", "mem_used_percent", "InstanceId", aws_instance.app.id]]
        }
      },
      {
        type = "metric", x = 0, y = 6, width = 12, height = 6,
        properties = {
          title  = "RDS CPU % and connections",
          region = var.region,
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", aws_db_instance.main.identifier],
            ["AWS/RDS", "DatabaseConnections", "DBInstanceIdentifier", aws_db_instance.main.identifier]
          ]
        }
      },
      {
        type = "metric", x = 12, y = 6, width = 12, height = 6,
        properties = {
          title  = "Lambda invocations and errors",
          region = var.region,
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", aws_lambda_function.hello.function_name],
            ["AWS/Lambda", "Errors", "FunctionName", aws_lambda_function.hello.function_name]
          ]
        }
      }
    ]
  })
}

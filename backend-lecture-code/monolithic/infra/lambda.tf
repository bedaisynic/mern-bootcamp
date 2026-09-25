# ---------------------------------------------------------------------------
# Lambda — a hello-world function with a public Function URL.
#
# Free tier: 1M requests + 400,000 GB-seconds per month, always free. A
# Function URL is used instead of API Gateway so there is nothing extra to pay
# for and the demo opens straight in a browser.
# ---------------------------------------------------------------------------

# Zip the tiny function folder. archive_file is fine here — no node_modules.
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/build/lambda.zip"
}

# Execution role. The only permission it needs is to write its own logs, which
# is exactly what the AWS-managed basic-execution policy grants.
data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = "${var.project}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "hello" {
  function_name    = "${var.project}-hello"
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256
  timeout          = 10
  memory_size      = 128

  # Use the log group defined in cloudwatch.tf (so retention is capped).
  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_cloudwatch_log_group.lambda,
  ]
}

# Public URL — no auth, fine for a hello-world demo. Open it in a browser.
resource "aws_lambda_function_url" "hello" {
  function_name      = aws_lambda_function.hello.function_name
  authorization_type = "NONE"
}

# A Function URL with authorization_type = NONE still needs a resource-based
# permission that actually allows the public to invoke it. Without this, the
# URL returns "Forbidden".
resource "aws_lambda_permission" "hello_url" {
  statement_id           = "AllowPublicFunctionUrlInvoke"
  action                 = "lambda:InvokeFunctionUrl"
  function_name          = aws_lambda_function.hello.function_name
  principal              = "*"
  function_url_auth_type = "NONE"
}

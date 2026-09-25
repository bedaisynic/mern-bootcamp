# ---------------------------------------------------------------------------
# IAM for the EC2 instance.
#
# The Notes' rule: give code a ROLE, not access keys. The instance assumes this
# role and the AWS SDK / CLI on the box picks up temporary credentials
# automatically. Three grants, each least-privilege:
#   1. SSM              -> connect with Session Manager, no SSH key needed
#   2. CloudWatch agent -> ship logs + memory metrics
#   3. Read deploy bucket -> download the app tarball on boot
# ---------------------------------------------------------------------------

data "aws_iam_policy_document" "ec2_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ec2" {
  name               = "${var.project}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume.json
}

# AWS-managed policies for the two agents.
resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy_attachment" "ec2_cw_agent" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

# Least-privilege inline policy: read ONLY the app object in ONLY the deploy
# bucket. This mirrors the S3 policy example in the Notes.
data "aws_iam_policy_document" "ec2_read_deploy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.deploy.arn}/*"]
  }
  statement {
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.deploy.arn]
  }
}

resource "aws_iam_role_policy" "ec2_read_deploy" {
  name   = "read-deploy-bucket"
  role   = aws_iam_role.ec2.id
  policy = data.aws_iam_policy_document.ec2_read_deploy.json
}

# #demo-s3 — the app signs presigned URLs with THIS role's credentials, so
# the signature is only good for what this role is allowed to do. Without
# this grant, a presigned PUT would sign successfully (signing never checks
# permissions) but fail with AccessDenied the moment the browser actually
# uses it.
data "aws_iam_policy_document" "ec2_uploads_bucket" {
  statement {
    actions   = ["s3:GetObject", "s3:PutObject"]
    resources = ["${aws_s3_bucket.uploads.arn}/*"]
  }
  statement {
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.uploads.arn]
  }
}

resource "aws_iam_role_policy" "ec2_uploads_bucket" {
  name   = "uploads-bucket"
  role   = aws_iam_role.ec2.id
  policy = data.aws_iam_policy_document.ec2_uploads_bucket.json
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.project}-ec2-profile"
  role = aws_iam_role.ec2.name
}

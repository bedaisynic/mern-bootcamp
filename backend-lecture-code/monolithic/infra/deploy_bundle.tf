# ---------------------------------------------------------------------------
# App delivery to EC2.
#
# We tar up the backend source (everything except node_modules / dist / infra /
# secrets), upload it to a private "deploy" S3 bucket, and the EC2 box pulls it
# on boot. This keeps the whole deploy self-contained in Terraform — no git
# credentials on the server, no manual scp.
# ---------------------------------------------------------------------------

locals {
  # Hash of the source files that matter. When any of these change, the tarball
  # is rebuilt, re-uploaded, and (because src_hash flows into user-data) the
  # EC2 instance is replaced so it pulls the new code on the next `apply`.
  backend_root = "${path.module}/.."

  src_files = fileset(local.backend_root, "src/**")

  src_hash = sha1(join("", concat(
    [for f in local.src_files : filesha1("${local.backend_root}/${f}")],
    [
      filesha1("${local.backend_root}/package.json"),
      filesha1("${local.backend_root}/package-lock.json"),
      filesha1("${local.backend_root}/tsconfig.json"),
      filesha1("${local.backend_root}/drizzle.config.ts"),
    ]
  )))

  bundle_path = "${path.module}/build/app.tar.gz"
}

# Build the tarball locally at apply time. `tar --exclude` reliably drops whole
# directories (node_modules etc.), which archive_file cannot do cleanly.
resource "null_resource" "app_bundle" {
  triggers = {
    src_hash = local.src_hash
  }

  provisioner "local-exec" {
    command = <<-EOT
      mkdir -p "${path.module}/build"
      tar \
        --exclude='./node_modules' \
        --exclude='./dist' \
        --exclude='./infra' \
        --exclude='./.git' \
        --exclude='./.env' \
        -czf "${local.bundle_path}" \
        -C "${local.backend_root}" .
    EOT
  }
}

# Private bucket that just holds the app tarball. force_destroy lets `destroy`
# delete it even though it still contains the object.
resource "aws_s3_bucket" "deploy" {
  bucket_prefix = "${var.project}-deploy-"
  force_destroy = true
  tags          = { Name = "${var.project}-deploy" }
}

resource "aws_s3_bucket_public_access_block" "deploy" {
  bucket                  = aws_s3_bucket.deploy.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_object" "app_bundle" {
  bucket = aws_s3_bucket.deploy.id
  key    = "app.tar.gz"
  source = local.bundle_path

  # Re-upload whenever the source hash changes. Using source_hash (not etag)
  # avoids reading the file during `plan`, when it may not exist yet.
  source_hash = local.src_hash

  depends_on = [null_resource.app_bundle]
}

# ---------------------------------------------------------------------------
# S3 static website — hosts the built React frontend.
#
# Cheapest possible setup: plain S3 website hosting, no CloudFront. The bucket
# is made public-read via a bucket policy (the ONLY safe reason to open a
# bucket — a public website). error_document = index.html gives the SPA its
# client-side-routing fallback.
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "frontend" {
  bucket_prefix = "${var.project}-frontend-"
  force_destroy = true # let `destroy` empty + delete it
  tags          = { Name = "${var.project}-frontend" }
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "index.html" # SPA fallback: unknown paths return the app shell
  }
}

# A website bucket has to allow public access; turn off the account/bucket
# "block public access" guards so the policy below can take effect.
resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket                  = aws_s3_bucket.frontend.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

data "aws_iam_policy_document" "frontend_public_read" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.frontend.arn}/*"]
    principals {
      type        = "*"
      identifiers = ["*"]
    }
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket     = aws_s3_bucket.frontend.id
  policy     = data.aws_iam_policy_document.frontend_public_read.json
  depends_on = [aws_s3_bucket_public_access_block.frontend]
}

# --- Upload the built files -------------------------------------------------
# fileset returns an empty set if frontend_dir doesn't exist yet, so `apply`
# still succeeds (the bucket is just empty). Build the frontend first — see the
# README / `make frontend-build` — then re-apply, or `aws s3 sync` manually.
locals {
  frontend_files = fileset(var.frontend_dir, "**")

  mime_types = {
    html  = "text/html"
    js    = "application/javascript"
    mjs   = "application/javascript"
    css   = "text/css"
    json  = "application/json"
    map   = "application/json"
    svg   = "image/svg+xml"
    png   = "image/png"
    jpg   = "image/jpeg"
    jpeg  = "image/jpeg"
    gif   = "image/gif"
    ico   = "image/x-icon"
    webp  = "image/webp"
    woff  = "font/woff"
    woff2 = "font/woff2"
    ttf   = "font/ttf"
    txt   = "text/plain"
    xml   = "application/xml"
    wasm  = "application/wasm"
  }
}

resource "aws_s3_object" "frontend" {
  for_each = local.frontend_files

  bucket = aws_s3_bucket.frontend.id
  key    = each.value
  source = "${var.frontend_dir}/${each.value}"

  # source_hash (not etag) detects changes without comparing to S3's returned
  # etag, which for large multipart uploads isn't a plain MD5 — avoids a
  # perpetual "update in-place" diff on big files.
  source_hash  = filemd5("${var.frontend_dir}/${each.value}")
  content_type = lookup(local.mime_types, lower(element(reverse(split(".", each.value)), 0)), "application/octet-stream")
}

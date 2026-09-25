# ---------------------------------------------------------------------------
# S3 — product image uploads (#demo-s3 in the app).
#
# Unlike the frontend bucket, this one stays fully private — public access
# block stays ON. Access is only ever through a presigned URL, signed by the
# EC2 role's own credentials, which works regardless of the bucket's public
# access settings. That's the whole point of presigning: the bucket never
# has to be public for the browser to be able to PUT to it directly.
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "uploads" {
  bucket_prefix = "${var.project}-uploads-"
  force_destroy = true # let `destroy` empty + delete it
  tags          = { Name = "${var.project}-uploads" }
}

# Needed because the upload itself is a direct browser -> S3 PUT: the
# frontend's origin is different from the bucket's, so without CORS the
# browser blocks the request before it ever reaches S3. Wide open (*) to
# match how open the rest of this lecture demo already is (the Express API
# itself runs cors() with no origin restriction either).
resource "aws_s3_bucket_cors_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  cors_rule {
    allowed_methods = ["PUT", "GET"]
    allowed_origins = ["*"]
    allowed_headers = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

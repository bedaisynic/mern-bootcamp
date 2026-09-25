provider "aws" {
  region = var.region

  # Every resource gets these tags. Makes the whole stack easy to find in the
  # console and, if a `destroy` ever misses something, easy to clean up by tag.
  default_tags {
    tags = {
      Project   = var.project
      ManagedBy = "terraform"
      Lecture   = "day15-aws-deployment"
    }
  }
}

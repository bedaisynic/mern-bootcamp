# Convenience wrapper around Terraform for the Day 15 AWS deploy.
# Run these from the infra/ folder.

FRONTEND := ../../monolithic-frontend

.PHONY: help init plan apply deploy frontend-build destroy output fmt

help:
	@echo "make init            - one-time: download providers"
	@echo "make frontend-build  - build monolithic-frontend against the deployed API URL"
	@echo "make deploy          - apply infra, build frontend vs the live API, apply again"
	@echo "make apply           - terraform apply (no frontend rebuild)"
	@echo "make output          - show URLs + connection info"
	@echo "make destroy         - tear EVERYTHING down (stops all cost)"

init:
	terraform init

plan:
	terraform plan

# The frontend bakes VITE_API_URL into its bundle at build time, so it needs the
# API URL from a deployed stack. Pull it from terraform output, then build.
frontend-build:
	API_URL=$$(terraform output -raw api_url) && cd $(FRONTEND) && npm install && VITE_API_URL=$$API_URL npm run build

# Full path: stand up the infra (so the API URL exists), build the frontend
# against it, then apply again to upload the built site to S3.
deploy:
	terraform apply -auto-approve
	$(MAKE) frontend-build
	terraform apply -auto-approve

apply:
	terraform apply

output:
	terraform output

fmt:
	terraform fmt

# One command to shut it all off. RDS, EC2, S3, Lambda, logs — gone.
destroy:
	terraform destroy

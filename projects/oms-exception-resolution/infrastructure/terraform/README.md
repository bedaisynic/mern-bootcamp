# AWS deployment design

Publish one image to ECR per release. Define three ECS Fargate task definitions with separate commands, IAM task roles and CloudWatch log groups. Put the two feature services in private subnets with ECS service discovery. Route `/api` to the BFF through an ALB. Serve the built frontend from an S3 origin behind CloudFront and forward API requests to the ALB.

Provision an RDS PostgreSQL version that supports pgvector. Use distinct credentials and schema grants for the resolution and investigation services. Run Prisma migrations as release jobs. Index policies from a private S3 bucket using an investigation maintenance task with a dedicated task role.

Use MSK with TLS, authenticated KafkaJS connections, provisioned topics, and replication across availability zones. Restrict each task to its topics and consumer groups. Store database credentials, service authentication, and the AI key in Secrets Manager. Disable demo sign-in and implement OIDC before exposing the BFF publicly. The local topic bootstrap and single-replica settings are for development.

Track consumer lag, queued investigation age, outbox backlog, dead-letter rates, and resolution failure rates in CloudWatch. Treat approval and audit records as sensitive and apply role-based access and retention rules. AWS resources are described here as a deployment design.

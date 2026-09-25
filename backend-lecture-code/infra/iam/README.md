# infra/iam/ — example group policies

Five plain IAM policy documents — not Terraform, and not wired into any
running app or frontend. Meant to be opened one at a time during the
lecture: "here's what a Developer can touch, here's what an Auditor can
touch." Bucket and function names (`monolithic-shop-*`) are illustrative —
match the shape of this app, not actual deployed resource names.

| Group | File | Can do |
| --- | --- | --- |
| Developers | [`developers.json`](./developers.json) | Read/write the app's S3 upload bucket, read its CloudWatch logs |
| Read-only / Auditors | [`read-only-auditors.json`](./read-only-auditors.json) | View S3, RDS, and CloudWatch — nothing they can change or delete |
| DevOps / Admins | [`devops-admins.json`](./devops-admins.json) | Full control of EC2, RDS, and the app's S3 buckets |
| Data / Analytics | [`data-analytics.json`](./data-analytics.json) | Read-only on one S3 bucket (a data lake) — nothing else, at all |
| CI/CD deploy role | [`cicd-deploy.json`](./cicd-deploy.json) | Push to the deploy bucket, update Lambda code — nothing broader |

## Reading these side by side

Worth putting **Data/Analytics** and **DevOps/Admins** next to each other —
same shape of document, wildly different blast radius. One statement vs.
three; one bucket vs. `ec2:*`. That contrast *is* the lesson on least
privilege from the Notes: grant only what the job needs, and "the job" can
be almost nothing (Data/Analytics) or almost everything (DevOps/Admins) —
the policy document is what draws that line, not trust in the person.

**DevOps/Admins is worth a pause, too.** Its `ec2:*` statement is doing
double duty for both "manage EC2 instances" and "manage the VPC" — in real
AWS IAM, VPC resources (subnets, security groups, route tables, the VPC
itself) are controlled by `ec2:*` actions, not a separate `vpc:*`
namespace. A genuinely common surprise the first time someone tries to
scope a policy down.

## Not the same thing as `monolithic/infra/iam.tf`

This project's real Terraform deployment defines its own IAM roles in
`monolithic/infra/iam.tf` — but those are **service roles** (what the EC2
instance and the Lambda are each allowed to do), not the **human/team
groups** these five files are about. Different question entirely: one is
"what can this piece of infrastructure do," the other is "what can this
person on the team do." Worth showing both, but they don't overlap.

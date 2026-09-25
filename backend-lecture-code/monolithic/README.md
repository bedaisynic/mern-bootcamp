# monolithic

Bare Express + TypeScript scaffold — a lecture playground, not a project. `src/server.ts` has
nothing but a health check; everything else gets built live.

```bash
npm install
npm run dev   # nodemon + ts-node, restarts on save
```

Start the Docker postgresql instance
```bash
docker-compose up
```

## Deploying to AWS (Terraform)

All commands below run from the `infra/` folder (`cd infra`), via the
`Makefile` wrapper. First-time setup needs `aws configure` (or
`aws sso login`) with credentials for the target account — see
`infra/README.md` for the full write-up of what gets built and what it
costs.

```bash
make init              # one-time: download the Terraform providers
make plan              # preview changes — always safe, never touches AWS
make deploy            # apply infra, build the frontend vs the live API, apply again
make output            # print the live URLs (frontend, API, Lambda, dashboard, ...)
make destroy           # tear EVERYTHING down — stops all cost
```

`make deploy` is the two-phase path this project is built around: it
applies infra first (so the EC2 instance's URL exists), rebuilds
`monolithic-frontend` with that URL baked in via `VITE_API_URL`, then
applies again to upload the correctly-built frontend to S3. Changing any
backend source file and re-running `make deploy` redeploys it — the app
tarball's hash changes, which replaces the EC2 instance.

Rough timing: a fresh `make deploy` is ~5–10 min (RDS is the slow part) plus
~2–3 min of EC2 boot before `/health` comes up. `make destroy` is similar,
mostly waiting on RDS to delete.

Other useful commands:

```bash
make apply             # terraform apply only, no frontend rebuild
make frontend-build    # rebuild the frontend against the currently-deployed API URL
make fmt               # terraform fmt

# seed a small demo dataset (10 products) against the deployed API
../seed-demo-api.sh

# run a one-off command on the deployed EC2 instance via SSM (no SSH key needed)
aws ssm send-command \
  --instance-ids "$(terraform output -raw ec2_instance_id)" \
  --document-name "AWS-RunShellScript" \
  --parameters 'commands=["<command here>"]' \
  --query "Command.CommandId" --output text

# check that command's result
aws ssm get-command-invocation --instance-id <INSTANCE_ID> --command-id <COMMAND_ID>
```

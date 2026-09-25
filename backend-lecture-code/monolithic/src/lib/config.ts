import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

// #demo-secrets-manager (see DEMOS.md)
//
// One function, two code paths, picked by an env flag — not by whether
// you're "in prod" or not, so the same code runs identically in both:
//   - AWS_SECRETS_ENABLED=false (every local/dev run): read straight out of
//     process.env, same as every other config value in this project.
//   - AWS_SECRETS_ENABLED=true (a real deployment): fetch the secret from
//     AWS Secrets Manager by ID, so the actual value never has to live in
//     an .env file, a Terraform variable, or git.
//
// This project's real Terraform deploy (infra/) skips Secrets Manager on
// purpose (it's a paid service) and writes the DB password straight into
// the EC2 .env instead — the exact anti-pattern this function exists to
// fix. See infra/README.md.

const secretsClient = new SecretsManagerClient({});

// secrets rarely change mid-run; cache each one after the first fetch
// instead of calling Secrets Manager on every single request.
const secretCache = new Map<string, string>();

async function fetchFromSecretsManager(secretId: string): Promise<string> {
  const cached = secretCache.get(secretId);
  if (cached !== undefined) return cached;

  const result = await secretsClient.send(new GetSecretValueCommand({ SecretId: secretId }));
  const value = result.SecretString;
  if (!value) {
    throw new Error(`secret "${secretId}" has no SecretString`);
  }

  secretCache.set(secretId, value);
  return value;
}

// getSecret("CLAUDE_API_KEY") — the env var name doubles as the key under
// which AWS_SECRETS_ENABLED=true looks up SECRETS_MANAGER_SECRET_ID.
export async function getSecret(envVarName: string): Promise<string> {
  if (process.env.AWS_SECRETS_ENABLED === "true") {
    const secretId = process.env.SECRETS_MANAGER_SECRET_ID;
    if (!secretId) {
      throw new Error("SECRETS_MANAGER_SECRET_ID is required when AWS_SECRETS_ENABLED=true");
    }
    return fetchFromSecretsManager(secretId);
  }

  const value = process.env[envVarName];
  if (!value) {
    throw new Error(`missing required env var: ${envVarName}`);
  }
  return value;
}

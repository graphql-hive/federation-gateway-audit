process.loadEnvFile();

export const env = {
  PUNISH_FOR_POOR_PLANS: "1",
  ...process.env,
};

export interface Env {
  PUNISH_FOR_POOR_PLANS?: "1" | "0";
}

export function shouldPunishForPoorPlans(context: { env: Env }) {
  return context.env.PUNISH_FOR_POOR_PLANS === "1";
}

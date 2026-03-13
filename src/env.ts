let env_loaded = false;

export function shouldPunishForPoorPlans() {
  if (!env_loaded) {
    try {
      process.loadEnvFile();
    } catch (e) {
      // Ignore if `.env` is not available
    }
    env_loaded = true;
  }
  return process.env.PUNISH_FOR_POOR_PLANS === "1";
}

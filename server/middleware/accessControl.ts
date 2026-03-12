import { isUserAuthorized, logAccessAttempt } from "../db";

export async function checkUserAccess(email: string, ipAddress?: string, userAgent?: string) {
  const isAuthorized = await isUserAuthorized(email);
  
  if (!isAuthorized) {
    await logAccessAttempt({
      email,
      status: "denied",
      reason: "User not in whitelist",
      ipAddress,
      userAgent,
    });
    return false;
  }
  
  await logAccessAttempt({
    email,
    status: "allowed",
    ipAddress,
    userAgent,
  });
  
  return true;
}

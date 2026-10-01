export interface PreparedEmail {
  message: { from: string; to: string; subject: string; html: string; text: string; reply_to: string };
  templateId: string;
}

export class EmailDeliveryError extends Error {
  constructor(message: string, public readonly manualReview = false) { super(message); }
}

/** SDK v2 cannot set Idempotency-Key; keep this call scoped to queued emails. */
export async function deliverPreparedEmail(email: PreparedEmail, key: string): Promise<string> {
  if (!process.env.RESEND_API_KEY) throw new EmailDeliveryError("Resend is not configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key },
    body: JSON.stringify(email.message),
    signal: AbortSignal.timeout(8000),
  });
  const result = await response.json() as { id?: string; name?: string };
  if (!response.ok || !result.id) {
    const permanent = result.name === "invalid_idempotent_request" ||
      ([400, 422].includes(response.status) && result.name !== "concurrent_idempotent_requests");
    throw new EmailDeliveryError(`Email provider rejected delivery (${response.status}, ${result.name ?? "unknown"})`, permanent);
  }
  return result.id;
}

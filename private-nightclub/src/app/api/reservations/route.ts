import { handleSubmission } from "@/lib/submit";

export async function POST(req: Request) {
  return handleSubmission(req, {
    required: ["name", "phone", "email", "date", "partySize"],
    webhookEnv: "RESERVATIONS_WEBHOOK_URL",
    label: "vip-reservation",
  });
}

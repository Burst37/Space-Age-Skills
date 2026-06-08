---
name: vapi-orchestrator
version: 1.0.0
description: Vapi agent configuration and outbound call deployment. Use for configuring AI voice agents, deploying outbound call campaigns, and managing Vapi assistants.
allowed-tools: Bash, Read, Write
---

# VAPI ORCHESTRATOR v1.0.0
## Space Age AI Solutions — Voice AI Agent System

## When to load this skill

- Configuring a Vapi voice agent
- Deploying outbound call campaigns
- Building phone-based AI workflows
- Cold outreach via voice (Phase 7.5 of production pipeline)

---

## VAPI ASSISTANT CONFIGURATION

```json
{
  "name": "[Brand] AI Assistant",
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "[System prompt — personality, goals, script]"
      }
    ]
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "[ElevenLabs voice ID]"
  },
  "firstMessage": "[Opening line when call connects]",
  "endCallMessage": "[What to say before hanging up]",
  "endCallPhrases": ["goodbye", "talk later", "that's all"],
  "recordingEnabled": true,
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "en"
  }
}
```

---

## OUTBOUND CALL DEPLOYMENT

```bash
# Deploy outbound call via Vapi API
curl -X POST https://api.vapi.ai/call/phone \
  -H "Authorization: Bearer $VAPI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "[assistant-id]",
    "customer": {
      "number": "+1[phone_number]",
      "name": "[Contact Name]"
    },
    "phoneNumberId": "[vapi-phone-number-id]"
  }'
```

---

## PRODUCTION PIPELINE INTEGRATION

For Space Age cold outreach (Phase 7.5):

```yaml
CALL_SCRIPT_TEMPLATE:
  opening: "Hey, is this [owner_name]?"
  intro: "This is John from Space Age AI Solutions — I sent you an email earlier."
  value_prop_bucket_a: "Your current site is missing AI optimization and an SEO structure."
  value_prop_bucket_b: "You don't have a website yet, so you're invisible on Google."
  pivot: "I went ahead and built you a demo — it's live right now."
  cta: "I just need 10 minutes to walk you through it. When are you free this week?"
  voicemail: "Hey [name], this is John from Space Age AI. I built a demo for [business] — check the email I sent, the link is in there."
```

---

## WEBHOOK HANDLING

Set up Vapi webhooks to track call outcomes:

```json
{
  "serverUrl": "https://[your-vps].digitalocean.app/vapi/webhook",
  "serverUrlSecret": "[webhook-secret]"
}
```

Events to handle:
- `call.started` — log call initiation
- `call.ended` — capture outcome + duration
- `transcript.completed` — save full transcript
- `speech.update` — real-time transcription

---

## WHAT TO AVOID

- Don't deploy outbound calls without a valid US business phone number registered with Vapi
- Don't call numbers without confirming DNC (Do Not Call) compliance
- Don't use Vapi for HIPAA-covered communications without compliance review
- Always record calls (legal in most states with automated disclosure)

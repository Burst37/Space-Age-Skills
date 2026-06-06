---
name: vapi-orchestrator
display_name: SPACE AGE — Vapi Orchestrator
version: 1.0.0
last_updated: 2026-04-18
description: >
  Takes the outreach-copywriter vapi_script output and the lead build_brief and produces
  a complete, ready-to-deploy Vapi agent configuration JSON. One skill call = one Vapi
  agent deployed and one outbound call queued. Knows Vapi's full API surface — assistants,
  phone numbers, calls, squads, tools, and webhooks. Use IMMEDIATELY when a lead needs
  to be called. Trigger on: "deploy the vapi agent", "make the call", "set up the voice
  agent", "queue the outbound call", or when n8n reaches the voice agent step.
---

# VAPI ORCHESTRATOR SKILL
## Space Age AI Solutions — Voice Agent Deployment Layer

This skill takes the Vapi script from outreach-copywriter and the business data from lead-to-brief and produces everything needed to deploy a live outbound Vapi agent in one n8n HTTP call.

---

## VAPI PLATFORM OVERVIEW

**Platform:** vapi.ai
**Recommended voice:** `shimmer` (ElevenLabs — warm, professional, female)
**Phone provider:** Twilio (provision numbers through Vapi dashboard)
**Cost:** ~$0.07–$0.15/minute of call time
**Average call time for this script:** 2–4 minutes
**Cost per call attempt:** ~$0.20–$0.60

---

## OUTPUT — VAPI ASSISTANT CONFIG

This is the complete JSON payload for the Vapi `POST /assistant` endpoint:

```json
{
  "name": "{business_name_slug}-outreach-agent",
  "model": {
    "provider": "anthropic",
    "model": "claude-haiku-4-5-20251001",
    "temperature": 0.7,
    "systemPrompt": "{vapi_system_prompt}"
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "shimmer",
    "stability": 0.6,
    "similarityBoost": 0.75,
    "style": 0.3,
    "useSpeakerBoost": true
  },
  "firstMessage": "{vapi_script.first_message}",
  "transcriber": {
    "provider": "deepgram",
    "model": "nova-2",
    "language": "en-US"
  },
  "endCallFunctionEnabled": true,
  "endCallPhrases": [
    "goodbye",
    "take care",
    "have a good day",
    "not interested",
    "remove me"
  ],
  "endCallMessage": "{vapi_script.exit_negative.message}",
  "recordingEnabled": true,
  "hipaaEnabled": false,
  "silenceTimeoutSeconds": 30,
  "maxDurationSeconds": 300,
  "backgroundDenoisingEnabled": true,
  "metadata": {
    "lead_id": "{brief_id}",
    "business_name": "{business_name}",
    "pipeline": "space-age-outreach-v1"
  },
  "analysisPlan": {
    "summaryPrompt": "Summarize this sales call in 2 sentences. State the outcome: booked / interested / declined / callback. Note any specific objections.",
    "structuredDataSchema": {
      "type": "object",
      "properties": {
        "outcome": {
          "type": "string",
          "enum": ["booked", "interested_no_book", "declined", "no_answer", "callback"]
        },
        "price_discussed": { "type": "boolean" },
        "callback_requested": { "type": "boolean" },
        "callback_time": { "type": "string" },
        "objections": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    }
  },
  "serverUrl": "{n8n_webhook_url}/vapi-outcomes",
  "serverUrlSecret": "{VAPI_WEBHOOK_SECRET}"
}
```

---

## OUTPUT — VAPI SYSTEM PROMPT

Generate this from the vapi_script block. This is what the LLM inside Vapi reads:

```
You are a professional sales representative calling on behalf of Space Age AI Solutions.
Your name is [AGENT_NAME]. You are calling {business_name} at {phone}.

YOUR MISSION:
You have already built {business_name} a free website preview at {preview_url}.
Your goal is to let them know about it, get them to view it, and book a 10-minute call
with our team. If they're interested and price is a barrier, you can go as low as $400.

YOUR SCRIPT:
[PASTE vapi_script nodes here as labeled sections]

RULES:
- Never claim to be human if directly asked
- Never pressure. Move on gracefully if they decline.
- Always state your reason for calling in the first 10 seconds
- If they want to be removed from calls: apologize, confirm removal, end call
- If they ask for the website URL: spell it out slowly and offer to text it
- Speak naturally — short sentences, normal pace
- On booking: trigger the send_sms tool to send the Calendly link
```

---

## OUTPUT — OUTBOUND CALL PAYLOAD

After creating the assistant, queue the call:

```json
{
  "assistantId": "{created_assistant_id}",
  "phoneNumberId": "{your_twilio_number_id}",
  "customer": {
    "number": "{lead_phone_e164}",
    "name": "{business_name}"
  },
  "scheduledAt": "{ISO_timestamp}",
  "metadata": {
    "lead_id": "{brief_id}",
    "crm_update_url": "{n8n_webhook}/crm-update"
  }
}
```

**Best call times for local service businesses:**
- Tuesday–Thursday: 9am–11am or 2pm–4pm local time
- Avoid: Monday morning, Friday afternoon, weekends
- Schedule calls during business hours of the prospect's timezone

---

## N8N WORKFLOW NODES (3 API calls)

```javascript
// NODE 1 — Create Vapi Assistant
POST https://api.vapi.ai/assistant
Authorization: Bearer {VAPI_API_KEY}
Body: {assistant_config_json}

// NODE 2 — Store assistant_id in Sheets row
// (use Google Sheets "Update Row" node)

// NODE 3 — Queue outbound call
POST https://api.vapi.ai/call/phone
Authorization: Bearer {VAPI_API_KEY}  
Body: {call_payload_json}
```

---

## WEBHOOK HANDLER (n8n receives Vapi outcomes)

When Vapi POSTs to your `serverUrl` after each call:

```javascript
// n8n Webhook node receives:
{
  "type": "end-of-call-report",
  "call": { "id": "...", "duration": 180 },
  "analysis": {
    "summary": "...",
    "structuredData": {
      "outcome": "booked",
      "price_discussed": true,
      "callback_requested": false,
      "objections": ["too expensive"]
    }
  },
  "metadata": { "lead_id": "...", "business_name": "..." }
}

// Route based on outcome:
// "booked" → update Sheets status, notify via SMS/email
// "interested_no_book" → schedule follow-up email in 24hrs
// "declined" → mark closed-lost in Sheets
// "callback" → schedule call at requested time
// "no_answer" → retry once after 4 hours, then email-only
```

---

## PHONE NUMBER PROVISIONING

One-time setup in Vapi dashboard:
1. Connect your Twilio account to Vapi
2. Buy a local Dallas area code number (+1 972 or +1 214) — looks local to Mesquite targets
3. Note the `phoneNumberId` — hardcode into your n8n node

**Cost:** ~$1.15/month for a Twilio number through Vapi

---

## NEVER DO
- Never deploy a call without a valid phone number in E.164 format
- Never schedule calls before 9am or after 6pm prospect local time
- Never reuse the same assistant_id for different businesses — create fresh per lead
- Never skip the webhook handler — you won't know what happened on the call
- Never call a number flagged "do_not_call" in the Sheets row

---

## SKILL CONNECTIONS
- **Upstream:** outreach-copywriter (reads vapi_script block)
- **Upstream:** lead-to-brief (reads business.phone, business.name, deploy.preview_subdomain)
- **Downstream → Airtable/Sheets CRM:** writes outcome, duration, objections back to lead row
- **Downstream → n8n follow-up:** triggers email or callback sequence based on outcome

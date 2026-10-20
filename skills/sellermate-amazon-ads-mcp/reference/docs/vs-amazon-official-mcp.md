# SellerMate MCP vs Amazon's official Ads MCP server

Amazon announced an official **Amazon Ads MCP server** in open beta
([announcement](https://advertising.amazon.com/library/news/amazon-ads-mcp-server-open-beta),
[docs](https://advertising.amazon.com/API/docs/en-us/mcp/mcp-overview)). It is a genuine
step forward for the ecosystem — and it answers a different need than this server.

## The short version

**Amazon's MCP is an API surface for developers. SellerMate's MCP is a managed,
guardrailed operator for sellers and agencies.** If you hold Amazon Ads API partner
credentials and are building your own agent, Amazon's server is the native choice. If
you are a seller or agency who wants to ask questions today and apply changes inside
enforced limits, that is what this server was built for.

## Side by side

| | **SellerMate MCP** | **Amazon Ads MCP (open beta)** |
|---|---|---|
| Who can connect | Anyone with a free SellerMate account | "Amazon Ads partners with active API credentials" (per Amazon's announcement) |
| Setup | One click from Claude's connector directory, or paste one URL | Developer OAuth (Login with Amazon) setup |
| Auth | OAuth 2.1 + PKCE, no API keys | Amazon Ads API OAuth |
| Reads | Campaigns, targeting, search terms, placements, hourly, SQP/SCP, DSP, retail, vendor, inventory, orders, returns | Ads API surface: reporting, account settings, billing |
| Writes | Campaigns, budgets/bids, targets, negatives, automations, dayparting | Campaign create/update/delete |
| Write safety | **Server-enforced policy guardrails** (budget/bid floors & ceilings, change-multiplier caps, per-currency limits) + optional **admin approval queue** + full audit trail | Bring your own guardrails |
| Business context | Retail, vendor and inventory data alongside ads — TACoS-level answers | Advertising data |
| Cost | Free to connect and analyze; write actions on the paid plan | API access for approved partners |
| Status | Production, in Claude's connector directory | Open beta |

## They compose

Nothing stops a team from using both: Amazon's server inside a custom-built agent
pipeline, SellerMate's server for the day-to-day conversational work where enforced
limits and approvals matter. MCP's whole point is that clients can hold several servers
at once.

## Why guardrails are the line that matters

An AI that can *read* your account can embarrass you. An AI that can *write* to it can
spend your money. The difference between "the prompt says be careful" and "the platform
rejects any call outside policy" is the difference between advice and enforcement —
and it is enforced on the server, where the model cannot negotiate with it.

*Facts about Amazon's server are taken from Amazon's own announcement and docs (linked
above), as of September 2026; the beta is evolving, so check their pages for current
requirements.*

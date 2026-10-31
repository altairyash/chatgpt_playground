# CiteGlance — AI Search Visibility Research

CiteGlance helps B2B software teams understand how AI answer experiences respond to real buyer-intent questions: which brands are mentioned, how competitors are framed, and which sources are cited.

The service is evidence-led and point-in-time. It does not guarantee rankings, brand mentions, citations, leads, or revenue, and it is not continuous monitoring.

## Product

- **Free tools:** robots.txt builder, llms.txt starter, Open Graph metadata generator, and a technical homepage-readiness check.
- **Buyer Visibility Snapshot — $99 one-time pilot:** up to 10 buyer-intent prompts, one agreed AI answer platform, up to 3 named competitors, observed answers and available citations, and a concise findings summary with next steps.
- **AI Buyer Visibility Sprint — $1,500 fixed scope:** up to 20 buyer-intent prompts, up to 3 AI answer experiences subject to access and reproducibility, competitor and citation-source mapping, prompt-level evidence, and a prioritized 30-day action plan.

Scope, platform access, evidence format, and delivery timing are agreed before payment. The $99 snapshot is an early-access pilot, not a subscription.

## Research workspace

The workspace supports:
- Brand and competitor profiles.
- Buyer-intent prompt sets and baseline/recheck runs.
- Recording observed answers, platform, date, and citation URLs.
- Evidence-grounded content drafts for human review.
- Exportable research records.

**Important:** AI answers are not fetched automatically by the workspace. The researcher runs the agreed prompts on the selected platform and records the observed answer and citations. Workspace data is stored in the current browser's local storage; export a backup before clearing browser data or switching devices.

## Technical tools and API routes

- `/api/audit` checks a submitted public homepage for technical discovery signals. It is not an AI-ranking or AI-answer test. If AI recommendations are configured, the submitted URL, a short page excerpt, and technical checks are sent to OpenAI to generate suggestions.
- `/api/workspace/content` generates a draft only after an observed answer has been entered. It is designed to ground drafts in supplied evidence and flag claims that need human verification.
- The homepage request form opens a prefilled email using `NEXT_PUBLIC_CONTACT_EMAIL`. It does not create a server-side lead record, send email automatically, or collect payment.

## Local development

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

## Environment variables

Configure these in the deployment environment as needed:

- `NEXT_PUBLIC_CONTACT_EMAIL` — business inbox opened by the request form. Use an address that is monitored and appropriate for customer enquiries.
- `OPENAI_API_KEY` — server-side key for optional AI recommendations and evidence-grounded content drafts. Never expose it in client-side code.
- `OPENAI_AUDIT_MODEL` — optional model override; the current source defaults to `gpt-4.1-mini`.

The technical homepage checks can run without the OpenAI key; AI recommendations and content generation cannot.

## Before accepting a paid pilot

1. Verify the live homepage, pricing page, request form, and business inbox in a normal browser.
2. Confirm the selected AI platform is accessible and the exact prompt set is reproducible enough for the agreed scope.
3. Agree the scope, delivery date, and payment method in writing before beginning paid work.
4. Record exact prompts, platform, date, observed answer text, and available citations.
5. Separate direct observations from interpretation and recommendations.
6. Do not claim that a change guarantees AI mentions, citations, rankings, leads, or revenue.

CiteGlance does not sell fake reviews, spammy placements, undisclosed paid mentions, or fabricated visibility reports.

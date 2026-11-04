# PATCH IRL

**Software gets patches. Your everyday world should, too.**

PATCH IRL turns a photo of everyday physical friction into a constrained, actionable intervention: observe → plan → visualize → do → check. The first intended use case is a messy desk with loose cables, especially in a rented room where drilling and buying furniture are poor solutions.

Built from scratch on **November 4, 2026**, during the Meta Global AI Developer Hackathon. Theme: **Build for Your World**, indie track. The original contribution is the intervention workflow, Meta adapters, grounding markers, comparison interface, reality-patch export and photo-based follow-up. Framework, component library and hosting scaffolding come from the Sites Vinext starter; model inference is provided by Meta. No pre-existing product is presented as new work.

## What it does

1. Upload your own JPEG, PNG or WebP. The browser resizes it to at most 1600px and re-encodes it as JPEG.
2. Add constraints and choose reuse, a rough MX$300 budget, or a rough MX$1,000 budget.
3. Muse Spark inspects the photo and proposes one small intervention, with observations, uncertainty, materials, 3–5 actions, approximate locations and a visible success check.
4. Optionally ask Muse Image to edit the same photo into a proposed-after concept. A slider compares it to the original.
5. Check off actions and export a PNG reality patch, or JSON including model receipts and photos.
6. Apply the plan physically and upload a real after photo. Muse Spark compares visible changes against the proposed actions.

**There are no canned successful diagnoses or pretend model responses in the product.** Without a server key, the UI explicitly says Meta must be connected. A configured key is not proof that a particular model is accessible. Each successful request exposes its actual model, response ID and timestamp in the model receipt.

**Live integration verified November 4:** Spark photo planning, Muse Image editing, PNG/JSON export and Spark follow-up ran successfully through the browser on an explicitly synthetic test scene. A same-image negative control reported no visible improvement. A physical intervention on a real desk is still pending; see the validation record for actual response IDs.

## Run locally

Requirements: Node.js >=22.13, npm, an enabled Meta Model API account with credits/billing and access to the selected models.

```sh
npm run install:ci
cp .env.example .env.local
# Set MODEL_API_KEY in .env.local using your editor. Do not paste it in chat.
npm run dev -- --host 127.0.0.1
```

Open the Local URL printed by the server, usually http://127.0.0.1:5173. Restart the dev server after changing `.env.local`. Never prefix the key with `NEXT_PUBLIC_` or `VITE_`. Local dev loads only the three allowlisted server values into the local Worker. Production values must be configured separately as runtime secrets, never build-time vars.

```dotenv
MODEL_API_KEY= # your private key, server only
META_SPARK_MODEL=muse-spark-1.3
META_IMAGE_MODEL=muse-image-1.0
```

Meta's participant guide notes that an active credit balance may still require an accepted payment method before calls work. Check your own dashboard; credits alone do not establish model access. Set billing notifications as appropriate. The app makes one paid inference per requested operation, with no automatic paid retries.

## Actual Meta integration

All inference calls use raw HTTPS `POST https://api.meta.ai/v1/responses`, Bearer `MODEL_API_KEY`, and `store:false`. No OpenAI or Gemini inference is used.

| Operation | Default model | Input | Output |
|---|---|---|---|
| `/api/patch` | `muse-spark-1.3` | Photo + constraints | Validated JSON intervention |
| `/api/visualize` | `muse-image-1.0` | Original photo + plan | `image_generation_call.result` base64 WebP |
| `/api/verify` | `muse-spark-1.3` | Original + actual-after photos + plan | Validated visible-change assessment |
| `/api/status` | No inference | None | Whether a key exists and configured model names |

Muse Image uses its documented `image_generation` tool, low reasoning strength, WebP output and disabled web/image search and shell. Spark visible message text is parsed as JSON and checked with Zod; internal reasoning is not shown or parsed as the answer. Invalid model output fails visibly rather than becoming a fabricated result.

Official documentation checked November 4, 2026:

- [Image understanding](https://dev.meta.ai/docs/image-understanding)
- [Image generation and response schema](https://dev.meta.ai/docs/image-generation)
- [Models](https://dev.meta.ai/docs/models)
- [Quickstart and authentication](https://dev.meta.ai/docs/quickstart)

## Fallback and honest limits

If Muse Image times out or is unavailable to the account, the Spark plan remains usable. The action map marks the original photo with approximate model-provided coordinates and exports it with the label **ACTION MAP / ORIGINAL PHOTO**. This is a real Spark-backed planning fallback, not a generated after. It preserves the core intervention workflow; it does **not** guarantee judging eligibility or score.

Generated after images are explicitly AI concepts, never proof of physical completion. Follow-up uses a separately uploaded actual photo. Its assessment can be improved, partial or unclear; it does not certify safety or functionality. Checkbox completion is user-reported.

Costs and time are rough model estimates, not vendor quotes or measurements. Grounding markers are approximate points, not segmentation or precise geometry. Generated edits can change unrelated details. No spatial calibration, shopping integration, durable collaboration, model fine-tuning or autonomous physical action is claimed.

The MVP is scoped to reversible organization and layout changes. Hazardous repairs should be referred to a qualified professional; the safety flag is model-generated and not a comprehensive hazard detector. Review every proposed action before doing it.

## Privacy and deployment

PATCH IRL keeps photos and results in current browser memory, does not log them intentionally, and does not store them in a database. Refreshing loses the session. Downloaded JSON contains your photos: review it before sharing. Requests send photos to Meta. `store:false` disables Responses conversation storage; it does not override Meta's service data policies or imply zero retention by Meta. The hosting provider processes request traffic.

A new Sites deployment is owner-private by default. Keep that boundary for testing. Before anonymous public inference, add durable quotas, abuse controls and a spending cap; the current same-origin check and 2-second in-memory burst throttle are only best-effort per isolate. They are not authentication, a financial cap, or robust distributed rate limiting. No secret may be committed to GitHub or `.openai/hosting.json`.

Public source and a publicly accessible demo video are submission requirements. A private live preview alone is not judge access. Use the repo to run locally or arrange deliberate demo access before submission.

## Validate

```sh
npm test
npm run typecheck
npm run build
```

Five protocol tests check photo restrictions, model-text extraction, bounded coordinates, required safety fields, verification status validation and an actual Spark response that exposed an overly strict observation limit. They do not prove model access or quality. See [docs/VALIDATION.md](docs/VALIDATION.md) for the current evidence, [docs/DEMO.md](docs/DEMO.md) for the three-minute recording script, and [docs/SUBMISSION.md](docs/SUBMISSION.md) for the final checklist.

## License

Original project code: MIT. Third-party packages and included vendor assets retain their respective licenses. Use only photos and assets you have permission to use.

## Demo video

[Watch or download the narrated 2:59 integration demo (MP4)](https://raw.githubusercontent.com/OsmarGHz/patch-irl/main/demo/patch-irl-demo.mp4)

This edited walkthrough uses **an explicitly synthetic desk scene**, actual application captures and real Meta responses. Narration is generated with the macOS Samantha voice. It demonstrates the working software and a same-image negative control; it does not claim that a physical desk was improved. A personal real-desk case is still pending.

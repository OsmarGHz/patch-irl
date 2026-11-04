# Validation record — November 4, 2026

## Observed live Meta calls

All of these calls used the participant's server-side key and the real Meta Model API. No successful response was mocked.

| Test | Model | Response ID | Result |
|---|---|---|---|
| Basic connection | muse-spark-1.3 | resp_6aeb8fb23e70376b1e394dba | HTTP 200, completed |
| Synthetic desk fixture generation | muse-image-1.0 | resp_6aeb8ff694a8a2922efc47a2 | HTTP 200, WebP received |
| Browser photo plan | muse-spark-1.3 | resp_6aeb90e8cdfbb980bc984f7d | Validated plan, four grounded actions, 18.9 seconds |
| Browser photo edit | muse-image-1.0 | resp_6aeb91120ef594474c874d75 | Proposed-after image and comparison slider, 18.4 seconds |
| Negative control: same input twice | muse-spark-1.3 | resp_6aeb919b5a887d5903714969 | Unclear; explicitly stated no visible tidying occurred |

The desk fixture was **generated for integration testing**. It is not a participant's real desk, an actual physical intervention or evidence of real-world impact. The second image in the visual comparison is an AI concept. The negative control used the same synthetic original as both before and after; no completed physical work is claimed.

## Browser checks

- Initial interface rendered; English/Spanish switching worked.
- Photo selection and resize worked.
- Grounding markers and structured plan rendered from a live Spark response.
- Muse Image edited the uploaded scene; before/concept slider rendered.
- PNG export downloaded successfully and was visually inspected: images, all four steps, costs, caution and receipt were readable without clipping.
- JSON export downloaded successfully and contained original/concept data and actual model receipts, with the synthetic-test context intact.
- Follow-up photo comparison identified the unchanged input rather than reporting a successful improvement.
- The initial owner-private production deployment loaded successfully; runtime secret revision 1 was configured and deployed. Later source fixes require their own deployment.

## Engineering checks

- Production build, TypeScript check and initial four protocol tests passed.
- A live failure exposed a too-strict four-observation limit. Spark returned six valid observations; the app now accepts a bounded list of up to twelve and requests 1–4 concise observations. A regression fixture/test reproduces the observed case.
- Explicit low reasoning effort is now requested for Spark to reduce latency, using the documented Responses API setting.
- Missing-key requests fail visibly without fabricated results.
- `.env.local` is ignored by Git. Secret-content scanning is required before publishing the updated build.

## Still required for submission

- Run the workflow on the participant's own BEFORE photo.
- Apply a sensible reviewed plan physically and compare an actual AFTER photo.
- Verify public GitHub publication after granting this new repository to the existing integration.
- Record, review and upload a publicly accessible video no longer than three minutes.
- Arrange judge access to any live link submitted; the current Sites audience is owner-private.
- Submit through the accepted participant account and observe confirmation before 8 PM CDMX.

## Real-photo robustness follow-up

The participant supplied an actual temporary classroom desk photo. The first hosted Spanish request failed output validation. A direct Spark retry returned a valid real-photo plan, demonstrating that the input itself was usable. Spark planning and verification have therefore moved to the documented constrained JSON-schema Chat Completions surface, with local Zod validation retained. Muse Image continues to use Responses. No real participant photo is committed to the public source repository.

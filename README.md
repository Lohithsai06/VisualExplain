```
# Visual Explain AI

Visual Explain AI helps students understand diagrams, charts, and handwritten notes through a two-step AI pipeline that separates image understanding (vision) from textual reasoning. The application is intentionally frontend-only so it can be run locally or deployed quickly without a server component. This README explains how the application works, how to run it, and implementation details useful for contributors.

## Features

- Explain images using a vision model that extracts factual descriptions
- Two-step pipeline: a vision step (image → structured text) and a reasoning step (vision text → student-friendly explanation)
- Follow-up questions that reuse image context and previous answers
- Export options: PDF and PNG capture of explanation content
- No account required — users supply their OpenRouter API key in Settings

## How it works (detailed)

The application runs a clear, repeatable sequence when the user requests an explanation. Below is a step-by-step description and the rationale behind each step.

Pipeline overview

1. Upload image: the user uploads an image on the Explain screen. The UI stores a data URL preview and packages the request payload.
2. Vision step (STEP 1): the frontend sends the image to a fixed vision model (configured in code). The request is a chat-completions-style payload where the message contains a strict vision prompt and the image payload. The vision model is asked to return concise structured text describing only visible elements (labels, components, flows) and not to introduce additional explanations or external facts.
3. Reasoning step (STEP 2): the frontend assembles a reasoning prompt that includes the sanitized vision text, optional subject, and the selected explanation `mode` (for example: beginner, quick, exam). This prompt is sent to a user-selectable reasoning model (e.g., DeepSeek or Gemma) as a text-only chat completion.
4. Presentation: the app sanitizes the reasoning model output (removes markdown artifacts, trims excessive whitespace) and displays the final explanation in the Result view. The vision text and final explanation are stored in `sessionStorage` for follow-ups and exports.
5. Follow-ups: when the user asks follow-up questions, the app composes a text-only prompt that includes: vision text, the previous explanation, and the user's question. Follow-ups are sent to the reasoning model only (no second vision call), and returned answers are appended to the session's follow-up list.

Sequence diagram (conceptual)

User -> App: Upload image
App -> VisionModel (fixed): POST image + VISION_PROMPT
VisionModel -> App: visionText
App -> ReasoningModel (user-selected): POST reasoningPrompt(visionText + subject + mode)
ReasoningModel -> App: explanationText
App -> UI: show explanationText

Example prompts

- Vision prompt (sent to the vision model):

```text
You are an image understanding system.
Describe exactly what is shown in the image.
Output ONLY structured text with:
- What the image represents
- Visible labels or text
- Components or parts
- Flow, steps, or relationships (if any)
Do NOT explain concepts.
Do NOT add external knowledge.
Be factual and concise.
```

- Reasoning prompt (template sent to reasoning model):

```text
You are an expert teacher.

The following is a description extracted from an image:
--------------------------------
{visionText}
--------------------------------

Subject (if provided): {subject}
Explanation style: {mode}

Now:
1. Explain the concept clearly for a student
2. Use simple language
3. Break into logical steps or sections
4. Add reasoning (why and how)
5. Make it exam-friendly but easy to understand

IMPORTANT:
Return the explanation as clean plain text. Do NOT use markdown or bullets characters like #, *, -, or backticks.
```

Networking and headers

- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Required headers used by the app: `Authorization: Bearer <API_KEY>`, `Content-Type: application/json`, `HTTP-Referer: VisualExplain`, `X-Title: VisualExplain`
- The app reads the `OPENROUTER_API_KEY` from `localStorage` at request time; instruct users to paste their key into the Settings view.

Error handling

- Vision failures: by design, vision errors surface a user-friendly message like "Unable to understand the image. Please try a clearer image." If the provider returns a 404 indicating the model is not configured, the UI shows a clear message and offers a quick link to Settings.
- Reasoning errors: the app surfaces provider error messages when available. Follow-up requests implement a retry on transient 502 responses (one retry after ~1s) and show a friendly message if retries fail.

Storage and session

- `sessionStorage.explanationData` — initial payload (image data URL, mode, subject, model) saved when navigating to the Result page.
- `sessionStorage.visionText` — structured text returned by the vision model.
- `sessionStorage.explanationText` — final cleaned explanation used by the UI and exports.
- `sessionStorage.followUpAnswers` — array of follow-up answers appended during the session.

Export behavior

- The app supports client-side exports:
  - PNG generation: uses `html-to-image` to capture the export root as a PNG.
  - PDF generation: uses `jsPDF` to assemble a printable document containing the uploaded image, the explanation text, and follow-up answers.
- During export the app applies a temporary `exporting` body class to hide interactive controls and ensure a clean capture.

## Tech stack

- Vite
- React (functional components + hooks)
- TypeScript
- Tailwind CSS (utility-based styles + theme tokens)
- OpenRouter AI for model access

## Getting started (local)

Prerequisites
- Node.js (16+ recommended)

Install dependencies

```bash
npm install
```

Run the dev server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

Configure OpenRouter API key
- Open the Settings page in the app and paste your OpenRouter API key into the API Key field, then click Save. The key is saved in `localStorage`.

## Usage

1. Go to Explain → Upload an image (diagram, chart, or notes).
2. (Optional) Set Subject and Mode to control explanation style.
3. Click Explain Image — watch the two-step progress messages: "Understanding image..." then "Generating explanation...".
4. Read the explanation on the Result page and ask follow-up questions if needed.
5. Export results or copy text for notes.

## Troubleshooting

- If you see "Provider returned error 404: No matching route found": this usually means your OpenRouter account does not have the requested model enabled. Open Settings and select a different reasoning model or check with your provider account.
- If you see "Failed to fetch": check network connectivity and CORS settings. Confirm the `OPENROUTER_API_KEY` is set in Settings and that the browser allows outbound requests to `openrouter.ai`.
- If export output looks incorrect: open the browser console to inspect the DOM root used for capture (`[data-export-root]`) and confirm the `exporting` class is toggled on `document.body` while exporting.

## Limitations

- Frontend-only design means API keys are used client-side; the app does not provide a secure server-side proxy.
- Some models may not be available on all OpenRouter accounts. If a requested model returns a provider 404, the app surfaces a clear error and prompts the user to change settings.
- CORS or network restrictions may prevent requests from the browser to the provider.
- Vision model is currently fixed (configured in the code) and may not match every user's provider permissions.
- Export and PDF generation are performed client-side and may be subject to browser memory limits for very large content.

## Future improvements

- Optional server-side proxy to protect API keys and increase compatibility
- Allow selecting the vision model from Settings (with validation)
- Add authentication and user preferences persistence
- Improve export formatting and multi-page PDF handling
- Add automated tests and accessibility refinements

## Developer notes

- Session and storage keys used by the app:
  - `explanationData` (sessionStorage): initial payload stored when navigating to Result
  - `visionText` (sessionStorage): extracted text from the vision model
  - `explanationText` (sessionStorage): sanitized explanation returned by reasoning model
  - `followUpAnswers` (sessionStorage): array of follow-up answer strings
- Default reasoning model is stored in `localStorage` under `DEFAULT_MODEL`.

## License

MIT License — see the LICENSE file for details.

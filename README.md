
  # Visual Explain AI

  Visual Explain AI is a frontend web application that helps students understand textbook images, diagrams, and notes using AI. The app uses a vision model to extract factual information from an uploaded image and a reasoning model to produce a clear, student-friendly explanation. Follow-up questions are supported to deepen understanding.

  ## Features

  - Image-based explanation using a vision model
  - Two-step AI pipeline: vision (image understanding) + reasoning (text generation)
  - Follow-up question support (reuses image context)
  - Clean, student-focused UI with export options (PDF / image / copy text)
  - Frontend-only: no account or server required

  ## How it works

  1. The user uploads an image in the Explain screen.
  2. The app calls a fixed vision model to produce a structured textual description of the image (STEP 1).
  3. The app sends the vision text, plus optional subject and mode, to a selectable reasoning model which generates the final explanation (STEP 2).
  4. Follow-up questions reuse the stored vision text and prior explanation; follow-ups are sent as text-only requests to the reasoning model.
  5. All network calls are made from the browser to OpenRouter's chat completions endpoint; the user provides their API key via the Settings UI.

  ## Tech stack

  - Vite
  - React
  - TypeScript
  - Tailwind CSS
  - OpenRouter AI (chat completions)
  - (Optional) html-to-image / jsPDF for client-side exports

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
  - Open the Settings page in the app and paste your OpenRouter API key into the API Key field, then click Save.
  - The key is stored in browser localStorage and is read at request time by the application.

  ## Usage

  1. Go to Explain → Upload an image (diagrams, charts, handwritten notes).
  2. Optionally set Subject, Mode (explain style), and the reasoning model.
  3. Click Explain Image — the app will run the vision→reasoning pipeline and show the explanation.
  4. Ask follow-up questions in the Result page; answers are appended and persisted in session storage for the session.
  5. Export explanation as PDF or Image, or copy text for notes.

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

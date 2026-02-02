import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ExplanationCardProps {
  mode: string;
  model: string;
  image: string; // data URL from uploader
  subject?: string;
  prompt?: string;
}

export function ExplanationCard({ mode, model, image, subject, prompt }: ExplanationCardProps) {
  const [aiText, setAiText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'vision' | 'reasoning'>('idle');
  const [visionText, setVisionText] = useState<string | null>(null);
  const [modelNotConfigured, setModelNotConfigured] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Two-step pipeline: fixed vision model (Nemotron) -> reasoning model (user-selected)
    const VISION_MODEL = 'nvidia/nemotron-nano-12b-v2-vl:free';

    if (!image) {
      setError('No image provided');
      setLoading(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      setStatus('vision');

      // Always read API key from localStorage at runtime
      const runtimeKey = localStorage.getItem('OPENROUTER_API_KEY');
      if (!runtimeKey) {
        setError('OpenRouter API key missing. Please set it in Settings.');
        setLoading(false);
        setStatus('idle');
        return;
      }

      try {
        // STEP 1: Vision interpretation (fixed model)
        const VISION_PROMPT = `You are an image understanding system.\nDescribe exactly what is shown in the image.\n\nOutput ONLY structured text with:\n- What the image represents\n- Visible labels or text\n- Components or parts\n- Flow, steps, or relationships (if any)\n\nDo NOT explain concepts.\nDo NOT add external knowledge.\nBe factual and concise.`;

        const visionBody = {
          model: VISION_MODEL,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: VISION_PROMPT },
                { type: 'image_url', image_url: { url: image } }
              ]
            }
          ]
        } as any;

        const visionRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          referrer: 'VisualExplain',
          headers: {
            Authorization: `Bearer ${runtimeKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'VisualExplain',
            'X-Title': 'VisualExplain'
          },
          body: JSON.stringify(visionBody)
        });

        if (!visionRes.ok) {
          const txt = await visionRes.text();
          // Try to detect gateway/model-not-configured errors (404 from provider)
          let parsed: any = null;
          try {
            parsed = JSON.parse(txt);
          } catch (e) {
            parsed = null;
          }

          const isModelNotConfigured = visionRes.status === 404 && (
            txt.includes('No matching route') ||
            (parsed && (parsed.message || parsed.metadata || parsed.error) && JSON.stringify(parsed).includes('No matching route'))
          );

          if (isModelNotConfigured) {
            setModelNotConfigured(VISION_MODEL);
            setError(`The vision model ${VISION_MODEL} is not available for your OpenRouter account. Open Settings to choose a different model or remove the image.`);
            setLoading(false);
            setStatus('idle');
            return;
          }

          // Fallback friendly message for other vision failures
          setError('Unable to understand the image. Please try a clearer image.');
          setLoading(false);
          setStatus('idle');
          return;
        }

        const visionData = await visionRes.json();

        // Extract a readable visionText
        let vText = '';
        const vChoice = visionData?.choices?.[0];
        if (vChoice) {
          if (typeof vChoice.message?.content === 'string') {
            vText = vChoice.message.content;
          } else if (Array.isArray(vChoice.message?.content)) {
            vText = vChoice.message.content.map((c: any) => c.text || JSON.stringify(c)).join('\n');
          } else if (typeof vChoice.text === 'string') {
            vText = vChoice.text;
          } else if (typeof vChoice.message === 'string') {
            vText = vChoice.message;
          }
        }
        if (!vText) vText = JSON.stringify(visionData);
        setVisionText(vText);
        try {
          sessionStorage.setItem('visionText', vText);
        } catch (e) {}

        // STEP 2: Reasoning/generation (text-only)
        setStatus('reasoning');

        const reasoningPrompt = `You are an expert teacher.\n\nThe following is a description extracted from an image:\n--------------------------------\n${vText}\n--------------------------------\n\nSubject (if provided): ${subject || 'N/A'}\nExplanation style: ${mode}\n\nNow:\n1. Explain the concept clearly for a student\n2. Use simple language\n3. Break into logical steps or sections\n4. Add reasoning (why and how)\n5. Make it exam-friendly but easy to understand\n\nAvoid over-complex language.\nAvoid assumptions not supported by the image.\n\nIMPORTANT:\nReturn the explanation as clean plain text. Do NOT use markdown. Do NOT use #, *, -, or bullet symbols. Use normal paragraphs and simple numbering like:\n1., 2., 3.`;

        const reasoningBody = {
          model,
          messages: [
            {
              role: 'user',
              content: reasoningPrompt
            }
          ]
        } as any;

        const reasonRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          referrer: 'VisualExplain',
          headers: {
            Authorization: `Bearer ${runtimeKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'VisualExplain',
            'X-Title': 'VisualExplain'
          },
          body: JSON.stringify(reasoningBody)
        });

        if (!reasonRes.ok) {
          const txt = await reasonRes.text();
          throw new Error(txt || `Reasoning API error ${reasonRes.status}`);
        }

        const reasonData = await reasonRes.json();

        // Extract final explanation text
        let finalText = '';
        const rChoice = reasonData?.choices?.[0];
        if (rChoice) {
          if (typeof rChoice.message?.content === 'string') {
            finalText = rChoice.message.content;
          } else if (Array.isArray(rChoice.message?.content)) {
            finalText = rChoice.message.content.map((c: any) => c.text || JSON.stringify(c)).join('\n');
          } else if (typeof rChoice.text === 'string') {
            finalText = rChoice.text;
          } else if (typeof rChoice.message === 'string') {
            finalText = rChoice.message;
          }
        }
        if (!finalText) finalText = JSON.stringify(reasonData);

        // sanitize final text to remove common markdown artifacts
        const sanitize = (s: string) => {
          if (!s) return s;
          let out = s.replace(/(^|\n)\s{0,3}#{1,6}\s+/g, '$1');
          out = out.replace(/(^|\n)\s*[*\-+]\s+/g, '$1');
          out = out.replace(/`{1,}/g, '');
          out = out.replace(/\*\*(.*?)\*\*/g, '$1');
          out = out.replace(/__([^_]+)__/g, '$1');
          out = out.replace(/\n{3,}/g, '\n\n');
          return out.trim();
        };

        const clean = sanitize(finalText);
        setAiText(clean);
        try { sessionStorage.setItem('explanationText', clean); } catch (e) {}
        setError(null);
        setStatus('idle');
      } catch (err: any) {
        const msg = err?.message || String(err);
        if (msg === 'Failed to fetch') {
          setError('Network error or CORS blocked the request: Failed to fetch. Check your API key, network, and CORS settings.');
        } else {
          // For reasoning errors we surface the provider message; for vision we used a friendly message earlier
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [image, model, prompt, subject, mode]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary">Mode: {mode}</Badge>
        <Badge variant="outline">{model}</Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-xl">AI Explanation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading && status === 'vision' && <p className="text-muted-foreground">Understanding image...</p>}
          {loading && status === 'reasoning' && <p className="text-muted-foreground">Generating explanation...</p>}
          {loading && status === 'idle' && <p className="text-muted-foreground">Generating explanation from the model...</p>}
          {error && <p className="text-destructive">{error}</p>}
          {modelNotConfigured && (
            <div className="mt-3 flex gap-2">
              <Button variant="outline" onClick={() => navigate('/settings')}>
                Open Settings
              </Button>
            </div>
          )}
          {!loading && !error && (
            <pre className="whitespace-pre-wrap text-foreground leading-relaxed">{aiText}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

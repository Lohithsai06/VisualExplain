import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Textarea } from '@/app/components/ui/textarea';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ExplanationCard } from '@/app/components/ExplanationCard';
import { ExportOptions } from '@/app/components/ExportOptions';
import { StepToggle } from '@/app/components/StepToggle';
import { LoadingState } from '@/app/components/LoadingState';
import { ArrowLeft, Info, Send } from 'lucide-react';

export function Result() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stepByStep, setStepByStep] = useState(true);
  const [followUpPrompt, setFollowUpPrompt] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [followUpAnswers, setFollowUpAnswers] = useState<string[]>([]);
  const [followUpError, setFollowUpError] = useState<string | null>(null);
  const [followUpRetrying, setFollowUpRetrying] = useState(false);
  const [followUpErrors, setFollowUpErrors] = useState<string[]>([]);
  const [explanationData, setExplanationData] = useState<any>(null);
  const exportRef = (window as any).exportRef || null;
  const [exportingImage, setExportingImage] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  const handleExportImage = async () => {
    try {
      setExportingImage(true);
      const { toPng } = await import('html-to-image');
      const root = (window as any).__exportRoot || document.querySelector('[data-export-root]') || document.querySelector('[data-export-area]');
      if (!root) throw new Error('Export root not found');
      document.body.classList.add('exporting');
      await new Promise((r) => setTimeout(r, 50));
      const dataUrl = await toPng(root, { backgroundColor: '#ffffff', quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'AI_Explanation.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      // ignore export errors
    } finally {
      document.body.classList.remove('exporting');
      setExportingImage(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportingPDF(true);
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = margin;

      doc.setFontSize(18);
      doc.text('AI Explanation', pageWidth / 2, y, { align: 'center' });
      y += 28;

      const imgData = explanationData.image;
      if (imgData) {
        try {
          const img = new Image();
          img.src = imgData;
          await new Promise((r, rej) => {
            img.onload = r;
            img.onerror = rej;
          });
          const imgW = pageWidth - margin * 2;
          const ratio = img.width ? img.height / img.width : 1;
          const imgH = imgW * ratio;
          if (y + imgH > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.addImage(imgData, 'PNG', margin, y, imgW, imgH);
          y += imgH + 16;
        } catch (e) {
          // ignore
        }
      }

      const explanation = sessionStorage.getItem('explanationText') || '';
      if (explanation) {
        doc.setFontSize(12);
        const left = margin;
        const maxWidth = pageWidth - margin * 2;
        const lines = doc.splitTextToSize(explanation, maxWidth);
        for (let i = 0; i < lines.length; i++) {
          if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(lines[i], left, y);
          y += 14;
        }
      }

      // collect follow-ups from session or state
      const storedFollowUps = sessionStorage.getItem('followUpAnswers');
      const followUps = storedFollowUps ? JSON.parse(storedFollowUps) : followUpAnswers;
      if (followUps && followUps.length) {
        y += 8;
        doc.setFontSize(14);
        doc.text('Follow-up Answers', margin, y);
        y += 18;
        doc.setFontSize(12);
        for (const ans of followUps) {
          const lines = doc.splitTextToSize(ans, pageWidth - margin * 2);
          for (const l of lines) {
            if (y > pageHeight - margin) {
              doc.addPage();
              y = margin;
            }
            doc.text(l, margin, y);
            y += 14;
          }
          y += 8;
        }
      }

      doc.save('AI_Explanation.pdf');
    } catch (e) {
      // ignore
    } finally {
      setExportingPDF(false);
    }
  };

  useEffect(() => {
    // Get data from sessionStorage
    const data = sessionStorage.getItem('explanationData');
    if (!data) {
      navigate('/');
      return;
    }

    setExplanationData(JSON.parse(data));
    
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    // If user uses browser back button from this page, ensure they land on Home
    const onPop = () => {
      navigate('/');
    };
    window.addEventListener('popstate', onPop);

    return () => {
      window.removeEventListener('popstate', onPop);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <LoadingState />
      </div>
    );
  }

  if (!explanationData) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 text-foreground">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold">Explanation Result</h1>
          <p className="text-muted-foreground mt-1">
            {explanationData.subject && `Subject: ${explanationData.subject}`}
          </p>
        </div>
      </div>

      {/* Exportable content (image, explanation, follow-ups) */}
      <div data-export-root className="text-foreground" ref={(el) => { (window as any).__exportRoot = el; }}>
      {/* Image Preview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Uploaded Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-2xl mx-auto">
            <img
              src={explanationData.image}
              alt="Uploaded diagram"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </CardContent>
      </Card>

        {/* Render follow-up error cards (friendly messages) */}
        {followUpErrors.length > 0 && (
          <div className="mt-4 space-y-4">
            {followUpErrors.map((err, i) => (
              <Card key={`err-${i}`} className="border-yellow-400">
                <CardHeader>
                  <CardTitle>Follow-up Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{err}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <StepToggle enabled={stepByStep} onChange={setStepByStep} />
        <ExportOptions onExportPDF={handleExportPDF} onExportImage={handleExportImage} disabled={!sessionStorage.getItem('explanationText') || exportingImage || exportingPDF} />
      </div>

      {/* Explanation */}
      <ExplanationCard
        mode={explanationData.mode}
        model={explanationData.model}
        image={explanationData.image}
        subject={explanationData.subject}
        prompt={explanationData.prompt}
      />

      {/* Render appended follow-up answers */}
      {followUpAnswers.length > 0 && (
        <div className="mt-4 space-y-4">
          {followUpAnswers.map((ans, i) => (
            <Card key={i} className="bg-muted/5">
              <CardHeader>
                <CardTitle>Follow-up Answer {i + 1}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-foreground leading-relaxed">{ans}</pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      </div>

      {/* Follow-up Question */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ask a Follow-up Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ask a follow-up question about this image..."
            value={followUpPrompt}
            onChange={(e) => setFollowUpPrompt(e.target.value)}
            rows={3}
          />
          <div className="flex items-center gap-2">
            <Button
              className="w-full sm:w-auto"
              onClick={async () => {
                setFollowUpError(null);
                if (!followUpPrompt.trim()) return;
                setFollowUpLoading(true);
                try {
                  const runtimeKey = localStorage.getItem('OPENROUTER_API_KEY');
                  if (!runtimeKey) throw new Error('OpenRouter API key not found');

                  const visionText = sessionStorage.getItem('visionText');
                  const prevExplanation = sessionStorage.getItem('explanationText') || '';
                  if (!visionText) throw new Error('Vision context missing. Please re-run explanation.');

                  const followUpTemplate = `You are continuing an explanation for a student.\n\nContext from image understanding:\n--------------------------------\n${visionText}\n--------------------------------\n\nPrevious explanation:\n--------------------------------\n${prevExplanation}\n--------------------------------\n\nStudent follow-up question:\n--------------------------------\n${followUpPrompt}\n--------------------------------\n\nNow answer the student's question clearly, in simple language, without markdown, and in a student-friendly way.\n\nIMPORTANT: Return clean plain text only. Do NOT use markdown characters like #, *, -, or bullets.`;

                  const body = {
                    model: explanationData.model,
                    messages: [
                      {
                        role: 'user',
                        content: followUpTemplate
                      }
                    ]
                  } as any;

                  // Follow-up request with retry for provider 502 errors
                  let attempt = 0;
                  let data: any = null;
                  let lastError: any = null;
                  while (attempt < 2) {
                    attempt += 1;
                    if (attempt > 1) {
                      setFollowUpRetrying(true);
                    }
                    try {
                      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        referrer: 'VisualExplain',
                        headers: {
                          Authorization: `Bearer ${runtimeKey}`,
                          'Content-Type': 'application/json',
                          'HTTP-Referer': 'VisualExplain',
                          'X-Title': 'VisualExplain'
                        },
                        body: JSON.stringify(body)
                      });

                      if (res.ok) {
                        data = await res.json();
                        break;
                      }

                      const txt = await res.text();
                      let parsed: any = null;
                      try { parsed = JSON.parse(txt); } catch (e) { parsed = null; }
                      const code = parsed?.code || res.status;
                      lastError = { code, msg: parsed?.message || txt };

                      if (code === 502) {
                        // retry once after ~1s
                        if (attempt < 2) {
                          setFollowUpRetrying(true);
                          await new Promise((r) => setTimeout(r, 1000));
                          setFollowUpRetrying(false);
                          continue;
                        } else {
                          break;
                        }
                      } else {
                        // non-retryable: surface clean message (prefer structured message if present)
                        const msg = parsed?.error?.message || parsed?.message || `API error ${res.status}`;
                        throw new Error(msg);
                      }
                    } catch (err: any) {
                      lastError = lastError || { code: err?.code || 0, msg: err?.message || String(err) };
                      if (attempt < 2 && lastError.code === 502) {
                        setFollowUpRetrying(true);
                        await new Promise((r) => setTimeout(r, 1000));
                        setFollowUpRetrying(false);
                        continue;
                      }
                      throw err;
                    } finally {
                      setFollowUpRetrying(false);
                    }
                  }

                  if (!data) {
                    if (lastError && lastError.code === 502) {
                      const friendly = 'Temporary connection issue while answering your question. Please try again in a moment.';
                      setFollowUpErrors((s) => [...s, friendly]);
                      setFollowUpPrompt('');
                      return;
                    }
                    throw new Error(lastError?.msg || 'Unknown API error');
                  }

                  const choice = data?.choices?.[0];
                  let answer = '';
                  if (choice) {
                    if (typeof choice.message?.content === 'string') answer = choice.message.content;
                    else if (Array.isArray(choice.message?.content)) answer = choice.message.content.map((c: any) => c.text || JSON.stringify(c)).join('\n');
                    else if (typeof choice.text === 'string') answer = choice.text;
                    else if (typeof choice.message === 'string') answer = choice.message;
                  }
                  if (!answer) answer = JSON.stringify(data);

                  // sanitize answer (remove markdown artefacts)
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

                  const clean = sanitize(answer);
                  setFollowUpAnswers((s) => {
                    const updated = [...s, clean];
                    try { sessionStorage.setItem('followUpAnswers', JSON.stringify(updated)); } catch (e) {}
                    return updated;
                  });
                  // append to stored explanation so future follow-ups have context
                  try {
                    const updated = (sessionStorage.getItem('explanationText') || '') + '\n\nFollow-up: ' + clean;
                    sessionStorage.setItem('explanationText', updated);
                  } catch (e) {}
                  setFollowUpPrompt('');
                } catch (e: any) {
                  setFollowUpError(e?.message || String(e));
                } finally {
                  setFollowUpLoading(false);
                }
              }}
              disabled={followUpLoading || !followUpPrompt.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              {followUpRetrying ? 'Retrying...' : followUpLoading ? 'Answering follow-up...' : 'Ask Question'}
            </Button>
            {followUpError && <p className="text-destructive text-sm">{followUpError}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert className="mt-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          You can upload this exported file later to ask further doubts or get additional explanations.
        </AlertDescription>
      </Alert>
    </div>
  );
}

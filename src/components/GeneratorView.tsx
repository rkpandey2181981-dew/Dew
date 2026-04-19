/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Template } from '../types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Sparkles, Copy, Check, RotateCcw, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateContent } from '../lib/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const LOADING_MESSAGES = [
  "Deconstructing the prompt lexicon...",
  "Synthesizing thematic resonances...",
  "Aligning narrative trajectories...",
  "Etching semantic signatures...",
  "Curating tonal inflections...",
  "Distilling abstract intentions...",
  "Calibrating the creative engine...",
  "Harmonizing syntax and soul...",
  "Archiving the newly forged...",
  "Consulting the collective lexicon...",
  "Arranging the narrative syntax...",
  "Refining the semantic texture...",
  "Inking the digital parchment..."
];

const LoadingText = ({ text }: { text: string }) => {
  return (
    <motion.div className="flex justify-center gap-[1px]">
      {text.split("").map((char, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{
            duration: 0.5,
            delay: i * 0.02,
            ease: "easeOut"
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

interface GeneratorViewProps {
  template: Template;
  onBack: () => void;
  onSave: (content: string, inputs: Record<string, string>) => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({ template, onBack, onSave }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<string>('balanced');

  useEffect(() => {
    const savedDraft = localStorage.getItem(`editorial_draft_${template.id}`);
    if (savedDraft) {
      try {
        const { inputs: savedInputs, style: savedStyle } = JSON.parse(savedDraft);
        setInputs(savedInputs || {});
        if (savedStyle) setSelectedStyle(savedStyle);
      } catch (e) {
        console.error("Failed to restore archival draft", e);
      }
    }
  }, [template.id]);

  useEffect(() => {
    if (Object.keys(inputs).length > 0 || selectedStyle !== 'balanced') {
      localStorage.setItem(`editorial_draft_${template.id}`, JSON.stringify({
        inputs,
        style: selectedStyle
      }));
    }
  }, [inputs, selectedStyle, template.id]);

  useEffect(() => {
    let interval: number | undefined;
    let progressInterval: number | undefined;
    
    if (loading) {
      interval = window.setInterval(() => {
        setLoadingMessageIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);

      setProgress(0);
      progressInterval = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev;
          return prev + Math.floor(Math.random() * 5);
        });
      }, 300);
    } else {
      setLoadingMessageIdx(0);
      setProgress(0);
    }
    return () => {
        clearInterval(interval);
        clearInterval(progressInterval);
    };
  }, [loading]);

  const handleInputChange = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const clearDraft = () => {
    setInputs({});
    setSelectedStyle('balanced');
    localStorage.removeItem(`editorial_draft_${template.id}`);
  };

  const handleGenerate = async () => {
    // Validate all fields are filled
    const missingFields = template.fields.some(f => !inputs[f.id]);
    if (missingFields) {
      setError("Incomplete Manuscript: Please ensure all required parameters are provided before forging.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const generatedText = await generateContent(template, inputs, selectedStyle);
      if (generatedText) {
        setResult(generatedText);
        onSave(generatedText, inputs);
        // Clear draft on successful save/generation? 
        // User might want to keep it. Let's keep it for now but maybe add a clear button later.
      }
    } catch (err) {
      setError("Transmission Interrupted: We encountered a creative block while consulting the lexicon. This could be due to connectivity or a temporary archival limitation.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background selection:bg-primary selection:text-primary-foreground">
      <header className="px-8 py-5 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">{template.name}</h2>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{template.category} Composite</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {result && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/10">
              <Check className="w-3 h-3" />
              Content Verified
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-full">
          {/* Controls Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border shadow-sm space-y-8">
              <div className="space-y-6">
                {template.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground ml-1">
                      {field.label}
                    </Label>
                    {field.type === 'text' ? (
                      <Input
                        id={field.id}
                        placeholder={field.placeholder}
                        value={inputs[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="h-11 bg-muted/30 border-border focus-visible:ring-primary rounded-xl px-4 text-sm font-medium transition-all"
                      />
                    ) : (
                      <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        value={inputs[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        className="min-h-[140px] bg-muted/30 border-border focus-visible:ring-primary rounded-xl p-4 text-sm font-medium leading-relaxed resize-none"
                      />
                    )}
                  </div>
                ))}

                <div className="space-y-3 pt-2">
                  <Label className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground ml-1">
                    Intelligence Tones
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['formal', 'informal', 'concise', 'detailed'].map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        className={`py-2 rounded-lg text-[10px] uppercase font-bold tracking-widest border transition-all ${
                          selectedStyle === style 
                            ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                            : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/20 hover:text-foreground'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button 
                  onClick={handleGenerate} 
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground h-12 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-primary/10"
                >
                  {loading ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Forge Response
                    </>
                  )}
                </button>

                <button
                  onClick={clearDraft}
                  className="w-full h-10 rounded-xl text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  Clear Composition
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Section */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between bg-muted/30 rounded-t-2xl border border-border border-b-0 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Neural Output</span>
                {loading && (
                    <div className="flex gap-1 ml-2">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:200ms]"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:400ms]"></div>
                    </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <AnimatePresence>
                  {result && !loading && (
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleGenerate} 
                      className="h-8 px-3 rounded-lg text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground transition-all flex items-center gap-2 border border-transparent hover:border-border"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Regenerate
                    </motion.button>
                  )}
                </AnimatePresence>
                {result && (
                  <button 
                    onClick={copyToClipboard} 
                    className="h-8 px-4 rounded-lg bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-sm shadow-primary/10"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Captured' : 'Capture'}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 bg-card border border-border rounded-b-2xl p-8 lg:p-12 relative overflow-hidden shadow-sm">
              {/* Modern Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                   style={{ backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`, backgroundSize: '24px 24px' }}>
              </div>

              <div className="relative z-10 h-full">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-12">
                    <div className="w-full max-w-md space-y-12">
                      <div className="space-y-4">
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.1, 0.4, 0.1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="h-8 w-2/3 bg-primary/20 rounded-lg"
                        />
                        <div className="space-y-3">
                          {[...Array(4)].map((_, i) => (
                            <motion.div 
                              key={i}
                              initial={{ width: "0%" }}
                              animate={{ width: ["0%", "100%", "95%"] }}
                              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
                              className="h-2 bg-muted rounded-full"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-6">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={loadingMessageIdx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center font-bold text-lg tracking-tight text-foreground"
                          >
                            <LoadingText text={LOADING_MESSAGES[loadingMessageIdx]} />
                          </motion.div>
                        </AnimatePresence>
                        
                        <div className="w-48 h-2 bg-muted rounded-full overflow-hidden relative">
                           <motion.div 
                            className="absolute left-0 top-0 h-full bg-primary"
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                           />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest text-primary tabular-nums">
                            {progress.toString().padStart(2, '0')}% COMPLETE
                        </span>
                      </div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-lg shadow-destructive/5">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h3 className="text-xl font-bold tracking-tight">System Interruption</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {error}
                      </p>
                    </div>
                    <button 
                      onClick={handleGenerate}
                      className="px-8 h-12 bg-foreground text-background rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg"
                    >
                      Restart Cycle
                    </button>
                  </div>
                ) : result ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose prose-neutral dark:prose-invert max-w-none 
                              prose-headings:font-bold prose-headings:tracking-tight
                              prose-p:text-base prose-p:leading-relaxed prose-p:text-foreground
                              prose-li:text-foreground"
                  >
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12 space-y-4 opacity-40">
                    <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mb-2">
                       <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">Awaiting Input</h3>
                    <p className="text-xs uppercase font-bold tracking-widest">Connect parameters to generate output</p>
                  </div>
                )}
              </div>
              
              {/* Footer Indicator */}
              <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center text-[10px] font-bold tracking-widest text-muted-foreground/30 uppercase">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-current" />
                  Forge AI Studio
                </div>
                <span>Session ID: {template.id.substring(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

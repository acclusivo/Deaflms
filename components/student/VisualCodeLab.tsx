'use client';

import React, { useState, useEffect } from 'react';
import {
  Code,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Laptop,
  Layers,
  Eye,
  Maximize2,
  Video,
  FileCode,
  Terminal,
  ExternalLink,
} from 'lucide-react';

export interface VisualCodeLabProps {
  initialExerciseIndex?: number;
  hideExerciseSelector?: boolean;
}

interface CodeExercise {
  id: string;
  title: string;
  description: string;
  nslVideoUrl?: string;
  nslSignNotes: string[];
  initialHtml: string;
  initialCss: string;
  validationCheck: (html: string, css: string) => boolean;
  successMessage: string;
}

const EXERCISES: CodeExercise[] = [
  {
    id: 'ex-1',
    title: '1. First HTML Page: Boilerplate & Structure',
    description: 'Every web page starts with the <!DOCTYPE html> declaration and <html>, <head>, and <body> tags. Construct your first basic structure.',
    nslSignNotes: [
      'Sign for HTML: Fingerspelling H-T-M-L then flat hands outlining a structured webpage box.',
      'Sign for body: Open hands moving down the chest, representing the visible content area of the webpage.',
    ],
    initialHtml: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>DeafLMS - My First Page</title>\n  </head>\n  <body>\n    <h1>Hello Deaf Tech World!</h1>\n  </body>\n</html>`,
    initialCss: `body {\n  font-family: system-ui, sans-serif;\n  padding: 24px;\n  background-color: #f8fafc;\n  color: #0f172a;\n}\nh1 {\n  color: #0f766e;\n}`,
    validationCheck: (html) => html.includes('<html') && html.includes('<body') && html.includes('<h1>'),
    successMessage: 'Splendid! You created your first valid HTML web page structure in NSL!',
  },
  {
    id: 'ex-2',
    title: '2. Setting up VS Code: Visual High-Contrast & Live Preview',
    description: 'Deaf engineers configure VS Code with high-contrast themes and clear visual signals. Practice creating a styled container that looks sharp in dark mode.',
    nslSignNotes: [
      'Sign for VS Code: Left hand holding virtual editor screen, right hand typing rapid code keystrokes.',
      'Sign for live preview: Two eyes beaming forward as code updates instantaneously on screen.',
    ],
    initialHtml: `<div class="editor-status">\n  <span class="dot"></span>\n  <span>Live Server Active on Port 5500</span>\n</div>`,
    initialCss: `.editor-status {\n  background: #0f172a;\n  color: #38bdf8;\n  padding: 12px 18px;\n  border-radius: 10px;\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  font-family: monospace;\n  font-size: 14px;\n}\n.dot {\n  width: 10px;\n  height: 10px;\n  border-radius: 50%;\n  background: #22c55e;\n}`,
    validationCheck: (html, css) => html.includes('Live Server') && css.includes('monospace'),
    successMessage: 'Great job! You recreated the VS Code live server indicator.',
  },
  {
    id: 'ex-3',
    title: '3. Your First HTML Page: Semantic Layout',
    description: 'Organize a page using semantic HTML tags: <main>, <header>, and <section> for crystal-clear visual hierarchy.',
    nslSignNotes: [
      'Sign for semantic: Two hands grouping blocks together logically without clutter.',
      'Sign for main: Flat palms framing the central primary area of the screen.',
    ],
    initialHtml: `<main class="page-container">\n  <header>\n    <h2>Nigerian Deaf Tech Talent</h2>\n  </header>\n  <section class="card">\n    <p>Empowering Deaf developers with visual coding labs and certified NSL sign education.</p>\n  </section>\n</main>`,
    initialCss: `.page-container {\n  max-width: 500px;\n  margin: 0 auto;\n}\n.card {\n  background: white;\n  border: 2px solid #0f766e;\n  border-radius: 12px;\n  padding: 16px;\n  margin-top: 12px;\n}`,
    validationCheck: (html) => html.includes('<main') && html.includes('<header') && html.includes('<section'),
    successMessage: 'Excellent! Semantic HTML makes websites accessible and easy to maintain.',
  },
  {
    id: 'ex-4',
    title: '4. HTML Headings: Clean Hierarchy (h1 to h6)',
    description: 'Search engines and screen magnifiers depend on clean heading hierarchy. Use <h1>, <h2>, and <h3> in proper nesting order.',
    nslSignNotes: [
      'Sign for heading: Index finger drawing a bold horizontal title line above the text.',
      'Rule: Never skip heading levels (e.g. going straight from h1 to h4).',
    ],
    initialHtml: `<h1>Web Development Course</h1>\n<h2>Module 1: HTML Basics</h2>\n<h3>Lesson 4: Headings in NSL</h3>`,
    initialCss: `h1 {\n  color: #0f766e;\n  font-size: 28px;\n  margin-bottom: 4px;\n}\nh2 {\n  color: #334155;\n  font-size: 20px;\n  margin-bottom: 4px;\n}\nh3 {\n  color: #64748b;\n  font-size: 16px;\n}`,
    validationCheck: (html) => html.includes('<h1') && html.includes('<h2') && html.includes('<h3'),
    successMessage: 'Clean hierarchy achieved! Your headings establish perfect reading flow.',
  },
  {
    id: 'ex-5',
    title: '5. HTML Paragraphs: Text Formatting & Visual Focus',
    description: 'Wrap your thoughts in <p> tags and emphasize key vocabulary using <strong> and <em> tags.',
    nslSignNotes: [
      'Sign for paragraph: Both hands pressing flat parallel lines to indicate a block of written text.',
      'Sign for strong: Fist pressing firmly down showing visual weight and bold emphasis.',
    ],
    initialHtml: `<p>Nigerian Sign Language uses <strong>visual-spatial</strong> gestures and <em>facial expressions</em> to convey rich grammar.</p>`,
    initialCss: `p {\n  font-size: 16px;\n  line-height: 1.6;\n  color: #1e293b;\n  background: #f1f5f9;\n  padding: 16px;\n  border-left: 4px solid #0f766e;\n  border-radius: 0 8px 8px 0;\n}`,
    validationCheck: (html) => html.includes('<p') && html.includes('<strong>') && html.includes('<em>'),
    successMessage: 'Well formatted! Paragraphs and emphasis give visual clarity to your prose.',
  },
  {
    id: 'ex-6',
    title: '6. HTML Links: Interactive Web Navigation',
    description: 'Connect users to external resources using <a href="..."> tags with target="_blank" and rel="noopener noreferrer" for security.',
    nslSignNotes: [
      'Sign for link / anchor: Interlocking index and thumb of both hands like two chain links connecting together.',
      'Rule: Always ensure link text describes where the user is going!',
    ],
    initialHtml: `<a href="https://deaflms.acclusivo.com" target="_blank" rel="noopener noreferrer" class="web-link">\n  Visit DeafLMS Accessibility Platform →\n</a>`,
    initialCss: `.web-link {\n  display: inline-block;\n  background: #0f766e;\n  color: white;\n  text-decoration: none;\n  font-weight: bold;\n  padding: 12px 20px;\n  border-radius: 10px;\n  transition: background 0.2s;\n}\n.web-link:hover {\n  background: #115e59;\n}\n.web-link:focus-visible {\n  outline: 3px solid #f59e0b;\n  outline-offset: 3px;\n}`,
    validationCheck: (html) => html.includes('<a') && html.includes('href=') && html.includes('target="_blank"'),
    successMessage: 'Awesome! Your link connects learners with accessible focus states.',
  },
  {
    id: 'ex-7',
    title: '7. Adding Images: WCAG 2.2 Alt Text in NSL',
    description: 'Every image requires an informative alt attribute so Deaf and blind users understand the visual content.',
    nslSignNotes: [
      'Sign for image / photo: Hand framing an eye view like clicking a camera shutter.',
      'Sign for alt text: Pointing behind the image showing the descriptive words underneath.',
    ],
    initialHtml: `<figure class="image-box">\n  <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80" alt="Deaf engineer collaborating with team using sign language and computer code editor" width="400" />\n  <figcaption>Deaf Tech Lab in Lagos, Nigeria</figcaption>\n</figure>`,
    initialCss: `.image-box {\n  margin: 0;\n  max-width: 420px;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  overflow: hidden;\n  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);\n}\n.image-box img {\n  display: block;\n  width: 100%;\n  height: auto;\n}\nfigcaption {\n  padding: 10px 14px;\n  background: white;\n  font-size: 13px;\n  font-weight: 600;\n  color: #475569;\n}`,
    validationCheck: (html) => html.includes('<img') && html.includes('alt=') && html.includes('width='),
    successMessage: 'Outstanding! Your image includes accessible alt text satisfying WCAG 2.2 guidelines!',
  },
];

export const VisualCodeLab: React.FC<VisualCodeLabProps> = ({
  initialExerciseIndex = 0,
  hideExerciseSelector = false,
}) => {
  const defaultEx = EXERCISES[initialExerciseIndex] || EXERCISES[0];
  const [selectedExercise, setSelectedExercise] = useState<CodeExercise>(defaultEx);
  const [htmlCode, setHtmlCode] = useState<string>(defaultEx.initialHtml);
  const [cssCode, setCssCode] = useState<string>(defaultEx.initialCss);
  const [activeEditorTab, setActiveEditorTab] = useState<'html' | 'css'>('html');
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [showSignHelp, setShowSignHelp] = useState<boolean>(true);
  const [testResult, setTestResult] = useState<{ passed: boolean; message: string } | null>(null);

  useEffect(() => {
    const ex = EXERCISES[initialExerciseIndex] || EXERCISES[0];
    setSelectedExercise(ex);
    setHtmlCode(ex.initialHtml);
    setCssCode(ex.initialCss);
    setTestResult(null);
    setPreviewKey((k) => k + 1);
  }, [initialExerciseIndex]);

  const handleSelectExercise = (ex: CodeExercise) => {
    setSelectedExercise(ex);
    setHtmlCode(ex.initialHtml);
    setCssCode(ex.initialCss);
    setTestResult(null);
    setPreviewKey((k) => k + 1);
  };

  const handleRunCode = () => {
    setPreviewKey((k) => k + 1);
    const passed = selectedExercise.validationCheck(htmlCode, cssCode);
    setTestResult({
      passed,
      message: passed
        ? selectedExercise.successMessage
        : 'Check your syntax and requirements to match the exercise goals.',
    });
  };

  const handleReset = () => {
    setHtmlCode(selectedExercise.initialHtml);
    setCssCode(selectedExercise.initialCss);
    setTestResult(null);
    setPreviewKey((k) => k + 1);
  };

  // Compile combined document for iframe rendering
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 24px;
            background: #ffffff;
            color: #0f172a;
          }
          ${cssCode}
        </style>
      </head>
      <body>
        ${htmlCode}
      </body>
    </html>
  `;

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm space-y-0">
      {/* Exercise Selector Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-black border border-teal-500/30 shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded">
                Interactive Code Lab
              </span>
              <span className="text-xs text-slate-400 font-medium">Ages 18+ Career Track</span>
            </div>
            <h2 className="text-lg font-black text-white">{selectedExercise.title}</h2>
          </div>
        </div>

        {/* Exercise Switcher Buttons */}
        {!hideExerciseSelector && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {EXERCISES.map((ex, index) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => handleSelectExercise(ex)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition shrink-0 ${
                  selectedExercise.id === ex.id
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Lab {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Description & NSL Sign Notes Banner */}
      <div className="p-4 sm:p-5 bg-teal-50/60 border-b border-teal-200 flex flex-col md:flex-row gap-4 items-start justify-between">
        <div className="space-y-1.5 flex-1">
          <p className="text-xs sm:text-sm text-slate-800 font-bold leading-relaxed">
            {selectedExercise.description}
          </p>

          {showSignHelp && (
            <div className="pt-2 border-t border-teal-200/60 space-y-1 text-xs text-teal-950">
              <div className="font-black flex items-center gap-1.5 text-teal-900">
                <Video className="w-4 h-4 text-teal-700" />
                <span>Nigerian Sign Language Coding Glossary &amp; Guidelines:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 font-medium">
                {selectedExercise.nslSignNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowSignHelp(!showSignHelp)}
          className="text-xs font-bold text-teal-800 hover:text-teal-950 underline shrink-0"
        >
          {showSignHelp ? 'Hide Sign Notes' : 'Show NSL Coding Notes'}
        </button>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 min-h-[460px]">
        {/* LEFT COLUMN: Code Editor */}
        <div className="flex flex-col bg-slate-950 text-slate-200">
          {/* Editor Header / Tab Switcher */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveEditorTab('html')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                  activeEditorTab === 'html'
                    ? 'bg-slate-800 text-teal-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>index.html</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveEditorTab('css')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1.5 ${
                  activeEditorTab === 'css'
                    ? 'bg-slate-800 text-teal-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>style.css</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                title="Reset Code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRunCode}
                className="py-1.5 px-3.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition flex items-center gap-1 shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Code</span>
              </button>
            </div>
          </div>

          {/* Textarea code editor */}
          <div className="flex-1 p-4 relative font-mono text-xs">
            {activeEditorTab === 'html' ? (
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[380px] bg-transparent text-emerald-300 focus:outline-none resize-none leading-relaxed font-mono selection:bg-teal-700"
                placeholder="Write HTML code here..."
              />
            ) : (
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[380px] bg-transparent text-sky-300 focus:outline-none resize-none leading-relaxed font-mono selection:bg-teal-700"
                placeholder="Write CSS styling rules here..."
              />
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Real-Time Live Browser Sandbox */}
        <div className="flex flex-col bg-slate-50">
          {/* Browser Mock Header */}
          <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              </div>
              <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-3 py-0.5 rounded border border-slate-200">
                https://deaflms.preview/career-lab
              </span>
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400">Live Sandbox</span>
          </div>

          {/* Sandbox iframe */}
          <div className="flex-1 min-h-[360px] bg-white relative">
            <iframe
              key={previewKey}
              srcDoc={srcDoc}
              title="Live Visual Code Preview"
              sandbox="allow-scripts"
              className="w-full h-full border-none min-h-[360px]"
            />
          </div>

          {/* Test Validation Results Box */}
          {testResult && (
            <div
              className={`p-3.5 border-t text-xs font-bold flex items-center gap-2 animate-fade-in ${
                testResult.passed
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {testResult.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

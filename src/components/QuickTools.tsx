import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Calculator, Code, FileText } from 'lucide-react';
import { sounds } from '../utils/sound';

interface QuickToolsProps {
  soundEnabled: boolean;
}

export const QuickTools: React.FC<QuickToolsProps> = ({ soundEnabled }) => {
  const [activeTool, setActiveTool] = useState<'case' | 'json' | 'calc' | 'pxrem'>('case');
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  // JSON Formatter state
  const [jsonInput, setJsonInput] = useState('{"title":"Balaram Studio","status":"active","metrics":{"speed":"instant","latency":"0ms"}}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  // Calc state
  const [calcInput, setCalcInput] = useState('1440 * 0.9');
  const [calcResult, setCalcResult] = useState<string>('1296');

  // PX to REM
  const [pxValue, setPxValue] = useState<number>(16);
  const [baseRem, setBaseRem] = useState<number>(16);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    sounds.playCheck(soundEnabled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text Case Converters
  const toCamel = (str: string) =>
    str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      +match === 0 ? '' : index === 0 ? match.toLowerCase() : match.toUpperCase()
    ).replace(/\s+/g, '');

  const toKebab = (str: string) =>
    str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();

  const toSnake = (str: string) =>
    str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();

  const toTitle = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

  // Format JSON
  const formatJSON = (minify = false) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
      setJsonError('');
      sounds.playCheck(soundEnabled);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid JSON format';
      setJsonError(msg);
      setJsonOutput('');
    }
  };

  // Evaluate simple math safely without eval
  const calculateExpression = () => {
    try {
      // Basic safe math parser for +, -, *, /, %, (, )
      const sanitized = calcInput.replace(/[^0-9+\-*/().%^]/g, '');
      // Use Function with strict mode or safe eval alternative
      const res = new Function(`'use strict'; return (${sanitized})`)();
      setCalcResult(String(res));
      sounds.playCheck(soundEnabled);
    } catch {
      setCalcResult('Error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Developer & Productivity Tools</h2>
          <p className="text-xs text-neutral-400 mt-1">Lightweight utilities built directly into your workflow.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg max-w-fit">
        <button
          onClick={() => setActiveTool('case')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            activeTool === 'case' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Case Converter</span>
        </button>
        <button
          onClick={() => setActiveTool('json')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            activeTool === 'json' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>JSON Formatter</span>
        </button>
        <button
          onClick={() => setActiveTool('calc')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            activeTool === 'calc' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Quick Math</span>
        </button>
        <button
          onClick={() => setActiveTool('pxrem')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            activeTool === 'pxrem' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>PX ⇄ REM</span>
        </button>
      </div>

      {/* Case Converter Tool */}
      {activeTool === 'case' && (
        <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Input Text</label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste any variable name or sentence..."
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              { label: 'camelCase', val: toCamel(inputText || 'sample variable name') },
              { label: 'kebab-case', val: toKebab(inputText || 'sample variable name') },
              { label: 'snake_case', val: toSnake(inputText || 'sample variable name') },
              { label: 'UPPERCASE', val: (inputText || 'sample variable name').toUpperCase() },
              { label: 'Title Case', val: toTitle(inputText || 'sample variable name') },
              { label: 'lowercase', val: (inputText || 'sample variable name').toLowerCase() },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-neutral-950/70 border border-neutral-800/80 rounded-lg flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] uppercase font-mono text-neutral-500 block">{item.label}</span>
                  <span className="text-xs font-mono text-indigo-300 truncate block mt-0.5">{item.val}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(item.val)}
                  className="p-1.5 text-neutral-500 hover:text-white transition-colors cursor-pointer shrink-0"
                  title="Copy"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JSON Formatter */}
      {activeTool === 'json' && (
        <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">Raw JSON Input</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => formatJSON(false)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Prettify
              </button>
              <button
                onClick={() => formatJSON(true)}
                className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-md transition-colors cursor-pointer"
              >
                Minify
              </button>
            </div>
          </div>

          <textarea
            rows={5}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-100 placeholder-neutral-500 font-mono focus:outline-none focus:border-indigo-500"
          />

          {jsonError && (
            <p className="text-xs text-rose-400 font-mono">{jsonError}</p>
          )}

          {jsonOutput && (
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-neutral-300">Formatted Output</span>
                <button
                  onClick={() => copyToClipboard(jsonOutput)}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-emerald-400 font-mono overflow-x-auto max-h-64">
                {jsonOutput}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Quick Calculator */}
      {activeTool === 'calc' && (
        <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Arithmetic Expression</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={calcInput}
                onChange={(e) => setCalcInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && calculateExpression()}
                placeholder="e.g. (1920 - 280) * 0.5"
                className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={calculateExpression}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Compute
              </button>
            </div>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-mono">Result:</span>
            <span className="text-xl font-mono font-bold text-white tabular-nums">{calcResult}</span>
          </div>
        </div>
      )}

      {/* PX to REM Converter */}
      {activeTool === 'pxrem' && (
        <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Pixels (px)</label>
              <input
                type="number"
                value={pxValue}
                onChange={(e) => setPxValue(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Base Font Size (px)</label>
              <input
                type="number"
                value={baseRem}
                onChange={(e) => setBaseRem(Number(e.target.value))}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-100 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-between">
            <span className="text-xs text-neutral-400">Equivalent in rem:</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono font-bold text-indigo-400 tabular-nums">
                {(pxValue / (baseRem || 16)).toFixed(4)}rem
              </span>
              <button
                onClick={() => copyToClipboard(`${(pxValue / (baseRem || 16)).toFixed(4)}rem`)}
                className="p-1 text-neutral-500 hover:text-white cursor-pointer"
                title="Copy"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState, useCallback, useRef } from 'react';
import PromptConsole from './components/PromptConsole';
import CodeDisplay from './components/CodeDisplay';
import PreviewFrame from './components/PreviewFrame';
import WelcomeScreen from './components/WelcomeScreen';
import Editor from './components/Editor';
import { generateWebsite } from './services/geminiService';
import { GeneratedOutput, SiteConfig, AnimationStyle } from './types';
import JSZip from 'jszip';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key'));
  const [prompt, setPrompt] = useState<string>('');
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('preview');
  const [editMode, setEditMode] = useState<'prompt' | 'editor'>('prompt');
  
  const [config, setConfig] = useState<SiteConfig>({
    siteName: 'New Project',
    primaryColor: '#8ab4f8',
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        title: 'Limitless Creativity',
        description: 'A masterpiece of modern design and smooth animations.',
        animationStyle: AnimationStyle.FADE_UP,
        scrub: 1,
        pin: false,
        entryAnimation: 'fade-in'
      }
    ]
  });

  const previewContainerRef = useRef<HTMLDivElement>(null);

  const handleSetKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleGenerate = useCallback(async () => {
    if ((editMode === 'prompt' && !prompt.trim()) || isLoading || !apiKey) return;
    setIsLoading(true);
    setError(null);
    try {
      setViewMode('preview');
      const result = await generateWebsite(
        prompt || `Build ${config.siteName} based on the configured sections.`, 
        apiKey, 
        output || undefined,
        editMode === 'editor' ? config : undefined
      );
      setOutput(result);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, apiKey, output, config, editMode]);

  const downloadProject = async () => {
    if (!output) return;
    const zip = new JSZip();
    output.files.forEach(file => {
      const cleanPath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
      zip.file(cleanPath, file.content);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `full-nextjs-gsap-project.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openInNewTab = () => {
    if (!output?.previewHtml) return;
    const blob = new Blob([output.previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const toggleFullScreen = () => {
    if (previewContainerRef.current) {
      if (!document.fullscreenElement) {
        previewContainerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  if (!apiKey) {
    return <WelcomeScreen onSetKey={handleSetKey} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#131314] text-[#e3e3e3] overflow-hidden font-google">
      <header className="h-12 bg-[#1e1f20] border-b border-[#333537] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">G</div>
          <span className="text-sm font-medium">GSAPGenie Studio</span>
          <div className="h-4 w-px bg-[#444746] mx-1"></div>
          <span className="text-[11px] text-[#c4c7c5] font-normal truncate max-w-[200px]">
            {output ? "Enterprise Build" : "Next.js Architect"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {output && (
            <>
              <button onClick={openInNewTab} className="px-3 py-1 bg-[#333537] hover:bg-[#444746] text-[#e3e3e3] rounded-md text-[11px] font-medium flex items-center gap-2 studio-transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                Preview
              </button>
              <button onClick={downloadProject} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-medium flex items-center gap-2 studio-transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Export Repo
              </button>
            </>
          )}
          <button onClick={() => { localStorage.removeItem('gemini_api_key'); setApiKey(null); }} className="text-[11px] text-blue-400 hover:text-blue-300 font-medium px-2 py-1">Switch Key</button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-80 bg-[#1e1f20] border-r border-[#333537] flex flex-col p-4 shrink-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div className="flex bg-[#131314] rounded-lg p-0.5 border border-[#333537]">
              <button 
                onClick={() => setEditMode('prompt')}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${editMode === 'prompt' ? 'bg-blue-600/10 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Prompt
              </button>
              <button 
                onClick={() => setEditMode('editor')}
                className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition-all ${editMode === 'editor' ? 'bg-blue-600/10 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Editor
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            {editMode === 'prompt' ? (
              <PromptConsole 
                prompt={prompt} 
                setPrompt={setPrompt} 
                onGenerate={handleGenerate} 
                isLoading={isLoading}
                isRefining={!!output}
              />
            ) : (
              <Editor 
                config={config} 
                setConfig={setConfig} 
                onGenerate={handleGenerate} 
                isLoading={isLoading} 
              />
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-[#000]">
          <div className="h-10 bg-[#1e1f20] border-b border-[#333537] flex items-center justify-between px-4 shrink-0">
            <div className="flex h-full">
              <button onClick={() => setViewMode('preview')} className={`px-4 h-full text-[12px] font-medium studio-transition border-b-2 ${viewMode === 'preview' ? 'border-blue-400 text-blue-400' : 'border-transparent text-[#c4c7c5] hover:text-[#e3e3e3]'}`}>Live View</button>
              <button onClick={() => setViewMode('code')} className={`px-4 h-full text-[12px] font-medium studio-transition border-b-2 ${viewMode === 'code' ? 'border-blue-400 text-blue-400' : 'border-transparent text-[#c4c7c5] hover:text-[#e3e3e3]'}`}>Source ({output?.files.length || 0})</button>
            </div>
            <div className="flex items-center gap-3">
              {isLoading && <span className="text-[10px] font-mono text-blue-400 animate-pulse">ORCHESTRATING COMPONENT ARCHITECTURE...</span>}
            </div>
          </div>

          <div ref={previewContainerRef} className="flex-1 relative overflow-hidden flex flex-col bg-[#000]">
            {error && (
              <div className="absolute top-4 right-4 z-[60] max-w-sm bg-[#1e1f20] border border-red-500/50 p-3 rounded-lg shadow-2xl">
                <p className="text-[11px] text-red-300">{error}</p>
              </div>
            )}
            
            {viewMode === 'code' ? (
              <CodeDisplay files={output?.files || []} />
            ) : (
              <div className="flex-1 p-4 bg-[#000]">
                {output?.previewHtml ? (
                  <div className="w-full h-full relative group">
                    <PreviewFrame html={output.previewHtml} />
                    <button 
                      onClick={toggleFullScreen} 
                      className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-12">
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#444746] flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-[#444746]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
                      </svg>
                    </div>
                    <p className="text-[12px] font-medium text-[#c4c7c5]">
                      Switch to Editor to configure granular GSAP timelines or use Prompt for free-form creation.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {isLoading && (
              <div className="absolute inset-0 bg-[#131314]/80 backdrop-blur-[8px] z-50 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-t-2 border-blue-400 rounded-full animate-spin mb-6"></div>
                <p className="text-[16px] font-medium text-blue-400 animate-pulse mb-2">Building Modular Multi-Page App</p>
                <p className="text-[10px] text-gray-500 max-w-xs uppercase tracking-widest font-mono">Generating src/components/ui + Full Repos</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

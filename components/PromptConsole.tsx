
import React from 'react';

interface PromptConsoleProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isRefining?: boolean;
}

const PromptConsole: React.FC<PromptConsoleProps> = ({ prompt, setPrompt, onGenerate, isLoading, isRefining }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onGenerate();
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRefining 
            ? "Add a dark theme contact form or change the hero typography to serif..." 
            : "e.g. Build a high-end agency landing page with smooth GSAP image parallax and text stagger reveals. Focus on bold typography."
          }
          className="w-full h-full bg-[#131314] border border-[#333537] rounded-lg px-3 py-2 text-[13px] text-[#e3e3e3] placeholder-[#444746] resize-none focus:outline-none studio-transition leading-relaxed font-normal"
        />
        <div className="absolute bottom-2 right-2 pointer-events-none opacity-20">
          <span className="text-[9px] font-mono font-bold tracking-tighter">CTRL+ENTER</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${isRefining ? 'bg-blue-400' : 'bg-[#444746]'}`}></div>
        <span className="text-[9px] uppercase font-bold tracking-widest text-[#c4c7c5]">
          {isRefining ? 'Iteration Active' : 'Initial Blueprint'}
        </span>
      </div>
    </div>
  );
};

export default PromptConsole;


import React, { useState, useEffect } from 'react';
import { ProjectFile } from '../types';

interface CodeDisplayProps {
  files: ProjectFile[];
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ files }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (files.length > 0 && !selectedFilePath) {
      setSelectedFilePath(files[0].path);
    }
  }, [files, selectedFilePath]);

  const selectedFile = files.find(f => f.path === selectedFilePath);

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (files.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-20">
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
        <p className="text-[12px] font-medium uppercase tracking-widest">Source files pending</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* File Tree Sidebar */}
      <div className="w-60 border-r border-[#333537] bg-[#1e1f20] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#333537]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#c4c7c5]">File Explorer</span>
        </div>
        <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          {files.map(file => (
            <button
              key={file.path}
              onClick={() => setSelectedFilePath(file.path)}
              className={`w-full text-left px-4 py-2 text-[12px] studio-transition truncate flex items-center gap-2.5 ${
                selectedFilePath === file.path 
                ? 'bg-blue-400/10 text-blue-400 border-r-2 border-blue-400' 
                : 'text-[#c4c7c5] hover:text-[#e3e3e3] hover:bg-[#28292a]'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <span className="truncate font-mono text-[11px]">{file.path.split('/').pop()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#131314]">
        <div className="h-9 border-b border-[#333537] bg-[#1e1f20] flex items-center justify-between px-4">
          <span className="text-[10px] font-mono text-gray-500 truncate">{selectedFile?.path}</span>
          <button 
            onClick={handleCopy}
            className="text-[10px] text-blue-400 hover:text-blue-300 font-bold studio-transition uppercase tracking-wider"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5 font-mono text-[13px] leading-relaxed scrollbar-hide">
          <pre className="text-[#e3e3e3] whitespace-pre tabular-nums">
            <code>{selectedFile?.content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeDisplay;

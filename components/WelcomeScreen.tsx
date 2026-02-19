
import React, { useState } from 'react';

interface WelcomeScreenProps {
  onSetKey: (key: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSetKey }) => {
  const [keyInput, setKeyInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyInput.trim()) {
      onSetKey(keyInput.trim());
    }
  };

  return (
    <div className="h-screen w-screen bg-[#131314] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-google font-medium text-[#e3e3e3]">GSAPGenie Studio</h1>
          <p className="text-[#c4c7c5] text-sm">
            Enter your Gemini API key to start architecting high-performance websites.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#c4c7c5] ml-1 uppercase tracking-wider">API Key</label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste your API key here"
              className="w-full bg-[#1e1f20] border border-[#333537] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 studio-transition"
            />
          </div>

          <button
            type="submit"
            disabled={!keyInput.trim()}
            className="w-full bg-[#a8c7fa] hover:bg-[#d2e3fc] text-[#062e6f] font-semibold py-3 rounded-xl studio-transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Get Started
          </button>
        </form>

        <div className="pt-6 border-t border-[#333537] text-center">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 studio-transition flex items-center justify-center gap-2"
          >
            Get your key from Google AI Studio
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

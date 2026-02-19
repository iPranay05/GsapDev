
import React from 'react';
import { SiteConfig, SiteSection, AnimationStyle, EntryAnimation } from '../types';

interface EditorProps {
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const SECTION_TYPES: SiteSection['type'][] = ['hero', 'features', 'showcase', 'cta', 'contact', 'about'];

const Editor: React.FC<EditorProps> = ({ config, setConfig, onGenerate, isLoading }) => {
  const addSection = () => {
    const newSection: SiteSection = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'features',
      title: 'New Section',
      description: 'Describe what this section does.',
      animationStyle: AnimationStyle.FADE_UP,
      scrub: 1,
      pin: false
    };
    setConfig(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const removeSection = (id: string) => {
    setConfig(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id) }));
  };

  const updateSection = (id: string, updates: Partial<SiteSection>) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1f20] overflow-y-auto scrollbar-hide pb-6 space-y-8">
      <div>
        <h2 className="text-[11px] font-bold text-[#c4c7c5] uppercase tracking-wider mb-4 flex items-center gap-2">
          Project Identity
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Project Name</label>
            <input 
              type="text" 
              value={config.siteName}
              onChange={(e) => setConfig(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full bg-[#131314] border border-[#333537] rounded-lg px-3 py-2 text-[12px] text-[#e3e3e3] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Theme Palette</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={config.primaryColor}
                onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="w-8 h-8 bg-transparent border-0 cursor-pointer p-0"
              />
              <input 
                type="text" 
                value={config.primaryColor}
                onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="flex-1 bg-[#131314] border border-[#333537] rounded-lg px-3 py-1.5 text-[11px] text-[#e3e3e3]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold text-[#c4c7c5] uppercase tracking-wider">Site Architecture</h2>
          <button 
            onClick={addSection}
            className="text-[10px] font-bold bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-1 rounded studio-transition"
          >
            + Add Section
          </button>
        </div>

        <div className="space-y-3">
          {config.sections.map((section) => (
            <div key={section.id} className="bg-[#131314] border border-[#333537] rounded-xl p-4 relative group">
              <button 
                onClick={() => removeSection(section.id)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Type</label>
                  <select 
                    value={section.type}
                    onChange={(e) => updateSection(section.id, { type: e.target.value as any })}
                    className="w-full bg-[#1e1f20] border border-[#333537] rounded px-2 py-1 text-[11px] text-[#e3e3e3] focus:outline-none"
                  >
                    {SECTION_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Scroll Anim</label>
                  <select 
                    value={section.animationStyle}
                    onChange={(e) => updateSection(section.id, { animationStyle: e.target.value as AnimationStyle })}
                    className="w-full bg-[#1e1f20] border border-[#333537] rounded px-2 py-1 text-[11px] text-[#e3e3e3] focus:outline-none"
                  >
                    {Object.values(AnimationStyle).map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              {section.type === 'hero' && (
                <div className="mb-3">
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Hero Entry Animation</label>
                  <select 
                    value={section.entryAnimation || 'fade-in'}
                    onChange={(e) => updateSection(section.id, { entryAnimation: e.target.value as EntryAnimation })}
                    className="w-full bg-[#1e1f20] border border-[#333537] rounded px-2 py-1 text-[11px] text-[#e3e3e3] focus:outline-none"
                  >
                    <option value="fade-in">Fade In</option>
                    <option value="slide-down">Slide Down</option>
                    <option value="scale-up">Scale Up</option>
                    <option value="none">None</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1 flex justify-between">
                    Scrub <span>{section.scrub}</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="3" 
                    step="0.1" 
                    value={typeof section.scrub === 'number' ? section.scrub : 1}
                    onChange={(e) => updateSection(section.id, { scrub: parseFloat(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer group/pin">
                    <input 
                      type="checkbox" 
                      checked={section.pin}
                      onChange={(e) => updateSection(section.id, { pin: e.target.checked })}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded border ${section.pin ? 'bg-blue-600 border-blue-600' : 'border-[#333537]'} flex items-center justify-center`}>
                      {section.pin && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase group-hover/pin:text-blue-400">Pin Section</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">Content Title</label>
                <input 
                  type="text" 
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  className="w-full bg-[#1e1f20] border border-[#333537] rounded px-2 py-1 text-[11px] text-[#e3e3e3] mb-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] text-gray-500 uppercase font-bold mb-1">AI Prompt Hook</label>
                <textarea 
                  value={section.description}
                  onChange={(e) => updateSection(section.id, { description: e.target.value })}
                  className="w-full bg-[#1e1f20] border border-[#333537] rounded px-2 py-1 text-[11px] text-[#e3e3e3] h-14 resize-none focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 sticky bottom-0 bg-[#1e1f20] pb-2">
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-[#333537] disabled:text-gray-500 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Generate Build
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Editor;

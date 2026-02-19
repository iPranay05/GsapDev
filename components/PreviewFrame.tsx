
import React, { useEffect, useRef } from 'react';

interface PreviewFrameProps {
  html: string;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ html }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-[#333537] shadow-2xl relative">
      <iframe
        ref={iframeRef}
        title="Live Preview"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default PreviewFrame;

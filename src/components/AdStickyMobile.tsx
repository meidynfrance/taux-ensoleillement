'use client';

import { useEffect, useRef, useState } from 'react';

const SCRIPT_300x100 = `(function(ccqbtw){var d=document,s=d.createElement('script'),l=d.scripts[d.scripts.length-1];s.settings=ccqbtw||{};s.src="\/\/shameful-farm.com\/bCX.VDsZd\/GIlz0HYqWJcl\/Je_mc9\/ueZ\/U\/lvk\/P\/TNY\/5eOzTeY\/xQN\/D\/UStaNqjxkL5VNqj-EX0NOgQk";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})`  ;

export default function AdStickyMobile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    injected.current = true;
    const script = document.createElement('script');
    script.textContent = SCRIPT_300x100;
    containerRef.current.appendChild(script);
  }, []);

  if (closed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end pb-0 md:hidden">
      <div className="relative bg-white border-t border-gray-200 shadow-lg w-full flex justify-center">
        <button
          onClick={() => setClosed(true)}
          className="absolute -top-6 right-2 bg-gray-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center leading-none opacity-70 hover:opacity-100"
          aria-label="Fermer la publicité"
        >
          ×
        </button>
        <div ref={containerRef} style={{ minWidth: 300, minHeight: 100 }} aria-hidden="true" />
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';

// Codes HilltopAds
const SCRIPTS = {
  '300x250': `(function(tex){var d=document,s=d.createElement('script'),l=d.scripts[d.scripts.length-1];s.settings=tex||{};s.src="\/\/shameful-farm.com\/bIX.VbsXd\/GGl_0bY\/Wpcf\/Ke\/mn9huUZbUFlEkgPjT-Y\/5nO\/TdYlxCNhTzcGteNGjwkI5\/N_jyEC2KMBQy";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})`  ,
  '300x100': `(function(ccqbtw){var d=document,s=d.createElement('script'),l=d.scripts[d.scripts.length-1];s.settings=ccqbtw||{};s.src="\/\/shameful-farm.com\/bCX.VDsZd\/GIlz0HYqWJcl\/Je_mc9\/ueZ\/U\/lvk\/P\/TNY\/5eOzTeY\/xQN\/D\/UStaNqjxkL5VNqj-EX0NOgQk";s.async=true;s.referrerPolicy='no-referrer-when-downgrade';l.parentNode.insertBefore(s,l);})({})`  ,
};

interface Props {
  size: '300x250' | '300x100';
  className?: string;
}

export default function AdBanner({ size, className = '' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    injected.current = true;

    const script = document.createElement('script');
    script.textContent = SCRIPTS[size];
    containerRef.current.appendChild(script);
  }, [size]);

  const [w, h] = size.split('x').map(Number);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ minWidth: w, minHeight: h }}
      aria-hidden="true"
    />
  );
}

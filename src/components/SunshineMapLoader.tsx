'use client';

import dynamic from 'next/dynamic';

const SunshineMap = dynamic(() => import('@/components/SunshineMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    </div>
  ),
});

export default function SunshineMapLoader() {
  return <SunshineMap />;
}

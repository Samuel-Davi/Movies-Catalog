'use client';

import { useEffect } from 'react';

interface ModalTrailerProps {
  youtubeId: string;
  onClose: () => void;
}

const ModalTrailer = ({ youtubeId, onClose }: ModalTrailerProps) => {
  // Impede scroll do fundo
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center transition-opacity">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-3xl mx-4 animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute z-20 cursor-pointer top-2 right-2 text-black bg-white bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75 transition"
        >
          ✕
        </button>
        <div className="relative pb-[56.25%]">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="Trailer"
            allowFullScreen
            className="absolute z-10 top-0 left-0 w-full h-full rounded-b-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ModalTrailer;

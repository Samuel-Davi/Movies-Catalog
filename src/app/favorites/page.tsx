'use client';

import { useEffect, useState } from 'react';
import { TypeFilmes } from '../types/types';
import Link from 'next/link';

const PaginaFavoritos = () => {
  const [favoritos, setFavoritos] = useState<TypeFilmes[]>([]);
  

  useEffect(() => {
    const salvos = localStorage.getItem('favoritos');
    
    if (salvos) {
      setFavoritos(JSON.parse(salvos));
    }
  }, []);

  return (
    <div className="min-h-screen px-6 py-10 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🎬 Meus Favoritos</h1>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6"
        >
        ← Voltar para a Home
    </Link>

      {favoritos.length === 0 ? (
        <p>Você ainda não favoritou nenhum filme.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {favoritos.map(filme => (
                <Link key={filme.id} href={`/movie/${filme.id}`}>
                    <div key={filme.id} className=" h-[100%] cursor-pointer flex flex-col py-4 items-center bg-white rounded-xl shadow-md overflow-hidden">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                            alt={filme.title}
                            className="rounded-xl w-auto h-60 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-black text-xl font-semibold">{filme.title}</h2>
                            <p className="text-gray-600 text-sm mt-2">{filme.overview}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default PaginaFavoritos;

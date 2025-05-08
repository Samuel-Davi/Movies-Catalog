// app/filme/[id]/page.tsx
'use client'

import { getMovieById } from "@/app/data/api";
import { TypeFilmes } from "@/app/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart } from 'lucide-react'

  export default function DetalhesFilme() {
    const { id } = useParams();
    const router = useRouter()
    console.log(id)

    const [filme, setFilme] = useState<TypeFilmes>({
        id: 0,
        title: "",
        overview: "",
        poster_path: "",
        release_date: "",
        vote_average: 0,
        genre_ids: []
    })
    const [favorito, setFavorito] = useState(false)

    useEffect(() => {
        async function getData(){
            if(id){
                const res = await getMovieById(id?.toString())
                setFilme(res)
            }
        }
        getData()
        const favs = JSON.parse(localStorage.getItem('favoritos') || '[]');
        setFavorito(favs.some((f: TypeFilmes) => f.id === Number(id)));
      
    }, [])

    const toggleFavorito = () => {
      const favs:TypeFilmes[] = JSON.parse(localStorage.getItem('favoritos') || '[]');
      let atualizados;
  
      if (favorito) {
        atualizados = favs.filter((f: TypeFilmes) => f.id !== Number(id));
      } else {
        atualizados = [...favs, { id: filme.id, title: filme.title, poster_path: filme.poster_path }];
      }
  
      localStorage.setItem('favoritos', JSON.stringify(atualizados));
      setFavorito(!favorito);
    };
  
  
    return (
        <main className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => router.push('/')}
          className="cursor-pointer mb-6 px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition"
        >
          ← Voltar para o catálogo
        </button>
  
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
            alt={filme.title}
            className="w-full md:w-72 rounded-xl shadow-lg"
          />
  
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{filme.title}</h1>
            <p className="text-gray-500 mb-4">
              <strong>Lançamento:</strong> {filme.release_date} <br />
              <strong>Avaliação:</strong> ⭐ {filme.vote_average}/10
            </p>
  
            <p className="text-lg leading-relaxed">{filme.overview}</p>
            <button
              onClick={toggleFavorito}
              className="p-2 mt-10 cursor-pointer rounded-full border hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title={favorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
            >
              {favorito ? (
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              ) : (
                <Heart className="w-6 h-6 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </main>
    );
  }
  
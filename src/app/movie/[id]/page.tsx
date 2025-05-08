// app/filme/[id]/page.tsx
'use client'

import { getMovieById, getProviders, getTrailer } from "@/app/data/api";
import { TypeFilmes, TypeProvider } from "@/app/types/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart } from 'lucide-react'
import ModalTrailer from "@/app/components/modalTrailer";

  export default function DetalhesFilme() {
    const { id } = useParams();
    const router = useRouter()

    const [filme, setFilme] = useState<TypeFilmes>({
        id: 0,
        title: "",
        overview: "",
        poster_path: "",
        release_date: "",
        vote_average: 0,
        genre_ids: []
    })
    const [providers, setProviders] = useState<TypeProvider[]>([{
      provider_id: -1,
      provider_name: "Sem Fontes, Verifique os Cinemas",
      logo_path: ''
    }])
    const [favorito, setFavorito] = useState(false)
    const [trailer, setTrailer] = useState<string | null>(null)
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        async function getData(){
            if(id){
                const res = await getMovieById(id.toString())
                setFilme(res)
                const provider = await getProviders(id.toString())
                // console.log(provider)
                if (provider.results.BR) setProviders(provider.results?.BR.flatrate)
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

    const carregaTrailer = async () => {
      if (id) {
        const res = await getTrailer(id.toString())
        if (res) setTrailer(res)
        setOpenModal(true)
      }
    }
  
  
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
            <p onClick={carregaTrailer} className="underline text-xl mt-5 cursor-pointer text-white">Ver Trailer</p>
            <p className="text-2xl font-bold mt-5">Onde Assistir: </p>
            <div className="flex">
              <div className="w-[80%] flex flex-col items-center">
                {providers.map((prov: TypeProvider) => (
                  <div key={prov.provider_id} className="gap-x-2 rounded-xl my-2 bg-white border-2 w-[70%] border-white flex justify-center p-4 items-center text-sm">
                    <img
                      src={prov.provider_id != -1 ? `https://image.tmdb.org/t/p/w45${prov.logo_path}` : '/cinema.png'}
                      alt="image"
                      className="w-8 h-8 mr-3 rounded"
                    />
                    <span className="text-gray-700">{prov.provider_name}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={toggleFavorito}
                className="p-2 mt-10 h-[10%] cursor-pointer rounded-full border hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
        </div>
        {(openModal && trailer) && (
          <ModalTrailer youtubeId={trailer} onClose={() => {
            setTrailer(null)
            setOpenModal(false)
          }}/>
        )}
      </main>
    );
  }
  
'use client'
import { useEffect, useState } from "react";
import { getCategories, getMovies, getMoviesByCategory } from "./data/api";
import Link from "next/link";
import { TypeFilmes, TypeGenero } from "./types/types";

export default function Home() {

  const [busca, setBusca] = useState('')
  const [filmes, setFilmes] = useState<TypeFilmes[]>([])
  const [generos, setGeneros] = useState<undefined | TypeGenero[]>([]);
  const [generosSelecionados, setGenerosSelecionados] = useState<number[]>([]);

  async function getData(search:string = ""){
    const newData = await getMovies(search, generosSelecionados)
    setFilmes(newData)
    const categorias = await getCategories()
    setGeneros(categorias)
  }

  async function getMoviesByCategories(){
    if (generosSelecionados) setFilmes(await getMoviesByCategory(generosSelecionados))
  }
  
  useEffect(() => {
    getData()
  },[])

  useEffect(() => {
    getData(busca)
  }, [busca, setBusca])
  useEffect(() => {
    if(generosSelecionados) getMoviesByCategories(); else getData()
  }, [generosSelecionados])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Filmes</h1>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Filtrar por gêneros
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {generos?.map((genero) => (
            <label
              key={genero.id}
              className="flex items-center gap-2 p-2 border rounded-md cursor-pointer dark:border-gray-700 dark:text-white"
            >
              <input
                type="checkbox"
                value={genero.id}
                checked={generosSelecionados?.includes(genero.id)}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setGenerosSelecionados((prev) =>
                    prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
                  );
                }}
              />
              {genero.name}
            </label>
          ))}
        </div>
      </div>
      <input
        type="text"
        placeholder="Buscar por título..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') getData(busca);
        }}
        className=" border-2 rounded-2xl p-2 mb-10 w-full"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filmes.map(filme => (
          <Link key={filme.id} href={`/movie/${filme.id}`}>
            <div key={filme.id} className=" h-[100%] cursor-pointer flex flex-col py-4 items-center bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={filme.poster_path}
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
    </main>
  );
}

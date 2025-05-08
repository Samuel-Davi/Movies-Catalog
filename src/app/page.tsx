'use client'
import { useEffect, useState } from "react";
import { getCategories, getMovies } from "./data/api";
import Link from "next/link";
import { TypeFilmes, TypeGenero } from "./types/types";

export default function Home() {

  const [busca, setBusca] = useState('')
  const [filmes, setFilmes] = useState<TypeFilmes[]>([])
  const [generos, setGeneros] = useState<undefined | TypeGenero[]>([]);
  const [generosSelecionados, setGenerosSelecionados] = useState<number[]>([]);
  const [page, setPage] = useState(1); 
  const [loading, setLoading] = useState(false); 
  const [hasMore, setHasMore] = useState(true);

  async function getData(){
    const newData = await getMovies(busca, generosSelecionados, page)
    // console.log(newData)
    setFilmes((prevMovies) => {
      const newUniqueMovies = newData.filter(
        (newMovie) => !prevMovies.some((m) => m.id === newMovie.id)
      );
      return [...prevMovies, ...newUniqueMovies];
    });
    setHasMore(newData.length > 0)
    const categorias = await getCategories()
    setGeneros(categorias)
  }

  async function getNewData(){
    const newData = await getMovies(busca, generosSelecionados, page)
    // console.log(newData)
    setFilmes(newData);
    setHasMore(newData.length > 0)
    const categorias = await getCategories()
    setGeneros(categorias)
  }

  // async function getMoviesByCategories(){
  //   if (generosSelecionados) setFilmes(await getMoviesByCategory(generosSelecionados))
  // }

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight &&
      !loading && hasMore
    ) {
      setPage((prevPage) => prevPage + 1); // Avança para a próxima página
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);
  
  useEffect(() => {
    setLoading(true)
    getData()
    setLoading(false)
  },[page])

  useEffect(() => {
    setPage(1)
    getNewData()
  }, [busca, setBusca])

  useEffect(() => {
    setPage(1)
    getNewData()
    // setFilmesFiltrados(generosSelecionados && generosSelecionados.length > 0 ? filmes.filter((filme) => generosSelecionados.map(gen => filme.genre_ids.includes(gen))) : filmes)
  }, [generosSelecionados])

  useEffect(() => {
    // setFilmesFiltrados(generosSelecionados && generosSelecionados.length > 0 ? filmes.filter((filme) => generosSelecionados.map(gen => filme.genre_ids.includes(gen))) : filmes)
  }, [filmes])

  return (
    <main className="px-6 py-4">
      <header className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold">Catálogo de Filmes</h1>
        <div className="flex px-6 py-4">
          <Link
            href="/favorites"
            className=" bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            ❤️ Favoritos
          </Link>
        </div>
      </header>

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
          if (e.key === 'Enter') getData();
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
      {loading && (
        <div className="flex justify-center mt-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!hasMore && (
        <p className="text-center text-gray-400 mt-6">Você chegou ao fim dos resultados.</p>
      )}

    </main>
  );
}

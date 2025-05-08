import { TypeFilmes } from "../types/types";


export async function getMovies(search:string = "", genero:number[]|null) {
    if (search == ""){
      const res = await fetch("https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1", {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
      });
      
      const data = await res.json();
      console.log(data)
      const filmes:TypeFilmes[] = data.results.map((filme:TypeFilmes) => ({
        id: filme.id,
        title: filme.title,
        overview: filme.overview,
        poster_path: `https://image.tmdb.org/t/p/w500${filme.poster_path}`,
        release_date: filme.release_date,
        vote_average: filme.vote_average,
        genre_ids: filme.genre_ids
      }))
      // console.log(data)

      
      const filmesFiltrados = genero && genero?.length > 0 ? filmes.filter((filme) => genero.map(gen => filme.genre_ids.includes(gen))) : filmes
      return (filmesFiltrados.filter((film) => film.overview != "")).slice(0,100)
    } else {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${search}&language=pt-BR&page=1`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
        }
      });
      
      const data = await res.json();
      // console.log(data)
      const filmes:TypeFilmes[] = data.results.map((filme:TypeFilmes) => ({
        id: filme.id,
        title: filme.title,
        overview: filme.overview,
        poster_path: `https://image.tmdb.org/t/p/w500${filme.poster_path}`,
        release_date: filme.release_date,
        vote_average: filme.vote_average,
        genre_ids: filme.genre_ids
      }))
      // console.log(filmes)
      
      const filmesFiltrados = genero && genero?.length > 0 ? filmes.filter((filme) => genero.map(gen => filme.genre_ids.includes(gen))) : filmes
      return (filmesFiltrados.filter((film) => film.overview != "")).slice(0,100)
    }
}

export async function getMovieById(id: string) {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=pt-BR`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    }
  });
  
  const data = await res.json();
  
  console.log(data)
  return data
}

export async function getCategories() {
  let res;
  await fetch('https://api.themoviedb.org/3/genre/movie/list?language=pt-BR', {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    }
  }).then((res) => res.json())
  .then((data) => res = (data.genres));

  return res
}

export async function getMoviesByCategory(genero:number[]){
  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genero.join(',')}&language=pt-BR`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    }
  });
  
  const data = await res.json();
  // console.log(data)
  const filmes:TypeFilmes[] = data.results.map((filme:TypeFilmes) => ({
    id: filme.id,
    title: filme.title,
    overview: filme.overview,
    poster_path: `https://image.tmdb.org/t/p/w500${filme.poster_path}`,
    release_date: filme.release_date,
    vote_average: filme.vote_average,
    genre_ids: filme.genre_ids
  }))
  // console.log(filmes)
  
  
  return (filmes.filter((film) => film.overview != "")).slice(0,100)
}
export type TypeFilmes = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
}
  
export type TypeGenero = {
    id: number;
    name:string;
}
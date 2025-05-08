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

export type TypeProvider = {
    provider_id: number;
    provider_name: string;
    logo_path: string;
}

export type TypeTrailer = {
    id: string;
    key: string;
    type: string;
    site: string;
}
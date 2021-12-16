export interface GenreRequestBody {
  name: string;
}

export interface GenreResponseBody extends GenreRequestBody {
  id: string;
}

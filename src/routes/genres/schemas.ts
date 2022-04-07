import { JSONSchemaType } from 'ajv';

export interface GenreRequestBody {
  slug: string;
  name: string;
}

export interface GenreResponseBody extends GenreRequestBody {
  id: string;
}

export const genreRequestBodySchema: JSONSchemaType<GenreRequestBody> = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 40,
    },
    slug: { type: 'string', minLength: 2, maxLength: 40, format: 'slug' },
  },
  required: ['name', 'slug'],
};

export const genreResponseBodySchema: JSONSchemaType<GenreResponseBody> = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'object-id',
    },
    ...(genreRequestBodySchema.properties as NonNullable<
      typeof genreRequestBodySchema.properties
    >),
  },
  required: ['id', ...genreRequestBodySchema.required],
};

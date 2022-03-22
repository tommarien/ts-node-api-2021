import Schema from 'fluent-json-schema';

export const genreRequestBodySchema = Schema.object()
  .prop(
    'slug',
    Schema.string()
      .minLength(2)
      .maxLength(40)
      .raw({ format: 'slug' })
      .required(),
  )
  .prop('name', Schema.string().maxLength(40).required());

export const genreResponseBodySchema = genreRequestBodySchema.extend(
  Schema.object().prop('id', Schema.string().raw({ format: 'object-id' })),
);

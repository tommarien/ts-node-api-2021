import Schema from 'fluent-json-schema';

export interface ProductCategoryBody {
  slug: string;
  name: string;
}

export interface ProductCategoryReply extends ProductCategoryBody {
  id: string;
}

export const productCategoryBodySchema = Schema.object()
  .prop(
    'slug',
    Schema.string()
      .minLength(2)
      .maxLength(40)
      .raw({ format: 'slug' })
      .required(),
  )
  .prop('name', Schema.string().maxLength(60).required());

export const productCategoryReplySchema = Schema.object()
  .prop('id', Schema.string())
  .extend(productCategoryBodySchema);
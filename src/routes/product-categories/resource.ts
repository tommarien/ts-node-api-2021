import Schema from 'fluent-json-schema';

export interface ProductCategoryReply {
  id: string;
  slug: string;
  name: string;
}

export const productCategoryReplySchema = Schema.object()
  .prop('id', Schema.string())
  .prop('slug', Schema.string())
  .prop('name', Schema.string());

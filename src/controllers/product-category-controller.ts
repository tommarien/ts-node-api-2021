import { inject, injectable } from 'inversify';
import { DbContext } from '../db/db-context';
import { ProductCategory } from '../db/product-category';
import {
  ProductCategoryBody,
  ProductCategoryReply,
} from '../routes/product-categories/schemas';
import { ServiceIdentifier } from '../service';

const mapToReply = (category: ProductCategory) => ({
  id: category._id.toHexString(),
  slug: category.slug,
  name: category.name,
});

@injectable()
export class ProductCategoryController {
  constructor(
    @inject(ServiceIdentifier.DbContext) private readonly db: DbContext,
  ) {}

  async list(): Promise<ProductCategoryReply[]> {
    const categories = await this.db.productCategories
      .find()
      .sort('name')
      .toArray();

    return categories.map(mapToReply);
  }

  async save(data: ProductCategoryBody): Promise<ProductCategoryReply> {
    const { insertedId } = await this.db.productCategories.insertOne(data);

    return {
      id: insertedId.toHexString(),
      ...data,
    };
  }
}

export const ServiceIdentifier = {
  DbContext: Symbol.for('dbContext'),
  controllers: {
    productCategory: Symbol.for('productCategoryController'),
  },
} as const;

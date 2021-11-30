import { ContainerModule } from 'inversify';
import { ServiceIdentifier } from '../service';

import { ProductCategoryController } from './product-category-controller';

const controllerContainerModule = new ContainerModule((bind) => {
  bind(ServiceIdentifier.controllers.productCategory).to(
    ProductCategoryController,
  );
});

export default controllerContainerModule;

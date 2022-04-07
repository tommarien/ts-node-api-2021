import { JSONSchemaType } from 'ajv';

export function arraySchemaOf<T>(
  items: JSONSchemaType<T>,
): JSONSchemaType<T[]> {
  return {
    type: 'array',
    items,
  };
}

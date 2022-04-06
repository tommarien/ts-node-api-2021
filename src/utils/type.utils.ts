export type WithProperty<K extends string | number | symbol, T> = {
  [k in K]: T;
};

export function assertHas<T, K extends string>(
  key: K,
  value: object,
): asserts value is WithProperty<K, T> {
  if (!(key in value)) throw new Error(`The value has no property ${key}`);
}

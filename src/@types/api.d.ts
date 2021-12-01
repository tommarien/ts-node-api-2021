import { DependencyContainer } from 'tsyringe';

export interface TSyringeInstaller {
  (container: DependencyContainer): void;
}

export type DependencyScope = Pick<
  DependencyContainer,
  'resolve' | 'resolveAll'
>;

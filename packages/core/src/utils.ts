export type ElectroModule = typeof import("@faker-js/faker")["faker"];

export type MinMax = { min: number; max: number };

export type KeyOf<T> = keyof T;

export type TypeDef<NS extends KeyOf<ElectroModule>, T extends string> = `${NS}.${T}`;

export type PickOf<M, K extends KeyOf<M>> = KeyOf<Pick<M, K>>;

export type ExceptOf<M, K extends KeyOf<M>> = KeyOf<Omit<M, K>>;

export type TupleOf<M, K extends KeyOf<M>> = [PickOf<M, K>, ExceptOf<M, K>];

export interface BaseType<NS extends KeyOf<ElectroModule>, T extends string> {
  type: TypeDef<NS, T>;
}

export type Separate<M, T extends keyof M, K extends T> = [PickOf<M, Exclude<T, K>>, PickOf<M, Extract<T, K>>];

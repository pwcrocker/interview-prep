export type Nullable<T> = T extends undefined ? never : T | null;
export type NonNullable<T> = T extends null | undefined ? never : T;

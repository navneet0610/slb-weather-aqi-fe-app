// interfaces.ts

export interface Range {
  category: string;
  max: number;
}

export interface Ranges {
  [key: string]: Range[];
}

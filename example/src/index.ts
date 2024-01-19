export function hello(example: string): string {
  return example;
}

export function world<T>(example: T): T {
  return example;
}

export function getSwearWord(): string {
  return 'heck';
}

export function getFromStringAndNumber(str: string, num: number): string {
  return `${num} ${str}`;
}

export function getFromNumberAndString(num: number, str: string): string {
  return `${num} ${str}`;
}

// type test = {a: 1; b: 2} extends {a: 1} ? 1 : 0;
type test = (a: string, b: number) => string;

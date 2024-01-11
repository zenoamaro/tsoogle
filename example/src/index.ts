export function hello(example: string): string {
  return example;
}

export function world<T>(example: T): T {
  return example;
}

export function getSwearWord(): string {
  return 'heck';
}

type test =  {a: 1, b: 2} extends {a: 1}? 1 : 0;

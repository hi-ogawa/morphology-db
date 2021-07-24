//
// Result/Option
//

export type Result<T, E> =
  | { readonly ok: true; data: T }
  | { readonly ok: false; data: E };

export function Ok<T, E>(data: T): Result<T, E> {
  return { ok: true, data };
}

export function Err<T, E>(data: E): Result<T, E> {
  return { ok: false, data };
}

export type Option<T> = T | undefined;

//
// Simple progress bar
//
interface ProgressBarOptions {
  stream?: { write: (s: string) => void };
  format?: (i: number, n: number) => string;
  interval?: number;
}

export function* progressBar<T>(
  iterable: T[],
  {
    stream = process.stderr,
    format = (i, n) => `:: count = ${i}/${n}`,
    interval = 1,
  }: ProgressBarOptions = {}
): Iterable<T> {
  const n = iterable.length;
  stream.write(format(0, n));
  for (const [i, x] of iterable.entries()) {
    yield x;
    if (i + 1 === n || (i + 1) % interval === 0) {
      stream.write(`\r${format(i + 1, n)}`);
    }
  }
  stream.write("\n");
}

//
// Type assertion
//

export function assertDefined<T, E extends Error>(
  x: T,
  error?: E
): asserts x is NonNullable<T> {
  if (x === undefined || x === null) {
    throw error ?? new Error("assertDefined");
  }
}

export class NotFoundError extends Error {}

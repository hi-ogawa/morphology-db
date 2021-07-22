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
export function* progressBar<T>(
  iterable: T[],
  ostr = process.stderr,
  prefix = ":: count = ",
  interval = 10
): Iterable<T> {
  const total = iterable.length;
  ostr.write(`${prefix}0/${total}`);
  for (const [i, x] of iterable.entries()) {
    yield x;
    if (i + 1 === total || (i + 1) % interval === 0) {
      ostr.write(`\r${prefix}${i + 1}/${total}`);
    }
  }
  ostr.write("\n");
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

/**
 * Converte un ArrayBuffer in Buffer (Node.js)
 */
export function arrayBufferToBuffer(ab: ArrayBuffer): Buffer {
  return Buffer.from(ab);
}

// Utility to concatenate strings
export function concatStrings(...args: string[]): string {
  return args.join("");
}

// Utility to concatenate Buffers
export function concatBuffers(...args: Buffer[]): Buffer {
  return Buffer.concat(args);
}

// Generic utility to concatenate either strings or Buffers
export function concatAny(...args: (string | Buffer)[]): string | Buffer {
  if (args.length === 0) return "";
  if (typeof args[0] === "string") {
    return concatStrings(...(args as string[]));
  } else if (Buffer.isBuffer(args[0])) {
    return concatBuffers(...(args as Buffer[]));
  }
  throw new TypeError("Arguments must be all strings or all Buffers");
}
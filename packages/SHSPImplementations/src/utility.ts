/**
 * Converte un ArrayBuffer in Buffer (Node.js)
 */
export function arrayBufferToBuffer(ab: ArrayBuffer): Buffer {
  return Buffer.from(ab);
}
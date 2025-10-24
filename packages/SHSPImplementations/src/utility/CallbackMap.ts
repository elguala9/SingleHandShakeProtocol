export type Callback<T extends any[] = any[]> = (...args: T) => void;

export class CallbackMap<T extends any[] = any[]> {
  private readonly map: Map<string, Callback<T>> = new Map();

  add(key: string, cb: Callback<T>): void {
    this.map.set(key, cb);
  }

  get(key: string): Callback<T> | undefined {
    return this.map.get(key);
  }

  update(key: string, cb: Callback<T>): void {
    if (this.map.has(key)) {
      this.map.set(key, cb);
    }
  }

  remove(key: string): boolean {
    return this.map.delete(key);
  }

  clear(): void {
    this.map.clear();
  }

  has(key: string): boolean {
    return this.map.has(key);
  }

  keys(): IterableIterator<string> {
    return this.map.keys();
  }

  values(): IterableIterator<Callback<T>> {
    return this.map.values();
  }

  entries(): IterableIterator<[string, Callback<T>]> {
    return this.map.entries();
  }

  serializedObject(): string {
  return JSON.stringify(Object.fromEntries(Array.from(this.map.keys()).map(k => [k, true])));
  }
}

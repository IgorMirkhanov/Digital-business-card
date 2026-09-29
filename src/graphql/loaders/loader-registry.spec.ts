import { createOneToManyLoader, LoaderRegistry } from './loader-registry';

interface Row {
  parentId: string;
  value: number;
}

describe('createOneToManyLoader', () => {
  it('batches keys into a single call and groups rows by parent in key order', async () => {
    const batch = jest.fn(async (_ids: readonly string[]): Promise<Row[]> => [
      { parentId: 'b', value: 1 },
      { parentId: 'a', value: 2 },
      { parentId: 'b', value: 3 },
    ]);
    const loader = createOneToManyLoader(batch, (row: Row) => row.parentId);

    const [a, b, c] = await Promise.all([loader.load('a'), loader.load('b'), loader.load('c')]);

    expect(batch).toHaveBeenCalledTimes(1);
    expect(batch).toHaveBeenCalledWith(['a', 'b', 'c']);
    expect(a.map((row) => row.value)).toEqual([2]);
    expect(b.map((row) => row.value)).toEqual([1, 3]);
    expect(c).toEqual([]);
  });
});

describe('LoaderRegistry', () => {
  it('creates a loader once per key', () => {
    const registry = new LoaderRegistry();
    const key = Symbol('test');
    const factory = jest.fn(() => createOneToManyLoader(async () => [], () => ''));

    expect(registry.get(key, factory)).toBe(registry.get(key, factory));
    expect(factory).toHaveBeenCalledTimes(1);
  });
});

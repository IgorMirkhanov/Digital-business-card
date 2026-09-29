import DataLoader from 'dataloader';

/**
 * Per-request cache of DataLoaders. Feature services register loaders lazily
 * by a unique key, so the GraphQL infrastructure knows nothing about domain
 * modules and every request gets fresh (non-leaking) batching caches.
 */
export class LoaderRegistry {
  private readonly loaders = new Map<symbol, DataLoader<unknown, unknown>>();

  get<K, V>(key: symbol, factory: () => DataLoader<K, V>): DataLoader<K, V> {
    let loader = this.loaders.get(key);
    if (!loader) {
      loader = factory() as DataLoader<unknown, unknown>;
      this.loaders.set(key, loader);
    }
    return loader as DataLoader<K, V>;
  }
}

/**
 * Builds a one-to-many loader: one batched query for all parent ids,
 * results grouped back by parent id in the order DataLoader expects.
 */
export function createOneToManyLoader<V>(
  batch: (parentIds: readonly string[]) => Promise<V[]>,
  parentIdOf: (row: V) => string,
): DataLoader<string, V[]> {
  return new DataLoader<string, V[]>(async (parentIds) => {
    const rows = await batch(parentIds);
    const byParent = new Map<string, V[]>(parentIds.map((id) => [id, []]));
    for (const row of rows) {
      byParent.get(parentIdOf(row))?.push(row);
    }
    return parentIds.map((id) => byParent.get(id) ?? []);
  });
}

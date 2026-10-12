export async function asyncFilter<T>(items: T[], predicate: (item: T, index: number) => Promise<unknown>): Promise<T[]> {
  const results = await Promise.all(items.map(predicate));
  return items.filter((_, index) => results[index]);
}
export async function asyncFind<T>(items: T[], predicate: (item: T, index: number) => Promise<unknown>): Promise<T | undefined> {
  for (let index = 0; index < items.length; index++) if (await predicate(items[index], index)) return items[index];
}
export async function asyncSome<T>(items: T[], predicate: (item: T, index: number) => Promise<unknown>): Promise<boolean> {
  return (await asyncFind(items, predicate)) !== undefined;
}

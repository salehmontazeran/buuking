export interface ResourceRepository {
  listAvailable(
    start: Date,
    end: Date,
  ): Promise<Array<{ id: string; name: string }>>;
}

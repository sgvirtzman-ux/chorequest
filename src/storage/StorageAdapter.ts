/**
 * Async even though localStorage is sync — this is the seam where a
 * cloud-sync adapter can plug in later without touching the app.
 */
export interface StorageAdapter {
  load(): Promise<string | null>
  save(serialized: string): Promise<void>
}

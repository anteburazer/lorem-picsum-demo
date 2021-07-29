export abstract class LocalStorageBase {
  abstract getItem(key: string): Promise<string | undefined>;
  abstract getItemSync(key: string): string | undefined;
  abstract setItem(key: string, value: string): Promise<void>;
  abstract removeItem(key: string): Promise<void>;
  abstract clear(): Promise<void>;
}
import { LocalStorageBase } from 'core/models';

export class LocalStorage extends LocalStorageBase {
  getItem(key: string): Promise<string | undefined> {
    const value = window.localStorage.getItem(key);
    return Promise.resolve<string | undefined>(value === null ? undefined : value);
  }

  getItemSync(key: string): string | undefined {
    const value = window.localStorage.getItem(key);
    return value || undefined;
  }

  setItem(key: string, value: string): Promise<void> {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      return Promise.resolve(e);
    }

    return Promise.resolve<void>(void 0);
  }

  removeItem(key: string): Promise<void> {
    window.localStorage.removeItem(key);
    return Promise.resolve<void>(void 0);
  }

  clear(): Promise<void> {
    window.localStorage.clear();
    return Promise.resolve<void>(void 0);
  }
}

export const localStorage = new LocalStorage();
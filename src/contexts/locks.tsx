import { createContext } from "react";

interface LockProvider {
  locked: (key: string) => boolean;
  withLocks: (keys: string[], func: () => Promise<void>) => Promise<void>;
}

class SingularLockProvider implements LockProvider {
  private _locked: boolean = false;
  private _queue: Array<() => void> = [];

  public locked() {
    return this._locked;
  }

  public async withLocks(_: string[], func: () => Promise<void>): Promise<void> {
    if (this._locked) {
      await new Promise<void>((resolve) => {
        this._queue.push(resolve);
      });
    }
    this._locked = true;
    try {
      await func();
    } finally {
      this._locked = false;
      const next = this._queue.shift();
      if (next) {
        next();
      }
    }
  }
}

class KeyedLockProvider implements LockProvider {
  private _locks: Map<string, SingularLockProvider> = new Map();

  public locked(key: string) {
    const lock = this._locks.get(key);
    if (!lock) return false;
    return lock.locked();
  }

  public async withLocks(keys: string[], func: () => Promise<void>): Promise<void> {
    // make sure the lock providers exist for each key
    keys.forEach((key) => {
      if (this._locks.has(key)) return;
      this._locks.set(key, new SingularLockProvider());
    });
    // acquire each lock sequentially
    const acquireNextOrExecuteFunc = async (idx: number) => {
      if (idx >= keys.length) {
        // all key locks have been acquired, execute the function
        return func();
      }
      // acquire the next lock
      const key = keys[idx]!;
      const lock = this._locks.get(key)!;
      await lock.withLocks([key], () => acquireNextOrExecuteFunc(idx + 1));
    };
    await acquireNextOrExecuteFunc(0);
  }
}

const locksContext = createContext(new KeyedLockProvider());

export { locksContext };

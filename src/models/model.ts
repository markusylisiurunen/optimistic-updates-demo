import { ObjectPool } from "./object-pool";

abstract class Model {
  public abstract readonly id: string;

  private _pool?: ObjectPool;

  public get pool(): ObjectPool {
    if (!this._pool) throw new Error("tried to access the model's object pool before it was set");
    return this._pool;
  }

  public set pool(value: ObjectPool) {
    this._pool = value;
  }
}

export { Model };

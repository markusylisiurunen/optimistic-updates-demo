import { makeAutoObservable } from "mobx";
import { Model } from "./model";

class Collection<T extends Model> {
  public readonly all: Set<T> = new Set();
  public readonly byId: Map<string, T> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  public add(model: T): void {
    this.all.add(model);
    this.byId.set(model.id, model);
  }

  public delete(model: T): void {
    this.all.delete(model);
    this.byId.delete(model.id);
  }

  public clear(): void {
    this.all.clear();
    this.byId.clear();
  }
}

export { Collection };

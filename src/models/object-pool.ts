import { makeAutoObservable } from "mobx";
import { BubbleModel } from "./bubble";
import { Collection } from "./collection";
import { ColorModel } from "./color";
import { Model } from "./model";
import { TeamModel } from "./team";

class ObjectPool {
  public readonly teams = new Collection<TeamModel>();
  public readonly colors = new Collection<ColorModel>();
  public readonly bubbles = new Collection<BubbleModel>();

  constructor() {
    makeAutoObservable(this);
  }

  public add(...models: Model[]): void {
    for (const model of models) {
      model.pool = this;
      if (model instanceof TeamModel) {
        this.teams.add(model);
      } else if (model instanceof ColorModel) {
        this.colors.add(model);
      } else if (model instanceof BubbleModel) {
        this.bubbles.add(model);
      } else {
        throw new Error("unknown model type");
      }
    }
  }

  public delete(model: Model): void {
    if (model instanceof TeamModel) {
      this.teams.delete(model);
    } else if (model instanceof ColorModel) {
      this.colors.delete(model);
    } else if (model instanceof BubbleModel) {
      this.bubbles.delete(model);
    } else {
      throw new Error("unknown model type");
    }
  }

  public clear(): void {
    this.teams.clear();
    this.colors.clear();
    this.bubbles.clear();
  }
}

export { ObjectPool };

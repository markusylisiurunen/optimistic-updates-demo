import { action, computed, makeObservable, observable } from "mobx";
import { BubbleModel } from "./bubble";
import { ColorModel } from "./color";
import { Model } from "./model";

type TeamModelArgs = {
  id: string;
  name: string;
};

class TeamModel extends Model {
  public readonly id: string;
  public name: string;

  get colors(): ColorModel[] {
    return Array.from(this.pool.colors.all).filter((color) => color.teamId === this.id);
  }

  get bubbles(): BubbleModel[] {
    return Array.from(this.pool.bubbles.all).filter((bubble) => bubble.teamId === this.id);
  }

  constructor(args: TeamModelArgs) {
    super();
    makeObservable(this, {
      name: observable,
      colors: computed,
      bubbles: computed,
      setName: action,
    });
    this.id = args.id;
    this.name = args.name;
  }

  public setName(name: string) {
    this.name = name;
  }
}

export { TeamModel };
export type { TeamModelArgs };

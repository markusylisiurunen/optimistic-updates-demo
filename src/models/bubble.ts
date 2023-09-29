import { action, computed, makeObservable, observable } from "mobx";
import { ColorModel } from "./color";
import { Model } from "./model";
import { TeamModel } from "./team";

type BubbleModelArgs = {
  id: string;
  teamId: string;
  colorId: string;
  createdAt: string;
  description: string;
  size: "s" | "m" | "l";
};

class BubbleModel extends Model {
  public readonly id: string;
  public teamId: string;
  public colorId: string;
  public createdAt: string;
  public description: string;
  public size: "s" | "m" | "l";

  get color(): ColorModel {
    const color = this.pool.colors.byId.get(this.colorId);
    if (!color) throw new Error("associated color not found");
    return color;
  }

  get team(): TeamModel {
    const team = this.pool.teams.byId.get(this.teamId);
    if (!team) throw new Error("associated team not found");
    return team;
  }

  constructor(args: BubbleModelArgs) {
    super();
    makeObservable(this, {
      teamId: observable,
      colorId: observable,
      createdAt: observable,
      description: observable,
      size: observable,
      color: computed,
      team: computed,
      setColorId: action,
      setDescription: action,
      setSize: action,
    });
    this.id = args.id;
    this.teamId = args.teamId;
    this.colorId = args.colorId;
    this.createdAt = args.createdAt;
    this.description = args.description;
    this.size = args.size;
  }

  public setColorId(colorId: string) {
    this.colorId = colorId;
  }

  public setDescription(description: string) {
    this.description = description;
  }

  public setSize(size: "s" | "m" | "l") {
    this.size = size;
  }
}

export { BubbleModel };
export type { BubbleModelArgs };

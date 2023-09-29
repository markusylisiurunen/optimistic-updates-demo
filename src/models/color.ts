import { action, computed, makeObservable, observable } from "mobx";
import { Model } from "./model";
import { TeamModel } from "./team";

type ColorModelArgs = {
  id: string;
  teamId: string;
  name: string;
  color: string;
};

class ColorModel extends Model {
  public readonly id: string;
  public teamId: string;
  public name: string;
  public color: string;

  get team(): TeamModel {
    const team = this.pool.teams.byId.get(this.teamId);
    if (!team) throw new Error("associated team not found");
    return team;
  }

  constructor(args: ColorModelArgs) {
    super();
    makeObservable(this, {
      teamId: observable,
      name: observable,
      color: observable,
      team: computed,
      setName: action,
      setColor: action,
    });
    this.id = args.id;
    this.teamId = args.teamId;
    this.name = args.name;
    this.color = args.color;
  }

  public setName(name: string) {
    this.name = name;
  }

  public setColor(color: string) {
    this.color = color;
  }
}

export { ColorModel };
export type { ColorModelArgs };

import { ColorModel, ColorModelArgs } from "../models";
import { Action } from "./action";

const createColorAction: Action<readonly [ColorModelArgs], void> = {
  id: "create_color",
  keys: () => [],
  async *execute(context, args) {
    yield () => {
      const color = new ColorModel(args);
      context.pool.add(color);
      return () => context.pool.delete(color);
    };
    try {
      await context.api.mutate({
        type: "create_color",
        data: { id: args.id, teamId: args.teamId, name: args.name, color: args.color },
      });
    } catch (error) {
      context.toast("Failed to create the color", "error");
      throw error;
    }
  },
};

export { createColorAction };

import { ColorModel } from "../models";
import { Action } from "./action";

const setColorNameAction: Action<readonly [ColorModel, string], void> = {
  id: "set_color_name",
  keys: (_, target) => [target.id],
  async *execute(context, target, name) {
    yield () => {
      const initial = target.name;
      target.setName(name);
      return () => target.setName(initial);
    };
    try {
      await context.api.mutate({
        type: "update_color",
        data: { id: target.id, name: name },
      });
    } catch (error) {
      context.toast("Failed to set the colors's name", "error");
      throw error;
    }
  },
};

export { setColorNameAction };

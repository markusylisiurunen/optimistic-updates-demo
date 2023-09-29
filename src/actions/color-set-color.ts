import { ColorModel } from "../models";
import { Action } from "./action";

const setColorColorAction: Action<readonly [ColorModel, string], void> = {
  id: "set_color_color",
  keys: (_, target) => [target.id],
  async *execute(context, target, color) {
    yield () => {
      const initial = target.color;
      target.setColor(color);
      return () => target.setColor(initial);
    };
    try {
      await context.api.mutate({
        type: "update_color",
        data: { id: target.id, color: color },
      });
    } catch (error) {
      context.toast("Failed to set the colors's color", "error");
      throw error;
    }
  },
};

export { setColorColorAction };

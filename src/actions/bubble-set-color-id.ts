import { BubbleModel } from "../models";
import { Action } from "./action";

const setBubbleColorIdAction: Action<readonly [BubbleModel, string], void> = {
  id: "set_bubble_color_id",
  keys: (_, target) => [target.id],
  async *execute(context, target, colorId) {
    yield () => {
      const initial = target.colorId;
      target.setColorId(colorId);
      return () => target.setColorId(initial);
    };
    try {
      await context.api.mutate({
        type: "update_bubble",
        data: { id: target.id, colorId: colorId },
      });
    } catch (error) {
      context.toast("Failed to set the bubble's color", "error");
      throw error;
    }
  },
};

export { setBubbleColorIdAction };

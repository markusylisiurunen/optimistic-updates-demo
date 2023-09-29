import { BubbleModel } from "../models";
import { Action } from "./action";

const setBubbleSizeAction: Action<readonly [BubbleModel, "s" | "m" | "l"], void> = {
  id: "set_bubble_size",
  keys: (_, target) => [target.id],
  async *execute(context, target, size) {
    yield () => {
      const initial = target.size;
      target.setSize(size);
      return () => target.setSize(initial);
    };
    try {
      await context.api.mutate({
        type: "update_bubble",
        data: { id: target.id, size: size },
      });
    } catch (error) {
      context.toast("Failed to set the bubble's size", "error");
      throw error;
    }
  },
};

export { setBubbleSizeAction };

import { BubbleModel } from "../models";
import { Action } from "./action";

const setBubbleDescriptionAction: Action<readonly [BubbleModel, string], void> = {
  id: "set_bubble_description",
  keys: (_, target) => [target.id],
  async *execute(context, target, description) {
    yield () => {
      const initial = target.description;
      target.setDescription(description);
      return () => target.setDescription(initial);
    };
    try {
      await context.api.mutate({
        type: "update_bubble",
        data: { id: target.id, description: description },
      });
    } catch (error) {
      context.toast("Failed to set the bubble's description", "error");
      throw error;
    }
  },
};

export { setBubbleDescriptionAction };

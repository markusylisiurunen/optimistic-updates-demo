import { BubbleModel } from "../models";
import { Action } from "./action";

const deleteBubbleAction: Action<readonly [BubbleModel], void> = {
  id: "delete_bubble",
  keys: (_, target) => [target.id],
  async *execute(context, target) {
    yield () => {
      context.pool.delete(target);
      return () => context.pool.add(target);
    };
    try {
      await context.api.mutate({
        type: "delete_bubble",
        data: { id: target.id },
      });
    } catch (error) {
      context.toast("Failed to delete the bubble", "error");
      throw error;
    }
  },
};

export { deleteBubbleAction };

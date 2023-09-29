import { BubbleModel, BubbleModelArgs } from "../models";
import { Action } from "./action";

const createBubbleAction: Action<readonly [BubbleModelArgs], void> = {
  id: "create_bubble",
  keys: () => [],
  async *execute(context, args) {
    yield () => {
      const bubble = new BubbleModel(args);
      context.pool.add(bubble);
      return () => context.pool.delete(bubble);
    };
    try {
      await context.api.mutate({
        type: "create_bubble",
        data: {
          id: args.id,
          teamId: args.teamId,
          colorId: args.colorId,
          createdAt: args.createdAt,
          description: args.description,
          size: args.size,
        },
      });
    } catch (error) {
      context.toast("Failed to create the bubble", "error");
      throw error;
    }
  },
};

export { createBubbleAction };

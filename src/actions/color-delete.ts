import { ColorModel } from "../models";
import { Action } from "./action";

const deleteColorAction: Action<readonly [ColorModel], void> = {
  id: "delete_color",
  keys: (_, target) => {
    const keys: string[] = [target.id];
    // add the bubbles that will be affected by the color deletion
    target.team.bubbles.forEach((bubble) => {
      if (bubble.colorId !== target.id) return;
      keys.push(bubble.id);
    });
    return keys;
  },
  async *execute(context, target) {
    // select the alternative color to swap the current colors to
    const alternative = target.team.colors.find((c) => c.id !== target.id);
    if (!alternative) {
      return;
    }
    yield () => {
      // swap the colors
      const swapped = new Set<string>();
      target.team.bubbles.forEach((bubble) => {
        if (bubble.colorId === target.id) {
          bubble.setColorId(alternative.id);
          swapped.add(bubble.id);
        }
      });
      // delete the color
      context.pool.delete(target);
      return () => {
        // add the color back
        context.pool.add(target);
        // swap the colors back
        target.team.bubbles.forEach((bubble) => {
          if (swapped.has(bubble.id)) {
            bubble.setColorId(target.id);
          }
        });
      };
    };
    try {
      await context.api.mutate({
        type: "delete_color",
        data: {
          id: target.id,
          swapId: alternative.id,
        },
      });
    } catch (error) {
      context.toast("Failed to delete the color", "error");
      throw error;
    }
  },
};

export { deleteColorAction };

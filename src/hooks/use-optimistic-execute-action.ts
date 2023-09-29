import { useState } from "react";
import { Action, EffectFunc } from "../actions";
import { useActionContext } from "./use-action-context";
import { useLocks } from "./use-locks";

async function iterateWithOptimisticUpdates<T>(it: AsyncGenerator<EffectFunc, T>): Promise<T> {
  const revertFuncStack = [] as ReturnType<EffectFunc>[];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const result = await it.next();
      if (result.done) {
        return result.value;
      }
      revertFuncStack.unshift(result.value());
    } catch (error) {
      revertFuncStack.forEach((revert) => (typeof revert === "function" ? revert() : undefined));
      throw error;
    }
  }
}

function useOptimisticExecuteAction<A extends readonly [] | readonly unknown[], R>(action: Action<A, R>) {
  // grab the dependencies
  const context = useActionContext();
  const locks = useLocks();
  // hold the action execution status
  const [status, setStatus] = useState<"idle" | "queued">("idle");
  // define the execute method
  function execute(...args: A) {
    if (status !== "idle") {
      throw new Error("cannot execute action while it is not idle");
    }
    const keys = Array.isArray(action.keys) ? action.keys : action.keys(context, ...args);
    Promise.resolve().then(async () => {
      const timeout = setTimeout(() => setStatus("queued"), 0);
      try {
        await locks.withLocks(keys, async () => {
          clearTimeout(timeout);
          setStatus("idle");
          await iterateWithOptimisticUpdates(action.execute(context, ...args));
        });
      } catch (error) {
        // no-op
      } finally {
        setStatus("idle");
      }
    });
  }
  return {
    status: status,
    isIdle: status === "idle",
    isQueued: status === "queued",
    execute: execute,
  };
}

export { useOptimisticExecuteAction };

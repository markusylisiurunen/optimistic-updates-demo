import { useState } from "react";
import { Action, EffectFunc } from "../actions";
import { useActionContext } from "./use-action-context";
import { useLocks } from "./use-locks";

async function iterateWithBufferedUpdates<T>(it: AsyncGenerator<EffectFunc, T>): Promise<T> {
  const updateFuncStack = [] as EffectFunc[];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await it.next();
    if (result.done) {
      updateFuncStack.forEach((update) => update());
      return result.value;
    }
    updateFuncStack.push(result.value);
  }
}

function useBlockingExecuteAction<A extends readonly [] | readonly unknown[], R>(action: Action<A, R>) {
  // grab the dependencies
  const context = useActionContext();
  const locks = useLocks();
  // hold the action execution status
  const [status, setStatus] = useState<"idle" | "queued" | "executing">("idle");
  // define the execute method
  async function execute(...args: A) {
    if (status !== "idle") {
      throw new Error("cannot execute action while it is not idle");
    }
    const keys = Array.isArray(action.keys) ? action.keys : action.keys(context, ...args);
    const timeout = setTimeout(() => setStatus("queued"), 0);
    try {
      await locks.withLocks(keys, async () => {
        clearTimeout(timeout);
        setStatus("executing");
        await iterateWithBufferedUpdates(action.execute(context, ...args));
      });
    } finally {
      setStatus("idle");
    }
  }
  return {
    status: status,
    isIdle: status === "idle",
    isQueued: status === "queued",
    isExecuting: status === "executing",
    execute: execute,
  };
}

export { useBlockingExecuteAction };

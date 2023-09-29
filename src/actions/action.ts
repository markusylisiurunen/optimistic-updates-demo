import { toast } from "sonner";
import { API } from "../api";
import { ObjectPool } from "../models";

type EffectFunc = () => (() => void) | void;

class ActionContext {
  public readonly api: API;
  public readonly pool: ObjectPool;

  constructor({ api, pool }: { api: API; pool: ObjectPool }) {
    this.api = api;
    this.pool = pool;
  }

  public toast(message: string, errorOrOpts?: "error" | { kind?: "default" | "error" }) {
    if (errorOrOpts === "error" || errorOrOpts?.kind === "error") toast.error(message);
    else toast(message);
  }
}

type ActionExecuteFunc<A extends readonly [] | readonly unknown[], R> = (
  context: ActionContext,
  ...args: A
) => AsyncGenerator<EffectFunc, R>;

interface Action<A extends readonly [] | readonly unknown[], R> {
  readonly id: string;
  keys: string[] | ((context: ActionContext, ...args: A) => string[]);
  execute: ActionExecuteFunc<A, R>;
}

export { ActionContext, type Action, type EffectFunc };

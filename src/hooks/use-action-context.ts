import { useMemo } from "react";
import { ActionContext } from "../actions";
import { useAPI } from "./use-api";
import { useObjectPool } from "./use-object-pool";

function useActionContext() {
  const api = useAPI();
  const pool = useObjectPool();
  return useMemo(() => new ActionContext({ api, pool }), [api, pool]);
}

export { useActionContext };

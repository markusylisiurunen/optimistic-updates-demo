import { useEffect, useState } from "react";
import { DataRequest } from "../loader";
import { useDataLoader } from "./use-data-loader";

function useRequestDataOnMount<T extends DataRequest["name"]>(
  ...args: Record<string, never> extends Extract<DataRequest, { name: T }>["opts"]
    ? readonly [T] | readonly [T, Extract<DataRequest, { name: T }>["opts"]]
    : readonly [T, Extract<DataRequest, { name: T }>["opts"]]
) {
  const dataLoader = useDataLoader();
  // hold the status of the request
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  // execute the request on mount
  useEffect(() => {
    // keep track of whether the request was canceled
    let canceled = false;
    // start the request
    setStatus("loading");
    Promise.resolve()
      .then(() => dataLoader.request(...args))
      .finally(() => {
        if (canceled) return;
        setStatus("idle");
      });
    // cancel the request if the component is unmounted
    return () => {
      canceled = true;
    };
  }, [dataLoader]);
  return {
    status: status,
    isIdle: status === "idle",
    isLoading: status === "loading",
  };
}

export { useRequestDataOnMount };

import { useContext } from "react";
import { dataLoaderContext } from "../contexts";

function useDataLoader() {
  const dataLoader = useContext(dataLoaderContext);
  if (!dataLoader) throw new Error("tried to use data loader outside of its provider");
  return dataLoader;
}

export { useDataLoader };

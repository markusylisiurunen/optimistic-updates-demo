import React, { createContext, useMemo } from "react";
import { useAPI, useObjectPool } from "../hooks";
import { DataLoader } from "../loader";

const dataLoaderContext = createContext<DataLoader | null>(null);

type DataLoaderProviderProps = React.PropsWithChildren;
const DataLoaderProvider: React.FC<DataLoaderProviderProps> = ({ ...props }) => {
  const api = useAPI();
  const pool = useObjectPool();
  const _dataLoader = useMemo(() => new DataLoader(api, pool), [api, pool]);
  return <dataLoaderContext.Provider {...props} value={_dataLoader} />;
};

export { DataLoaderProvider, dataLoaderContext }; // eslint-disable-line react-refresh/only-export-components
export type { DataLoaderProviderProps };

import React, { createContext, useMemo } from "react";
import { ObjectPool } from "../models";

const objectPoolContext = createContext(new ObjectPool());

type ObjectPoolProviderProps = React.PropsWithChildren<{
  objectPool?: ObjectPool;
}>;
const ObjectPoolProvider: React.FC<ObjectPoolProviderProps> = ({ objectPool, ...props }) => {
  const _objectPool = useMemo(() => objectPool ?? new ObjectPool(), [objectPool]);
  return <objectPoolContext.Provider {...props} value={_objectPool} />;
};

export { ObjectPoolProvider, objectPoolContext }; // eslint-disable-line react-refresh/only-export-components
export type { ObjectPoolProviderProps };

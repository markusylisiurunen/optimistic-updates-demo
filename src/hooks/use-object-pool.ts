import { useContext } from "react";
import { objectPoolContext } from "../contexts";

function useObjectPool() {
  return useContext(objectPoolContext);
}

export { useObjectPool };

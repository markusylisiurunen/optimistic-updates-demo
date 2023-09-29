import { useContext } from "react";
import { locksContext } from "../contexts";

function useLocks() {
  return useContext(locksContext);
}

export { useLocks };

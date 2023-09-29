import { useContext } from "react";
import { apiContext } from "../contexts";

function useAPI() {
  return useContext(apiContext);
}

export { useAPI };

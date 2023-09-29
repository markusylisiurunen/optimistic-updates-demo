import { createContext } from "react";
import { makeAPI } from "../api";

const apiContext = createContext(makeAPI());

export { apiContext };

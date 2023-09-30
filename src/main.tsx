import "@radix-ui/themes/styles.css";

import { Theme } from "@radix-ui/themes";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { DataLoaderProvider, ObjectPoolProvider } from "./contexts";
import { ObjectPool } from "./models";

const objectPool = new ObjectPool();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
      <ObjectPoolProvider objectPool={objectPool}>
        <DataLoaderProvider>
          <App />
        </DataLoaderProvider>
      </ObjectPoolProvider>
    </Theme>
  </React.StrictMode>,
);

import React from "react";
import App from "./App";
import "./styles/layout/base.scss";
import { createRoot } from "react-dom/client";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

//TODO implement caching
serviceWorkerRegistration.unregister();

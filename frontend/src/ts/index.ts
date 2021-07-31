import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";

export function main() {
  const el = document.querySelector("#root")!;
  ReactDOM.render(React.createElement(App), el);
}

main();

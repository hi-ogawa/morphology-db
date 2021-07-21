//
// Type-safe DSL for defining route via
//   draw(<method>, <path>, <ControllerClass>, <action>)
//

import { Router, Request, Response } from "express";

export type Method = "get" | "post" | "patch" | "delete";

export type ControllerClass<Controller> = new (
  req: Request,
  res: Response
) => Controller;

// cf. https://github.com/microsoft/TypeScript/pull/21316
export type ActionName<Controller> = {
  [K in keyof Controller]: Controller[K] extends () => Promise<void>
    ? K
    : never;
}[keyof Controller];

function _draw<Controller>(
  router: Router,
  method: Method,
  path: string,
  klass: ControllerClass<Controller>,
  actionName: ActionName<Controller>
) {
  router[method](path, async (req, res, next) => {
    try {
      // NOTE: this type casting is safe since `ActionName<Controller>` ensures
      //       the type of the argument at the caller site of `draw`
      const controller = new klass(req, res);
      await (controller[actionName] as unknown as () => Promise<void>)();
    } catch (e) {
      next(e);
    }
  });
}

export const routes = Router();

export function draw<Controller>(
  method: Method,
  path: string,
  klass: ControllerClass<Controller>,
  actionName: ActionName<Controller>
) {
  _draw<Controller>(routes, method, path, klass, actionName);
}

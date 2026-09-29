import { Request, Response } from "express";
import { userService } from "./user.service";

// HTTP IN, HTTP OUT. Read the request, call the service, send the result.
export const userController = {
  async register(req: Request, res: Response) {
    const user = await userService.register(req.body?.email, req.body?.name);
    res.status(201).json(user);
  },

  async login(req: Request, res: Response) {
    res.json(await userService.login(req.body?.email));
  },

  async me(req: Request, res: Response) {
    res.json(await userService.getUser(res.locals.userId));
  },
};

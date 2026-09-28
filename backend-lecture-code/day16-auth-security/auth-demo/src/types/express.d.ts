import { User } from "../server";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

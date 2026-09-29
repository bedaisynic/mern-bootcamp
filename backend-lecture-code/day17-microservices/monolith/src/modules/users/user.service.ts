import jwt from "jsonwebtoken";
import { Db } from "../../db";
import { JWT_SECRET } from "../../middleware/auth";
import { HttpError } from "../../shared/errors";
import { User } from "../../shared/types";
import { userRepository } from "./user.repository";

// The users module's public API. Other modules call these functions directly.
export const userService = {
  async getUser(id: number, db?: Db): Promise<User> {
    const user = await userRepository.findById(id, db);
    if (!user) throw new HttpError(404, `user ${id} not found`);
    return user;
  },

  async register(email: unknown, name: unknown): Promise<User> {
    if (typeof email !== "string" || typeof name !== "string" || !email || !name) {
      throw new HttpError(400, "email and name are required");
    }
    return userRepository.create(email, name);
  },

  // Demo login: an email is enough. A real login checks a hashed password.
  async login(email: unknown): Promise<{ token: string; user: User }> {
    const user = typeof email === "string" ? await userRepository.findByEmail(email) : null;
    if (!user) throw new HttpError(401, "unknown email");
    const token = jwt.sign({ sub: String(user.id) }, JWT_SECRET, { expiresIn: "1h" });
    return { token, user };
  },
};

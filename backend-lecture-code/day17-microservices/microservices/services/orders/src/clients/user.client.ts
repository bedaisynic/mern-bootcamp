import { callService, Ctx } from "./http";

export type User = { id: number; email: string; name: string };

// Monolith: userService.getUser(id, tx), a function call.
// Here: an HTTP request to the users service.
export const userClient = {
  getUser: (ctx: Ctx, id: number) => callService<User>(ctx, "users", `/internal/users/${id}`),
};

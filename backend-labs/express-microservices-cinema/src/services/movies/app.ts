// REFERENCE — fully implemented. Builds this service's Express app with fresh
// seed data. server.ts runs it on a port; the tests start it on a random one.

import { createServiceApp } from "../../lib/service-app";
import { movieRepository } from "./movie.repository";
import { showtimeRoutes } from "./movie.routes";

export function createMoviesApp() {
  movieRepository.reset();
  return createServiceApp("movies", (app) => {
    app.use("/showtimes", showtimeRoutes);
  });
}

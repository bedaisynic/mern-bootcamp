// REFERENCE — fully implemented. Business rules only: decide what the facts
// from the repository mean, and throw an HttpError when the answer is "no".

import { HttpError } from "../../lib/http-error";
import { movieRepository, Showtime } from "./movie.repository";

export const movieService = {
  async listShowtimes(): Promise<Showtime[]> {
    return movieRepository.findAll();
  },

  async getShowtime(id: number): Promise<Showtime> {
    const showtime = movieRepository.findById(id);
    if (!showtime) throw new HttpError(404, `showtime ${id} not found`);
    return showtime;
  },
};

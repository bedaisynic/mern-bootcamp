// given — throw one of these from any service layer and the error handler in
// service-app.ts turns it into `{ "error": message }` with the right status.
// `service` is set when the error came from a DIFFERENT service we called.

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public service?: string
  ) {
    super(message);
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  statusCode = 400;
  
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends Error {
  statusCode = 409;

  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class NotImplementedError extends Error {
  statusCode = 501;

  constructor(message: string = 'Not implemented') {
    super(message);
    this.name = 'NotImplementedError';
  }
}

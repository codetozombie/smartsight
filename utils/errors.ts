export class ModelError extends Error {
  public readonly code: string;
  
  constructor(message: string, code: string = 'MODEL_ERROR') {
    super(message);
    this.name = 'ModelError';
    this.code = code;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ModelError);
    }
  }
}

export class ValidationError extends Error {
  public readonly field: string;
  
  constructor(message: string, field: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}
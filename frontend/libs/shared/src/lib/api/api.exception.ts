// Custom API Exception Class (SPEC_CORE_FE)

export class ApiException extends Error {
  public code: string;
  public status?: number;
  public details?: any;

  constructor(message: string, code = 'INTERNAL_ERROR', status?: number, details?: any) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.status = status;
    this.details = details;
    
    // Maintain proper stack trace in V8 engines
    const err = Error as any;
    if (typeof err.captureStackTrace === 'function') {
      err.captureStackTrace(this, ApiException);
    }
  }
}

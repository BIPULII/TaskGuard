import csrf from 'csurf';
import { Request, Response, NextFunction } from 'express';

// Configure CSRF protection - uses tokens in cookies
// The token is generated and sent to frontend, then must be included in request headers
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

// Middleware to generate and provide CSRF token
export const csrfTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

// Middleware to handle CSRF errors gracefully
export const csrfErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // CSRF token errors
    res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'CSRF token validation failed. Please refresh and try again.',
    });
  } else {
    next(err);
  }
};

export default csrfProtection;

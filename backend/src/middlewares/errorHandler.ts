import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details
    });
  }

  if (err.code === 'P2002') { // Prisma unique constraint error
    return res.status(409).json({
      error: 'Resource already exists',
      details: 'A record with this data already exists'
    });
  }

  if (err.code === 'P2025') { // Prisma record not found error
    return res.status(404).json({
      error: 'Resource not found'
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
};

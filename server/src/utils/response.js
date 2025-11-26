// Standardized API response helpers

export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, message, code = 'SRV_001', statusCode = 500) => {
  res.status(statusCode).json({
    success: false,
    code,
    message,
  });
};

export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

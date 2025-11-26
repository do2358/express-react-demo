// Pagination helper function

export const getPagination = (page = 1, limit = 20) => {
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const skip = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
};

export const getPaginationInfo = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

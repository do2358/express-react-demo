import api from './api';

export const productService = {
  // Get all products (public)
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get single product
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Search products
  search: async (keyword, params = {}) => {
    const response = await api.get('/products/search', {
      params: { keyword, ...params },
    });
    return response.data;
  },

  // Get products by category
  getByCategory: async (category, params = {}) => {
    const response = await api.get(`/products/category/${category}`, { params });
    return response.data;
  },
};

export default productService;

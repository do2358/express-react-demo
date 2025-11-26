import api from './api';

export const productService = {
  // Get all products (admin)
  getAll: async (params = {}) => {
    const response = await api.get('/products/admin/all', { params });
    return response.data;
  },

  // Get single product
  getById: async (id) => {
    const response = await api.get(`/products/admin/${id}`);
    return response.data;
  },

  // Create product
  create: async (productData) => {
    const response = await api.post('/products/admin', productData);
    return response.data;
  },

  // Update product
  update: async (id, productData) => {
    const response = await api.put(`/products/admin/${id}`, productData);
    return response.data;
  },

  // Delete product
  delete: async (id) => {
    const response = await api.delete(`/products/admin/${id}`);
    return response.data;
  },
};

export default productService;

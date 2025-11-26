import api from './api';

export const inventoryService = {
  // Get all inventory
  getAll: async (params = {}) => {
    const response = await api.get('/admin/inventory', { params });
    return response.data;
  },

  // Get single inventory
  getById: async (id) => {
    const response = await api.get(`/admin/inventory/${id}`);
    return response.data;
  },

  // Get inventory by product
  getByProduct: async (productId) => {
    const response = await api.get(`/admin/inventory/product/${productId}`);
    return response.data;
  },

  // Create inventory
  create: async (inventoryData) => {
    const response = await api.post('/admin/inventory', inventoryData);
    return response.data;
  },

  // Update inventory
  update: async (id, inventoryData) => {
    const response = await api.put(`/admin/inventory/${id}`, inventoryData);
    return response.data;
  },

  // Adjust stock
  adjustStock: async (adjustmentData) => {
    const response = await api.put('/admin/inventory/adjust', adjustmentData);
    return response.data;
  },

  // Delete inventory
  delete: async (id) => {
    const response = await api.delete(`/admin/inventory/${id}`);
    return response.data;
  },
};

export default inventoryService;

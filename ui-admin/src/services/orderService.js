import api from './api';

export const orderService = {
  // Get all orders (admin)
  getAll: async (params = {}) => {
    const response = await api.get('/orders/admin/all', { params });
    return response.data;
  },

  // Get single order
  getById: async (id) => {
    const response = await api.get(`/orders/admin/${id}`);
    return response.data;
  },

  // Update order status
  updateStatus: async (id, status, note = '') => {
    const response = await api.put(`/orders/admin/${id}/status`, { status, note });
    return response.data;
  },
};

export default orderService;

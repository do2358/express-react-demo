# Complete Admin E-Commerce Dashboard Tutorial: Build From Scratch

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Project Setup](#2-project-setup)
3. [Building the Foundation](#3-building-the-foundation)
4. [Feature 1: Authentication](#4-feature-1-authentication)
5. [Feature 2: Products Management](#5-feature-2-products-management)
6. [Feature 3: Inventory Management](#6-feature-3-inventory-management)
7. [Feature 4: Orders Management](#7-feature-4-orders-management)
8. [Feature 5: Dashboard](#8-feature-5-dashboard)
9. [Best Practices](#9-best-practices)

---

## 1. System Overview

### What We're Building
An admin dashboard for e-commerce management with:
- Admin authentication
- Product CRUD operations
- Inventory management
- Order management (view, update status)
- Professional UI with Ant Design

### Architecture
```
ui-admin/
├── src/
│   ├── components/
│   │   ├── AdminLayout.jsx    # Main layout with sidebar
│   │   └── ProtectedRoute.jsx # Auth guard
│   ├── contexts/
│   │   └── AuthContext.jsx    # Auth state
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ProductsPage.jsx   # CRUD table
│   │   ├── InventoryPage.jsx  # CRUD table
│   │   └── OrdersPage.jsx     # View & update status
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── inventoryService.js
│   │   └── orderService.js
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

**Key Differences from Customer UI:**
- Uses Ant Design instead of Tailwind
- CRUD operations with modals/forms
- Table-based data display
- Status management workflows

---

## 2. Project Setup

### Step 1: Create Vite Project
```bash
npm create vite@latest ecommerce-admin -- --template react
cd ecommerce-admin
```

### Step 2: Install Dependencies
```bash
# Core
npm install react-router-dom axios

# Ant Design
npm install antd
```

### Step 3: Environment Setup

Create `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### Step 4: package.json
```json
{
  "name": "ecommerce-admin",
  "dependencies": {
    "antd": "^6.0.0",
    "axios": "^1.13.2",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.9.6"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.1.1",
    "vite": "^7.2.4"
  }
}
```

---

## 3. Building the Foundation

### Step 1: API Client

Create `src/services/api.js`:
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Step 2: Services

Create `src/services/productService.js`:
```javascript
import api from './api';

export const productService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/admin/products', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/admin/products/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },
};
```

Create similar services for `inventoryService.js` and `orderService.js`.

---

## 4. Feature 1: Authentication

### Auth Context

Create `src/contexts/AuthContext.jsx`:
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Verify user is admin
        if (parsedUser.role === 'admin') {
          setUser(parsedUser);
        } else {
          localStorage.clear();
        }
      } catch (error) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);

    // Verify admin role
    if (response.data.user.role !== 'admin') {
      throw new Error('Access denied. Admin role required.');
    }

    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

### Login Page

Create `src/pages/LoginPage.jsx`:
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Login successful');
      navigate('/admin');
    } catch (error) {
      message.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card title="Admin Login" style={{ width: 400 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
```

---

## 5. Feature 2: Products Management

### Products Page with CRUD

Create `src/pages/ProductsPage.jsx`:
```jsx
import { useState, useEffect } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, InputNumber,
  Select, message, Popconfirm, Tag
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { productService } from '../services/productService';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data.data || []);
    } catch (error) {
      message.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      tags: product.tags?.join(', ') || '',
      images: product.images?.join(', ') || '',
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await productService.delete(id);
      message.success('Product deleted');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const productData = {
        ...values,
        tags: values.tags ? values.tags.split(',').map(t => t.trim()) : [],
        images: values.images ? values.images.split(',').map(i => i.trim()) : [],
      };

      if (editingProduct) {
        await productService.update(editingProduct._id, productData);
        message.success('Product updated');
      } else {
        await productService.create(productData);
        message.success('Product created');
      }

      setModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price?.toFixed(2)}`,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : status === 'inactive' ? 'red' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Delete product?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="comparePrice" label="Compare Price">
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Electronics">Electronics</Select.Option>
              <Select.Option value="Clothing">Clothing</Select.Option>
              <Select.Option value="Books">Books</Select.Option>
              <Select.Option value="Home">Home</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="draft">Draft</Select.Option>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Tags (comma-separated)">
            <Input placeholder="electronics, gadget, sale" />
          </Form.Item>

          <Form.Item name="images" label="Images (comma-separated URLs)">
            <Input.TextArea rows={2} placeholder="https://..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingProduct ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
```

**Key Ant Design patterns:**
- `Table` component for data display
- `Modal` for forms
- `Form` with validation
- `message` for notifications
- `Popconfirm` for delete confirmation

---

## 6. Feature 3: Inventory Management

Create `src/pages/InventoryPage.jsx` following the same CRUD pattern:

```jsx
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, InputNumber, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { inventoryService } from '../services/inventoryService';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAll();
      setInventory(data.data.inventory || []);
    } catch (error) {
      message.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      await inventoryService.create(values);
      message.success('Inventory created');
      setModalVisible(false);
      form.resetFields();
      fetchInventory();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create inventory');
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: ['product', 'name'],
      key: 'product',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Reserved',
      dataIndex: 'reservedQuantity',
      key: 'reservedQuantity',
    },
    {
      title: 'Available',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
      render: (qty) => <Tag color={qty > 10 ? 'green' : 'red'}>{qty}</Tag>,
    },
    {
      title: 'Low Stock',
      dataIndex: 'isLowStock',
      key: 'isLowStock',
      render: (isLow) => (
        <Tag color={isLow ? 'red' : 'green'}>
          {isLow ? 'Low' : 'OK'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Add Inventory
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={inventory}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title="Create Inventory"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="product"
            label="Product ID"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter product ID" />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="lowStockThreshold" label="Low Stock Threshold">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="warehouse" label="Warehouse">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
```

---

## 7. Feature 4: Orders Management

Create `src/pages/OrdersPage.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { Table, Tag, Select, message } from 'antd';
import { orderService } from '../services/orderService';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data.data || []);
    } catch (error) {
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      message.success('Status updated');
      fetchOrders();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      processing: 'purple',
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Customer',
      dataIndex: ['user', 'name'],
      key: 'customer',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => items?.length || 0,
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'total',
      render: (amount) => `$${amount?.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record._id, value)}
        >
          <Select.Option value="pending">
            <Tag color={getStatusColor('pending')}>Pending</Tag>
          </Select.Option>
          <Select.Option value="confirmed">
            <Tag color={getStatusColor('confirmed')}>Confirmed</Tag>
          </Select.Option>
          <Select.Option value="processing">
            <Tag color={getStatusColor('processing')}>Processing</Tag>
          </Select.Option>
          <Select.Option value="shipped">
            <Tag color={getStatusColor('shipped')}>Shipped</Tag>
          </Select.Option>
          <Select.Option value="delivered">
            <Tag color={getStatusColor('delivered')}>Delivered</Tag>
          </Select.Option>
          <Select.Option value="cancelled">
            <Tag color={getStatusColor('cancelled')}>Cancelled</Tag>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="_id"
      loading={loading}
    />
  );
};

export default OrdersPage;
```

---

## 8. Feature 5: Dashboard

Create `src/pages/DashboardPage.jsx`:
```jsx
import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    // Fetch stats from API
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    // Implementation depends on your backend API
    // For now, mock data
    setStats({
      totalOrders: 150,
      totalRevenue: 25430.50,
      totalProducts: 45,
      totalCustomers: 320,
    });
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
```

### Admin Layout

Create `src/components/AdminLayout.jsx`:
```jsx
import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/products">Products</Link>,
    },
    {
      key: '/inventory',
      icon: <InboxOutlined />,
      label: <Link to="/admin/inventory">Inventory</Link>,
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/orders">Orders</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, color: 'white', textAlign: 'center', fontSize: 18 }}>
          {collapsed ? 'Admin' : 'Admin Dashboard'}
        </div>
        <Menu theme="dark" mode="inline" items={menuItems} />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Welcome, {user?.name}</div>
          <a onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <LogoutOutlined /> Logout
          </a>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
```

### Final App.jsx

Create `src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="orders" element={<OrdersPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
```

---

## 9. Best Practices

### Ant Design Tips
- Use `message` for notifications
- Use `Modal` for forms
- Use `Table` pagination for large datasets
- Use `Form` validation rules
- Theme customization with `ConfigProvider`

### Code Quality
- ✅ Separate services layer
- ✅ Global auth context
- ✅ Protected routes
- ✅ Error handling
- ✅ Loading states
- ✅ Confirmation dialogs for destructive actions

### Security
- ✅ Admin role verification in AuthContext
- ✅ Token auto-logout on 401
- ✅ Form validation

### Deployment
```bash
npm run build
# Deploy dist/ folder to hosting
```

---

## Conclusion

You've built a complete admin dashboard with:

✅ **Authentication** - Admin-only access
✅ **Products** - Full CRUD with modals
✅ **Inventory** - Stock management
✅ **Orders** - View and status updates
✅ **Dashboard** - Statistics overview
✅ **Ant Design** - Professional UI

**Happy building!** 🚀

---

*This tutorial is based on the reference implementation in `ui-admin/`. For customer interface, see `ui/REBUILD_UI.md`.*

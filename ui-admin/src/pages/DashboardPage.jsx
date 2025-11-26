import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Typography, Spin } from 'antd';
import {
    ShoppingOutlined,
    InboxOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import { orderService } from '../services/orderService';

const { Title } = Typography;

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStockItems: 0,
        pendingOrders: 0,
        totalRevenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch products
            const productsData = await productService.getAll({ limit: 1000 });
            const totalProducts = productsData.data?.length || 0;

            // Fetch inventory
            const inventoryData = await inventoryService.getAll({ limit: 1000 });
            const lowStockItems = inventoryData.data?.filter(item =>
                item.quantity <= item.lowStockThreshold
            ).length || 0;

            // Fetch orders
            const ordersData = await orderService.getAll({ limit: 10, sort: '-createdAt' });
            const pendingOrders = ordersData.data?.filter(order =>
                order.status === 'pending'
            ).length || 0;

            // Calculate total revenue (from delivered orders)
            const allOrdersData = await orderService.getAll({ limit: 1000 });
            const totalRevenue = allOrdersData.data
                ?.filter(order => order.status === 'delivered')
                .reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0;

            setStats({
                totalProducts,
                lowStockItems,
                pendingOrders,
                totalRevenue,
            });

            setRecentOrders(ordersData.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const orderColumns = [
        {
            title: 'Order Number',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
        },
        {
            title: 'Customer',
            dataIndex: ['user', 'name'],
            key: 'customer',
            render: (text, record) => text || record.user?.email || 'N/A',
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => `$${amount?.toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    pending: 'orange',
                    confirmed: 'blue',
                    processing: 'cyan',
                    shipped: 'purple',
                    delivered: 'green',
                    cancelled: 'red',
                };
                return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <Title level={2}>Dashboard</Title>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Products"
                            value={stats.totalProducts}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Low Stock Items"
                            value={stats.lowStockItems}
                            prefix={<InboxOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Pending Orders"
                            value={stats.pendingOrders}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Revenue"
                            value={stats.totalRevenue}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Recent Orders" style={{ marginTop: 24 }}>
                <Table
                    columns={orderColumns}
                    dataSource={recentOrders}
                    rowKey="_id"
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default DashboardPage;

import { useState, useEffect } from 'react';
import {
    Table,
    Tag,
    Button,
    Space,
    Drawer,
    Descriptions,
    Select,
    message,
    Typography,
    Card,
    Timeline,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { orderService } from '../services/orderService';

const { Title, Text } = Typography;

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderService.getAll({ sort: '-createdAt' });
            setOrders(data.data || []);
        } catch (error) {
            message.error('Failed to fetch orders');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = async (order) => {
        try {
            const data = await orderService.getById(order._id);
            setSelectedOrder(data.data);
            setDrawerVisible(true);
        } catch (error) {
            message.error('Failed to load order details');
            console.error(error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedOrder) return;

        try {
            setUpdatingStatus(true);
            await orderService.updateStatus(selectedOrder._id, newStatus);
            message.success('Order status updated successfully');

            // Update local state
            setSelectedOrder({ ...selectedOrder, status: newStatus });
            fetchOrders();
        } catch (error) {
            message.error('Failed to update order status');
            console.error(error);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'orange',
            confirmed: 'blue',
            processing: 'cyan',
            shipped: 'purple',
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
            fixed: 'left',
        },
        {
            title: 'Customer',
            dataIndex: ['user', 'name'],
            key: 'customer',
            render: (text, record) => text || record.user?.email || 'N/A',
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
            render: (items) => items?.length || 0,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => `$${amount?.toFixed(2)}`,
        },
        {
            title: 'Payment',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (method) => method?.toUpperCase() || 'N/A',
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (status) => (
                <Tag color={status === 'paid' ? 'green' : 'orange'}>
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            fixed: 'right',
            render: (_, record) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewOrder(record)}
                    size="small"
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Title level={2}>Orders</Title>

            <Table
                columns={columns}
                dataSource={orders}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
            />

            <Drawer
                title={`Order Details - ${selectedOrder?.orderNumber}`}
                width={720}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
            >
                {selectedOrder && (
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* Order Status Update */}
                        <Card title="Update Status" size="small">
                            <Space>
                                <Text>Current Status:</Text>
                                <Tag color={getStatusColor(selectedOrder.status)}>
                                    {selectedOrder.status?.toUpperCase()}
                                </Tag>
                            </Space>
                            <div style={{ marginTop: 16 }}>
                                <Select
                                    style={{ width: 200 }}
                                    placeholder="Change status"
                                    onChange={handleStatusChange}
                                    loading={updatingStatus}
                                    value={selectedOrder.status}
                                >
                                    <Select.Option value="pending">Pending</Select.Option>
                                    <Select.Option value="confirmed">Confirmed</Select.Option>
                                    <Select.Option value="processing">Processing</Select.Option>
                                    <Select.Option value="shipped">Shipped</Select.Option>
                                    <Select.Option value="delivered">Delivered</Select.Option>
                                    <Select.Option value="cancelled">Cancelled</Select.Option>
                                </Select>
                            </div>
                        </Card>

                        {/* Customer Information */}
                        <Card title="Customer Information" size="small">
                            <Descriptions column={1}>
                                <Descriptions.Item label="Name">
                                    {selectedOrder.user?.name || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    {selectedOrder.user?.email || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone">
                                    {selectedOrder.shippingAddress?.phone || 'N/A'}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Shipping Address */}
                        <Card title="Shipping Address" size="small">
                            <Descriptions column={1}>
                                <Descriptions.Item label="Full Name">
                                    {selectedOrder.shippingAddress?.fullName}
                                </Descriptions.Item>
                                <Descriptions.Item label="Address">
                                    {selectedOrder.shippingAddress?.address}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ward">
                                    {selectedOrder.shippingAddress?.ward}
                                </Descriptions.Item>
                                <Descriptions.Item label="District">
                                    {selectedOrder.shippingAddress?.district}
                                </Descriptions.Item>
                                <Descriptions.Item label="City">
                                    {selectedOrder.shippingAddress?.city}
                                </Descriptions.Item>
                                {selectedOrder.shippingAddress?.notes && (
                                    <Descriptions.Item label="Notes">
                                        {selectedOrder.shippingAddress.notes}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Card>

                        {/* Order Items */}
                        <Card title="Order Items" size="small">
                            <Table
                                dataSource={selectedOrder.items}
                                pagination={false}
                                size="small"
                                rowKey={(record, index) => index}
                                columns={[
                                    {
                                        title: 'Product',
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
                                        title: 'Quantity',
                                        dataIndex: 'quantity',
                                        key: 'quantity',
                                    },
                                    {
                                        title: 'Subtotal',
                                        dataIndex: 'subtotal',
                                        key: 'subtotal',
                                        render: (subtotal) => `$${subtotal?.toFixed(2)}`,
                                    },
                                ]}
                            />
                        </Card>

                        {/* Order Summary */}
                        <Card title="Order Summary" size="small">
                            <Descriptions column={1}>
                                <Descriptions.Item label="Subtotal">
                                    ${selectedOrder.subtotal?.toFixed(2)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Shipping Fee">
                                    ${selectedOrder.shippingFee?.toFixed(2)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Discount">
                                    ${selectedOrder.discount?.toFixed(2)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Total">
                                    <Text strong style={{ fontSize: '16px' }}>
                                        ${selectedOrder.totalAmount?.toFixed(2)}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Payment Method">
                                    {selectedOrder.paymentMethod?.toUpperCase()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Payment Status">
                                    <Tag color={selectedOrder.paymentStatus === 'paid' ? 'green' : 'orange'}>
                                        {selectedOrder.paymentStatus?.toUpperCase()}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Status History */}
                        {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                            <Card title="Status History" size="small">
                                <Timeline
                                    items={selectedOrder.statusHistory.map((history) => ({
                                        color: getStatusColor(history.status),
                                        children: (
                                            <div>
                                                <div>
                                                    <Tag color={getStatusColor(history.status)}>
                                                        {history.status?.toUpperCase()}
                                                    </Tag>
                                                </div>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {new Date(history.changedAt).toLocaleString()}
                                                </Text>
                                                {history.note && (
                                                    <div style={{ marginTop: 4 }}>
                                                        <Text>{history.note}</Text>
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    }))}
                                />
                            </Card>
                        )}
                    </Space>
                )}
            </Drawer>
        </div>
    );
};

export default OrdersPage;

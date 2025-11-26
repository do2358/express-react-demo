import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    InputNumber,
    Select,
    message,
    Popconfirm,
    Tag,
    Typography,
    Badge,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { inventoryService } from '../services/inventoryService';
import { productService } from '../services/productService';

const { Title } = Typography;

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchInventory();
        fetchProducts();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const data = await inventoryService.getAll();
            setInventory(data.data || []);
        } catch (error) {
            message.error('Failed to fetch inventory');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data.data || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        form.setFieldsValue({
            product: item.product._id || item.product,
            quantity: item.quantity,
            lowStockThreshold: item.lowStockThreshold,
            warehouse: item.warehouse,
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await inventoryService.delete(id);
            message.success('Inventory deleted successfully');
            fetchInventory();
        } catch (error) {
            message.error('Failed to delete inventory');
            console.error(error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingItem) {
                await inventoryService.update(editingItem._id, values);
                message.success('Inventory updated successfully');
            } else {
                await inventoryService.create(values);
                message.success('Inventory created successfully');
            }

            setModalVisible(false);
            form.resetFields();
            fetchInventory();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to save inventory');
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'Product',
            dataIndex: ['product', 'name'],
            key: 'product',
            render: (text, record) => text || record.product?.name || 'N/A',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, record) => {
                const isLowStock = quantity <= record.lowStockThreshold;
                return (
                    <Space>
                        {isLowStock && (
                            <Badge status="error" />
                        )}
                        <span style={{ color: isLowStock ? '#ff4d4f' : 'inherit' }}>
                            {quantity}
                        </span>
                    </Space>
                );
            },
        },
        {
            title: 'Reserved',
            dataIndex: 'reservedQuantity',
            key: 'reservedQuantity',
            render: (qty) => qty || 0,
        },
        {
            title: 'Available',
            key: 'available',
            render: (_, record) => record.quantity - (record.reservedQuantity || 0),
        },
        {
            title: 'Low Stock Threshold',
            dataIndex: 'lowStockThreshold',
            key: 'lowStockThreshold',
        },
        {
            title: 'Warehouse',
            dataIndex: 'warehouse',
            key: 'warehouse',
            render: (warehouse) => warehouse || 'Main',
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                if (record.quantity <= record.lowStockThreshold) {
                    return <Tag icon={<WarningOutlined />} color="error">Low Stock</Tag>;
                }
                return <Tag color="success">In Stock</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete inventory?"
                        description="Are you sure you want to delete this inventory record?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Title level={2}>Inventory</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                >
                    Add Inventory
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={inventory}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingItem ? 'Edit Inventory' : 'Create Inventory'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="product"
                        label="Product"
                        rules={[{ required: true, message: 'Please select a product' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a product"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={products.map(product => ({
                                value: product._id,
                                label: product.name,
                            }))}
                            disabled={!!editingItem}
                        />
                    </Form.Item>

                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true, message: 'Please enter quantity' }]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="0"
                        />
                    </Form.Item>

                    <Form.Item
                        name="lowStockThreshold"
                        label="Low Stock Threshold"
                        initialValue={10}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="10"
                        />
                    </Form.Item>

                    <Form.Item
                        name="warehouse"
                        label="Warehouse"
                    >
                        <Select placeholder="Select warehouse">
                            <Select.Option value="Main">Main Warehouse</Select.Option>
                            <Select.Option value="Secondary">Secondary Warehouse</Select.Option>
                            <Select.Option value="Store">Store</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default InventoryPage;

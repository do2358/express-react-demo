import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    message,
    Popconfirm,
    Tag,
    Typography,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { productService } from '../services/productService';

const { Title } = Typography;
const { TextArea } = Input;

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
            console.error(error);
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
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await productService.delete(id);
            message.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            message.error('Failed to delete product');
            console.error(error);
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
                message.success('Product updated successfully');
            } else {
                await productService.create(productData);
                message.success('Product created successfully');
            }

            setModalVisible(false);
            form.resetFields();
            fetchProducts();
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to save product');
            console.error(error);
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
            render: (status) => {
                const colors = {
                    active: 'green',
                    inactive: 'red',
                    draft: 'orange',
                };
                return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
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
                        title="Delete product?"
                        description="Are you sure you want to delete this product?"
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
                <Title level={2}>Products</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                >
                    Add Product
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={products}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingProduct ? 'Edit Product' : 'Create Product'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Product Name"
                        rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                        <Input placeholder="Enter product name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <TextArea rows={3} placeholder="Enter product description" />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, message: 'Please enter price' }]}
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="0.00"
                            precision={2}
                        />
                    </Form.Item>

                    <Form.Item
                        name="comparePrice"
                        label="Compare Price (Original Price)"
                    >
                        <InputNumber
                            min={0}
                            style={{ width: '100%' }}
                            placeholder="0.00"
                            precision={2}
                        />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please enter category' }]}
                    >
                        <Input placeholder="e.g., Electronics, Clothing" />
                    </Form.Item>

                    <Form.Item
                        name="tags"
                        label="Tags (comma-separated)"
                    >
                        <Input placeholder="e.g., new, bestseller, featured" />
                    </Form.Item>

                    <Form.Item
                        name="images"
                        label="Image URLs (comma-separated)"
                    >
                        <TextArea
                            rows={2}
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select status' }]}
                        initialValue="draft"
                    >
                        <Select>
                            <Select.Option value="draft">Draft</Select.Option>
                            <Select.Option value="active">Active</Select.Option>
                            <Select.Option value="inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductsPage;

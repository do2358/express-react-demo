import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const data = await productService.getById(id);
            setProduct(data.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            alert('Product not found');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert('Please login to add items to cart');
            navigate('/login');
            return;
        }

        try {
            await addToCart(product._id, quantity);
            alert('Product added to cart!');
            navigate('/cart');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    const hasDiscount = product.comparePrice && product.comparePrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                        {product.images && product.images[0] ? (
                            <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <svg
                                    className="w-32 h-32"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    {product.category && (
                        <span className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                            {product.category}
                        </span>
                    )}

                    <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-gray-900">
                            ${product.price?.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <>
                                <span className="text-2xl text-gray-400 line-through">
                                    ${product.comparePrice?.toFixed(2)}
                                </span>
                                <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                                    Save {discountPercentage}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div>
                            <h2 className="text-xl font-bold mb-2">Description</h2>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>
                    )}

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {product.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Quantity & Add to Cart */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="font-medium text-gray-700">Quantity:</label>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-4 py-2 hover:bg-gray-100 transition"
                                >
                                    -
                                </button>
                                <span className="px-6 py-2 border-x border-gray-300">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-4 py-2 hover:bg-gray-100 transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

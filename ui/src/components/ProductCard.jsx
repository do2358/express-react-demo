import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
    const hasDiscount = product.comparePrice && product.comparePrice > product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
        : 0;

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden group">
            {/* Image */}
            <Link to={`/products/${product._id}`} className="block relative overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    {product.images && product.images[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <svg
                                className="w-24 h-24"
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
                    {hasDiscount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                            -{discountPercentage}%
                        </div>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-4">
                {/* Category */}
                {product.category && (
                    <p className="text-sm text-purple-600 font-medium mb-1">
                        {product.category}
                    </p>
                )}

                {/* Title */}
                <Link to={`/products/${product._id}`}>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-purple-600 transition">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                        ${product.price?.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                            ${product.comparePrice?.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Link
                        to={`/products/${product._id}`}
                        className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 transition text-center font-medium"
                    >
                        View
                    </Link>
                    {onAddToCart && (
                        <button
                            onClick={() => onAddToCart(product)}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition font-medium"
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

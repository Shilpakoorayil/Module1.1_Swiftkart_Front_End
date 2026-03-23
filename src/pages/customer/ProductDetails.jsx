import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, ArrowLeft, Package, CheckCircle, XCircle } from 'lucide-react';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loadingProducts } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!loadingProducts) {
      const found = products.find(p => p.id === parseInt(id));
      if (found) {
        setProduct(found);
      } else {
        // Product not found
        setProduct(null);
      }
    }
  }, [id, products, loadingProducts]);

  const handleAddToCart = () => {
    if (!product) return;
    if (user?.role === 'guest') {
      alert("Please login to add items to your cart.");
      navigate('/login', { state: { productToAdd: product } });
    } else {
      addToCart(product);
      navigate('/cart');
    }
  };

  if (loadingProducts) {
    return <div className={styles.loadingContainer}>Loading product details...</div>;
  }

  if (!product && !loadingProducts) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Product not found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/')} className={styles.backBtn}>
          <ArrowLeft size={18} /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className={styles.detailsContainer}>
      <button onClick={() => navigate(-1)} className={styles.backLink}>
        <ArrowLeft size={16} /> Back
      </button>
      
      <div className={styles.productCard}>
        <div className={styles.imageSection}>
          <img 
            src={product.image || import.meta.env.VITE_PLACEHOLDER_IMAGE_URL} 
            alt={product.name} 
            className={styles.productImage} 
          />
        </div>
        
        <div className={styles.infoSection}>
          <div className={styles.categoryBadge}>{product.category}</div>
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.priceRow}>
            <span className={styles.price}>₹{product.price}</span>
            <span className={styles.taxInfo}>(Inclusive of all taxes)</span>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.descriptionSection}>
            <h3>Description</h3>
            <p className={styles.descriptionText}>
              {product.description || "No description available for this product."}
            </p>
          </div>

          <div className={styles.metadataSection}>
            <div className={styles.stockInfo}>
              {product.stock > 0 ? (
                <>
                  <CheckCircle size={18} className={styles.inStockIcon} />
                  <span className={styles.inStockText}>In Stock ({product.stock} available)</span>
                </>
              ) : (
                <>
                  <XCircle size={18} className={styles.outOfStockIcon} />
                  <span className={styles.outOfStockText}>Out of Stock</span>
                </>
              )}
            </div>
            <div className={styles.shippingInfo}>
              <Package size={18} className={styles.shippingIcon} />
              <span>Ships instantly within 10 minutes</span>
            </div>
          </div>

          <div className={styles.actionSection}>
            <button 
              className={styles.addToCartBtn} 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={20} />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            {product.stock > 0 && (
              <button 
                className={styles.buyNowBtn}
                onClick={() => {
                   // Optional: Can add logic for immediate buy now
                   handleAddToCart();
                }}
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

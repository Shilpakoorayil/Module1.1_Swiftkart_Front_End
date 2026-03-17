import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../../context/LocationContext';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Home.module.css';
import { ShoppingCart } from 'lucide-react';

const Home = () => {
  const { nearestStore, requestLocation, locationError, isLoading } = useLocation();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically prompt location on Home if not set
    if (!nearestStore && !locationError && !isLoading) {
      requestLocation();
    }
  }, [nearestStore, locationError, isLoading, requestLocation]);

  const handleAddToCart = (product) => {
    if (user?.role === 'guest') {
      alert("Please login to add items to your cart.");
      navigate('/login');
    } else {
      addToCart(product);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <h1>Groceries delivered in 10 minutes</h1>
          <p>Fresh instantly. {nearestStore ? `Delivering from ${nearestStore.name}` : 'Select your location to see availability.'}</p>
        </div>
      </div>

      <div className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        
        {products.length === 0 ? (
          <p className={styles.emptyState}>No products available.</p>
        ) : (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.imageContainer}>
                  <img src={product.image || 'https://via.placeholder.com/400'} alt={product.name} className={styles.productImage} />
                </div>
                <div className={styles.productInfo}>
                  <p className={styles.category}>{product.category}</p>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>₹{product.price}</span>
                    <button 
                      className={styles.addBtn}
                      onClick={() => handleAddToCart(product)}
                      title="Add to Cart"
                    >
                      <ShoppingCart size={16} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

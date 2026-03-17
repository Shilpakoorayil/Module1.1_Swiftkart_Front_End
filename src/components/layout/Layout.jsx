import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useLocation } from '../../context/LocationContext';
import styles from './Layout.module.css';

const Layout = () => {
  const { user, logout } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const { nearestStore, locationError, requestLocation, isLoading } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link to="/" className={styles.logo}>
            SwiftKart
          </Link>
          
          <div className={styles.locationSelector} onClick={requestLocation}>
            <MapPin size={20} className={styles.icon} />
            <div className={styles.locationInfo}>
              <span className={styles.locationLabel}>Delivery to</span>
              <span className={styles.locationValue}>
                {isLoading ? 'Detecting...' : nearestStore ? nearestStore.name : 'Select Location'}
              </span>
            </div>
            {locationError && <span className={styles.errorText}>!</span>}
          </div>

          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Search for products..." className={styles.searchInput} />
          </div>

          <div className={styles.headerActions}>
            {user?.role === 'user' ? (
              <div className={styles.userMenu}>
                <User size={20} />
                <span>{user.phone}</span>
                <button onClick={handleLogout} className={styles.iconBtn} title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className={styles.loginBtn}>Login</Link>
            )}

            <Link to="/cart" className={styles.cartBtn}>
              <ShoppingCart size={20} />
              <span className={styles.cartText}>Cart</span>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              {cartTotal > 0 && <span className={styles.cartTotal}>₹{cartTotal}</span>}
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} SwiftKart. All rights reserved.</p>
        <Link to="/admin/login" className={styles.adminLink}>Admin Portal</Link>
      </footer>
    </div>
  );
};

export default Layout;

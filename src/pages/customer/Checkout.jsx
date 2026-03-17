import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styles from '../../styles/layoutform.module.css';

const Checkout = () => {
  const { user, updateAddress } = useAuth();
  const { cartTotal, cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // Address logic: pre-fill if exists, else state
  const [address, setAddress] = useState(user?.address || '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const finalTotal = cartTotal > 200 ? cartTotal : cartTotal + 30;

  const handlePayment = (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Delivery address is required.');
      return;
    }
    
    // Save address to user profile if needed
    if (user?.role === 'user') {
      updateAddress(address);
    }

    // Mock payment success
    setSuccess(true);
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 3000);
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className={styles.container} style={{ margin: 'auto', marginTop: '4rem' }}>
        <h2 className={styles.title}>No items to checkout</h2>
        <button className={styles.button} onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.overlay}>
        <div className={styles.container} style={{ alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--secondary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1rem' }}>
            ✓
          </div>
          <h2 className={styles.title}>Payment Successful!</h2>
          <p className={styles.subtitle} style={{ marginTop: '0.5rem' }}>Your order is being prepared and will be delivered shortly.</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>Redirecting to Home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} style={{ position: 'static', background: 'none' }}>
      <div className={styles.container} style={{ margin: '2rem auto' }}>
        <h2 className={styles.title}>Checkout</h2>
        <p className={styles.subtitle}>Complete your order</p>

        <form className={styles.form} onSubmit={handlePayment}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Delivery Address</label>
            <textarea
              className={styles.input}
              placeholder="Enter complete building name, street, and landmark..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows="3"
            />
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--border-radius-sm)', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Items:</span>
              <span style={{ fontWeight: '600' }}>{cartItems.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.2rem' }}>
              <span>Total to Pay:</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.button}>
            Pay ₹{finalTotal} securely
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

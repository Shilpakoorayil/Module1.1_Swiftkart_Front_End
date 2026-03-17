import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Cart.module.css';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (user?.role === 'guest') {
      alert("Please login to proceed to checkout.");
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty Cart" className={styles.emptyImg} />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className={styles.continueBtn}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h1>Your Cart</h1>
        <button onClick={clearCart} className={styles.clearBtn}>Clear Cart</button>
      </div>

      <div className={styles.cartLayout}>
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />
              
              <div className={styles.itemDetails}>
                <h3 className={styles.itemName}>{item.name}</h3>
                <p className={styles.itemCategory}>{item.category}</p>
                <div className={styles.priceRow}>
                  <span className={styles.itemPrice}>₹{item.price}</span>
                  <div className={styles.quantityControls}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={styles.qtyBtn}>
                      {item.quantity === 1 ? <Trash2 size={16} color="var(--error-color)" /> : <Minus size={16} />}
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={styles.qtyBtn}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <h2>Bill Details</h2>
          <div className={styles.summaryRow}>
            <span>Item Total</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Delivery Fee</span>
            <span>{cartTotal > 200 ? 'Free' : '₹30'}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Grand Total</span>
            <span>₹{cartTotal > 200 ? cartTotal : cartTotal + 30}</span>
          </div>
          
          <button onClick={handleCheckout} className={styles.checkoutBtn}>
            Proceed to Checkout
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

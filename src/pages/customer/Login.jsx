import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/layoutform.module.css';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setOtpSent(true);
      setError('');
    } else {
      setError('Please enter a valid mobile number');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (loginUser(phone, otp)) {
      navigate('/');
    } else {
      setError('Invalid OTP. Use 1234 for testing.');
    }
  };

  const handleGuestLogin = () => {
    navigate('/');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h2 className={styles.title}>Login to SwiftKart</h2>
        <p className={styles.subtitle}>Get groceries in minutes</p>

        {!otpSent ? (
          <form className={styles.form} onSubmit={handleSendOtp}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Mobile Number</label>
              <input
                type="tel"
                className={styles.input}
                placeholder="Enter 10 digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button}>Send OTP</button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleVerifyOtp}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Enter OTP</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter 4 digit OTP (1234)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button}>Verify & Login</button>
            <button 
              type="button" 
              className={styles.linkButton} 
              onClick={() => setOtpSent(false)}
            >
              Change Mobile Number
            </button>
          </form>
        )}

        <div className={styles.guestLink}>
          Or <span className={styles.linkButton} onClick={handleGuestLogin}>continue as Guest</span>
        </div>
      </div>
    </div>
  );
};

export default Login;

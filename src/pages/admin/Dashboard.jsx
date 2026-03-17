import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';
import { LogOut, Package, Users, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>
        
        <nav className={styles.sidebarNav}>
          <Link to="/admin/dashboard" className={`${styles.navItem} ${styles.active}`}>
            <Settings size={20} /> Dashboard
          </Link>
          <Link to="/admin/products" className={styles.navItem}>
            <Package size={20} /> Products
          </Link>
          <div className={styles.navItem} style={{ opacity: 0.5 }}>
            <Users size={20} /> Customers
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <span>Welcome, {user?.username}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <h1>Dashboard Overview</h1>
        </header>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Products</h3>
            <p className={styles.statValue}>124</p>
          </div>
          <div className={styles.statCard}>
            <h3>Today's Orders</h3>
            <p className={styles.statValue}>45</p>
          </div>
          <div className={styles.statCard}>
            <h3>Active Users</h3>
            <p className={styles.statValue}>890</p>
          </div>
        </div>

        <div className={styles.recentActivity}>
          <h2>Recent Activity</h2>
          <div className={styles.activityList}>
            <p className={styles.activityItem}>Order #1042 was delivered successfully.</p>
            <p className={styles.activityItem}>New user registered from Downtown Hub.</p>
            <p className={styles.activityItem}>Stock for 'Fresh Milk 1L' was updated.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

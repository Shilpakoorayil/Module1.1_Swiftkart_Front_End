import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Products.module.css';
import dashboardStyles from './Dashboard.module.css'; // Reusing sidebar styles
import { Edit2, Trash2, Plus, LogOut, Settings, Package, Users } from 'lucide-react';

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: '', name: '', price: '', category: '', image: null, stock: '' });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateProduct(currentProduct.id, {
        ...currentProduct,
        price: Number(currentProduct.price),
        stock: Number(currentProduct.stock)
      });
    } else {
      addProduct({
        ...currentProduct,
        price: Number(currentProduct.price),
        stock: Number(currentProduct.stock),
      });
    }
    resetForm();
  };

  const editProduct = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct({ id: '', name: '', price: '', category: '', image: null, stock: '' });
  };

  return (
    <div className={dashboardStyles.dashboardContainer}>
      <aside className={dashboardStyles.sidebar}>
        <div className={dashboardStyles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>
        
        <nav className={dashboardStyles.sidebarNav}>
          <Link to="/admin/dashboard" className={dashboardStyles.navItem}>
            <Settings size={20} /> Dashboard
          </Link>
          <Link to="/admin/products" className={`${dashboardStyles.navItem} ${dashboardStyles.active}`}>
            <Package size={20} /> Products
          </Link>
          <div className={dashboardStyles.navItem} style={{ opacity: 0.5 }}>
            <Users size={20} /> Customers
          </div>
        </nav>

        <div className={dashboardStyles.sidebarFooter}>
          <div className={dashboardStyles.userInfo}>
            <span>Welcome, {user?.username}</span>
          </div>
          <button onClick={handleLogout} className={dashboardStyles.logoutBtn}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className={dashboardStyles.mainContent}>
        <div className={styles.header}>
          <h1>Product Management</h1>
          {!isEditing && currentProduct.name === '' && (
            <button className={styles.addNewBtn} onClick={() => setCurrentProduct({ name: '', price: '', category: '', image: null, stock: '' })}>
              <Plus size={18} /> Add New Product
            </button>
          )}
        </div>

        {(isEditing || currentProduct.name !== '' || currentProduct.price !== '') && (
          <div className={styles.formContainer}>
            <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className={styles.productForm}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input required type="text" value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} placeholder="E.g. Fresh Milk 1L" />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Price (₹)</label>
                  <input required type="number" min="0" value={currentProduct.price} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} placeholder="E.g. 65" />
                </div>
                <div className={styles.formGroup}>
                  <label>Stock</label>
                  <input required type="number" min="0" value={currentProduct.stock} onChange={(e) => setCurrentProduct({...currentProduct, stock: e.target.value})} placeholder="E.g. 50" />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <input required type="text" value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} placeholder="E.g. Dairy" />
              </div>
              <div className={styles.formGroup}>
                <label>Product Image</label>
                <input type="file" accept="image/*" onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.files[0]})} />
                {isEditing && typeof currentProduct.image === 'string' && (
                  <p style={{fontSize: '0.8rem', marginTop: '4px', color: '#666'}}>Current file: {currentProduct.image.split('/').pop()}</p>
                )}
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveBtn}>{isEditing ? 'Update' : 'Save'} Product</button>
                <button type="button" className={styles.cancelBtn} onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tableContainer}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image_url || 'https://via.placeholder.com/400'} alt={product.name} className={styles.tableImg} />
                  </td>
                  <td className={styles.nameCell}>{product.name}</td>
                  <td><span className={styles.badge}>{product.category}</span></td>
                  <td className={styles.priceCell}>₹{product.price}</td>
                  <td className={styles.stockCell}>{product.stock}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button onClick={() => editProduct(product)} className={styles.editBtn} title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className={styles.deleteBtn} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.emptyTable}>No products found. Add some!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Products;

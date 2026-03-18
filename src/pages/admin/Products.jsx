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
  const [isAdding, setIsAdding] = useState(false);
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
    setIsAdding(false);
    setCurrentProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setIsEditing(false);
    setIsAdding(false);
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
          {!isEditing && !isAdding && (
            <button className={styles.addNewBtn} onClick={() => {setIsAdding(true); setCurrentProduct({ name: '', price: '', category: '', image: null, stock: '' });}}>
              <Plus size={18} /> Add New Product
            </button>
          )}
        </div>

        {(isEditing || isAdding) && (
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
              <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                <label>Product Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '5px' }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '8px', 
                    border: '1px dashed #ccc', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', overflow: 'hidden', backgroundColor: '#f9f9f9', flexShrink: 0
                  }}>
                    {currentProduct.image ? (
                      <img 
                        src={typeof currentProduct.image === 'string' ? currentProduct.image : URL.createObjectURL(currentProduct.image)} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#999', textAlign: 'center', padding: '5px' }}>No Image</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.files[0]})} />
                    {isEditing && typeof currentProduct.image === 'string' && (
                      <p style={{fontSize: '0.8rem', marginTop: '6px', color: '#666'}}>Select a file to replace existing image.</p>
                    )}
                  </div>
                </div>
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
                    <img src={product.image || import.meta.env.VITE_PLACEHOLDER_IMAGE_URL} alt={product.name} className={styles.tableImg} />
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

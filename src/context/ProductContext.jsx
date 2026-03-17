import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/');
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (productData) => {
    try {
      const formData = new FormData();
      for (const key in productData) {
        if (productData[key] !== null) {
          formData.append(key, productData[key]);
        }
      }
      
      const response = await api.post('/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProducts([...products, response.data]);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const formData = new FormData();
      for (const key in updatedData) {
        if (updatedData[key] !== null) {
          // If updating and the image hasn't changed (it's a string URL from the DB), don't send it.
          // We only want to send the file object if the user selected a new file.
          if (key === 'image' && typeof updatedData[key] === 'string') {
            continue;
          }
          formData.append(key, updatedData[key]);
        }
      }
      
      const response = await api.put(`/products/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProducts(products.map(p => p.id === id ? response.data : p));
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}/`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loadingProducts, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

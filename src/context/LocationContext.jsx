import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

// Mock Dark Stores
const DARK_STORES = [
  { id: 'store_1', name: 'Downtown Hub', lat: 40.7128, lng: -74.0060, range: 5 }, // 5km range
  { id: 'store_2', name: 'Uptown Express', lat: 40.7829, lng: -73.9654, range: 5 },
  { id: 'store_3', name: 'Brooklyn Center', lat: 40.6782, lng: -73.9442, range: 8 },
];

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // { lat, lng }
  const [nearestStore, setNearestStore] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simple hardcoded mock to find nearest store
  const findNearestStore = (lat, lng) => {
    // For simplicity, just randomly pick a store if not doing real Haversine distance
    // Or do a simple distance calc
    let nearest = DARK_STORES[0];
    let minDistance = Infinity;

    DARK_STORES.forEach(store => {
      const dist = Math.sqrt(Math.pow(store.lat - lat, 2) + Math.pow(store.lng - lng, 2));
      if (dist < minDistance) {
        minDistance = dist;
        nearest = store;
      }
    });

    setNearestStore(nearest);
  };

  const requestLocation = () => {
    setIsLoading(true);
    setLocationError(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          findNearestStore(lat, lng);
          setIsLoading(false);
        },
        (error) => {
          setLocationError('Location access denied. Please enable GPS.');
          // Mock a default location if denied so app still works
          const lat = 40.7128;
          const lng = -74.0060;
          setLocation({ lat, lng });
          findNearestStore(lat, lng);
          setIsLoading(false);
        }
      );
    } else {
      setLocationError('Geolocation not supported');
      setIsLoading(false);
    }
  };

  return (
    <LocationContext.Provider value={{ location, nearestStore, locationError, requestLocation, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
};

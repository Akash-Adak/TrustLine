// src/__mocks__/leaflet.js
export const map = () => ({
  setView: () => {},
  addLayer: () => {},
  remove: () => {},
});

export const tileLayer = () => ({
  addTo: () => {},
});

export const marker = () => ({
  addTo: () => {},
  bindPopup: () => {},
});

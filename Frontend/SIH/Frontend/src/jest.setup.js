import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// 🗺️ Mock leaflet’s map functions to avoid DOM errors
jest.mock('leaflet', () => ({
  map: jest.fn(() => ({
    setView: jest.fn(),
    remove: jest.fn(),
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  circleMarker: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
  })),
}));

// if (!globalThis.importMetaEnvMocked) {
//   globalThis.importMetaEnvMocked = true;
//   const importMeta = { env: { VITE_API_URL: 'http://localhost:3000' } };
//   Object.defineProperty(globalThis, 'import', {
//     value: { meta: importMeta },
//     writable: false,
//   });
// }
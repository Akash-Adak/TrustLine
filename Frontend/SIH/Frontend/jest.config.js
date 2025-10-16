export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^leaflet$': './src/__mocks__/leafletMock.js',
    '^react-leaflet$': './src/__mocks__/leafletMock.js',
  },
  setupFilesAfterEnv: ['./src/jest.setup.js'],
};

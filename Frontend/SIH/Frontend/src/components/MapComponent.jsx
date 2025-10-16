// src/components/MapComponent.jsx
import React, { Suspense } from 'react';

const Map = React.lazy(() => import('./ActualMap'));

export default function MapComponent() {
  return (
    <Suspense fallback={<div>Loading Map...</div>}>
      <Map />
    </Suspense>
  );
}

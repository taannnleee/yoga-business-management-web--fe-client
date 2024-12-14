import React, { useEffect, useState } from 'react';
import { MFMap, MFMarker } from 'react-map4d-map';

const StoreMap: React.FC<any> = () => {
  // Default position (for example, Ho Chi Minh City)
  const defaultPosition = { lat: 10.8231, lng: 106.6297 };

  return (
    <div>
      {/* Input fields for latitude and longitude */}
      <div className="mb-4 flex space-x-4">
        <div>
          <label>Latitude:</label>
          <input type="text" value={defaultPosition.lat} disabled className="w-full border p-2" />
        </div>
        <div>
          <label>Longitude:</label>
          <input type="text" value={defaultPosition.lng} disabled className="w-full border p-2" />
        </div>
      </div>

      {/* Map component */}
      <div style={{ width: '100%', height: '300px' }}>
        <MFMap
          options={{
            center: defaultPosition,
            zoom: 17,
          }}
          version={'2.4'}
          accessKey={'d69ab3c4b70818de546a1b1bb15aeaa7'}
        >
          <MFMarker position={defaultPosition} />
        </MFMap>
      </div>
    </div>
  );
};

export default StoreMap;

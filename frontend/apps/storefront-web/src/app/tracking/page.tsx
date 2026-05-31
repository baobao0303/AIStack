'use client';

import React from 'react';
import { TrackingView, StorefrontShell, useAppStore, useViewNavigation } from '@tiem-nha-zit/shared-react';

export default function TrackingRoute() {
  const navigate = useViewNavigation();
  const activeOrder = useAppStore((state) => state.activeOrder);

  return (
    <StorefrontShell activeView="tracking">
      <TrackingView
        activeOrder={activeOrder}
        setActiveView={navigate}
      />
    </StorefrontShell>
  );
}

'use client';

import React from 'react';
import styles from '../../shared/styles/page.module.scss';
import TrackingView from '../../views/tracking/ui/TrackingView';
import StorefrontShell from '../../widgets/layout/ui/StorefrontShell';
import { useAppStore } from '../../core/stores/app.store';
import { useViewNavigation } from '../../shared/lib/useViewNavigation';

export default function TrackingRoute() {
  const navigate = useViewNavigation();
  const activeOrder = useAppStore((state) => state.activeOrder);

  return (
    <StorefrontShell activeView="tracking">
      <TrackingView
        styles={styles}
        activeOrder={activeOrder}
        setActiveView={navigate}
      />
    </StorefrontShell>
  );
}

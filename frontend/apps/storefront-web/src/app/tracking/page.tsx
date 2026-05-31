'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../shared/styles/page.module.scss';
import TrackingView from '../../views/tracking/ui/TrackingView';
import StorefrontShell from '../../widgets/layout/ui/StorefrontShell';
import { useAppStore } from '../../core/stores/app.store';

export default function TrackingRoute() {
  const router = useRouter();
  const activeOrder = useAppStore((state) => state.activeOrder);

  return (
    <StorefrontShell activeView="tracking">
      <TrackingView
        styles={styles}
        activeOrder={activeOrder}
        setActiveView={(view) => {
          if (view === 'home') {
            router.push('/');
          } else {
            router.push(`/${view}`);
          }
        }}
      />
    </StorefrontShell>
  );
}

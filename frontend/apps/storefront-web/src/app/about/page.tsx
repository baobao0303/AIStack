'use client';

import React from 'react';
import { AboutView, StorefrontShell, useViewNavigation } from '@tiem-nha-zit/shared-react';

export default function AboutRoute() {
  const navigate = useViewNavigation();

  return (
    <StorefrontShell activeView="about">
      {/* Preload the cinematic hero image for instant above-the-fold display */}
      <link 
        rel="preload" 
        href="/merino_scarf.png" 
        as="image" 
        fetchPriority="high" 
      />
      <AboutView setActiveView={navigate} />
    </StorefrontShell>
  );
}

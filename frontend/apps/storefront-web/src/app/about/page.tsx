'use client';

import React from 'react';
import { AboutView, StorefrontShell, useViewNavigation } from '@tiem-nha-zit/shared-react';

export default function AboutRoute() {
  const navigate = useViewNavigation();

  return (
    <StorefrontShell activeView="about">
      {/* Preload the cinematic hero and artisan cooperative images for instant loading */}
      <link 
        rel="preload" 
        href="/merino_scarf.png" 
        as="image" 
        fetchPriority="high" 
      />
      <link 
        rel="preload" 
        href="/vietnam_strap.png" 
        as="image" 
      />
      <link 
        rel="preload" 
        href="/vietnam_flower_strap.png" 
        as="image" 
      />
      <AboutView setActiveView={navigate} />
    </StorefrontShell>
  );
}

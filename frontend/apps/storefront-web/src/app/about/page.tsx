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
        href="https://lh3.googleusercontent.com/aida/ADBb0uhvpx8zRyIkiRxiqR5TYKu0lVSNibzq_zBeQve0TTm-3dGQykEsnaiMfNG28NfXDihyTrMyl6A2rbAVvVNpQYYub2wts4h-7flmo59K_0jpzXdRFc3nPKLRS7QHxhbpTpd4IHhseUNkyV9C3eQLjjehIQH_5tBzOo7mizGcWa-NN3GGSSPH9y1g0i1TK33ziyq9WBZ5UBC3ykeVjMxhk_rPmyfdfacFbtu-YmQKdTXA0E45BVE3QdM4v1f7" 
        as="image" 
        fetchPriority="high" 
      />
      <AboutView setActiveView={navigate} />
    </StorefrontShell>
  );
}

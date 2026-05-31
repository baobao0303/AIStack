'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginView from '../../../views/login/ui/LoginView';
import styles from '../../../shared/styles/page.module.scss';
import ShaderBackground from '../../../shared/ui/ShaderBackground';

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className={styles.storefrontLayout} style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', padding: 0 }}>
      {/* Background Weave Layer */}
      <div className={styles.ambientGrain}></div>
      <ShaderBackground />

      <LoginView 
        styles={styles} 
        setActiveView={(view) => {
          if (view === 'home') {
            router.push('/');
          } else {
            router.push(`/${view}`);
          }
        }} 
      />
    </div>
  );
}

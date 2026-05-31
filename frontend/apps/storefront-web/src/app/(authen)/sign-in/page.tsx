'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginView from '../../../views/login/ui/LoginView';
import styles from '../../../shared/styles/page.module.scss';
import StorefrontShell from '../../../widgets/layout/ui/StorefrontShell';

export default function SignInPage() {
  const router = useRouter();

  return (
    <StorefrontShell activeView="login">
      <div className={styles.loginContainer} style={{ minHeight: 'calc(100vh - 180px)' }}>
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
    </StorefrontShell>
  );
}

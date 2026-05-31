'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginView from '../../../views/login/ui/LoginView';

export default function SignInPage() {
  const router = useRouter();

  return (
    <LoginView 
      setActiveView={(view) => {
        if (view === 'home') {
          router.push('/');
        } else {
          router.push(`/${view}`);
        }
      }} 
    />
  );
}

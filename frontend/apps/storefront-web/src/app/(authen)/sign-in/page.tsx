'use client';

import React from 'react';
import LoginView from '../../../views/login/ui/LoginView';
import { useViewNavigation } from '../../../shared/lib/useViewNavigation';

export default function SignInPage() {
  const navigate = useViewNavigation();

  return <LoginView setActiveView={navigate} />;
}

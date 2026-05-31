'use client';

import React from 'react';
import { LoginView, useViewNavigation } from '@tiem-nha-zit/shared-react';

export default function SignInPage() {
  const navigate = useViewNavigation();

  return <LoginView setActiveView={navigate} />;
}

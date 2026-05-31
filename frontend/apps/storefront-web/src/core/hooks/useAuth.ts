// Custom useAuth Hook (SPEC_CORE_FE)
import { useState, useEffect, useCallback } from 'react';
import { RoleType } from '../constants/role.constants';
import { PermissionType } from '../constants/permission.constants';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  permissions: PermissionType[];
}

export interface UseAuthResult {
  isAuthenticated: boolean;
  user: UserSession | null;
  loading: boolean;
  login: (email: string, role?: RoleType) => Promise<boolean>;
  logout: () => void;
}

/**
 * Custom hook to simulate session state management
 */
export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Load active session from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user_session');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem('user_session');
        }
      }
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, role: RoleType = 'Customer'): Promise<boolean> => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockPermissions: PermissionType[] = [];
    if (role === 'Admin' || role === 'SuperAdmin') {
      mockPermissions.push('user.view', 'user.create', 'user.update', 'product.manage');
    } else {
      mockPermissions.push('user.view');
    }

    const session: UserSession = {
      id: 'usr-' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0] || 'Khách Hàng',
      email,
      role,
      permissions: mockPermissions,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('user_session', JSON.stringify(session));
      localStorage.setItem('access_token', 'mock-access-token-jwt-key');
    }

    setUser(session);
    setLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_session');
      localStorage.removeItem('access_token');
    }
    setUser(null);
  }, []);

  // Listen to global logout events from API response interceptors
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('auth-logout', logout);
      return () => {
        window.removeEventListener('auth-logout', logout);
      };
    }
  }, [logout]);

  return {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    logout,
  };
}

export default useAuth;

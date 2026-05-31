// Custom usePermission Hook (SPEC_CORE_FE)
import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { PermissionType } from '@tiem-nha-zit/shared';

export interface UsePermissionResult {
  hasPermission: (permission: PermissionType) => boolean;
  hasAnyPermission: (permissions: PermissionType[]) => boolean;
}

/**
 * Hook to validate current session roles and permissions
 */
export function usePermission(): UsePermissionResult {
  const { user } = useAuth();

  const hasPermission = useCallback(
    (permission: PermissionType): boolean => {
      if (!user) return false;
      
      // SuperAdmin bypasses all permission restrictions
      if (user.role === 'SuperAdmin') return true;

      return user.permissions?.includes(permission) || false;
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: PermissionType[]): boolean => {
      return permissions.some((permission) => hasPermission(permission));
    },
    [hasPermission]
  );

  return {
    hasPermission,
    hasAnyPermission,
  };
}

export default usePermission;

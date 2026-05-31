// RBAC System Permission Keys Constants (SPEC_CORE_FE)

export const SystemPermissions = {
  user: {
    view: 'user.view',
    create: 'user.create',
    update: 'user.update',
    delete: 'user.delete',
  },
  role: {
    manage: 'role.manage',
  },
  product: {
    manage: 'product.manage',
  },
} as const;

export type PermissionType = 
  | 'user.view' 
  | 'user.create' 
  | 'user.update' 
  | 'user.delete' 
  | 'role.manage' 
  | 'product.manage';

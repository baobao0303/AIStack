// User Role Constants (SPEC_CORE_FE)

export const UserRoles = {
  superAdmin: 'SuperAdmin',
  admin: 'Admin',
  manager: 'Manager',
  staff: 'Staff',
  customer: 'Customer',
} as const;

export type RoleType = 'SuperAdmin' | 'Admin' | 'Manager' | 'Staff' | 'Customer';

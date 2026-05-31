// Base and Auditable Entity Interfaces (SPEC_CORE_FE)

export interface BaseEntity {
  id: string;
}

export interface AuditableEntity extends BaseEntity {
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

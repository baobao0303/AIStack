export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  tenantId: string;
  isActive: boolean;
  roles: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  category: 'wool' | 'handmade';
}

export interface ChatSession {
  id: string;
  tenantId: string;
  customerEmail: string;
  assignedEmployeeId?: string;
  status: 'active' | 'closed';
  summary?: string;
  buyerScore?: number;
  createdAt: string;
  closedAt?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: 'customer' | 'agent' | 'system';
  senderName: string;
  content: string;
  sentAt: string;
}

export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'online' | 'busy' | 'offline';
  assignedChatsCount: number;
}

export interface Shift {
  id: string;
  employeeId: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface SuggestionRequest {
  productContext: string;
  recentMessages: string[];
}

export interface SummarizeResponse {
  sessionId: string;
  customerEmail: string;
  summary: string;
  buyerScore: number;
}

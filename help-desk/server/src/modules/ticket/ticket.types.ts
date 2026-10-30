export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'bug' | 'feature_request' | 'question' | 'account_issue' | 'other';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  reporterName: string;
  reporterEmail: string;
  assigneeId: number | null;
  slaDeadline: Date;
  resolvedAt: Date | null;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketWithAssignee extends Ticket {
  assignee?: {
    id: number;
    username: string;
    displayName: string;
    email: string;
    role: string;
  };
}

export interface TicketFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assigneeId?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'slaDeadline';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTicketDto {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  reporterName: string;
  reporterEmail: string;
  assigneeId?: number | null;
}

export interface UpdateTicketDto {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  category?: TicketCategory;
  reporterName?: string;
  reporterEmail?: string;
  assigneeId?: number | null;
}

export interface UpdateStatusDto {
  status: TicketStatus;
}

export const STATUSES: TicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
export const PRIORITIES: TicketPriority[] = ['low', 'medium', 'high', 'urgent'];
export const CATEGORIES: TicketCategory[] = ['bug', 'feature_request', 'question', 'account_issue', 'other'];

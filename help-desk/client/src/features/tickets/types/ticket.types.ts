export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'bug' | 'feature_request' | 'question' | 'account_issue' | 'other';

export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  role: string;
}

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
  assignee?: User;
  slaDeadline: string;
  resolvedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

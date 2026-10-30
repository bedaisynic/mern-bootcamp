export type UserRole = 'admin' | 'agent' | 'viewer';

export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  role: UserRole;
}

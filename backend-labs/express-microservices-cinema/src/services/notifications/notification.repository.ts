// given — this service's own data: every "email" it has sent.

export type Email = { id: number; userId: number; subject: string; body: string; sentAt: string };

let emails: Email[] = [];
let nextId = 1;

export const notificationRepository = {
  reset(): void {
    emails = [];
    nextId = 1;
  },

  create(input: Omit<Email, "id" | "sentAt">): Email {
    const email: Email = { id: nextId++, ...input, sentAt: new Date().toISOString() };
    emails.push(email);
    return email;
  },

  findByUser(userId: number): Email[] {
    return emails.filter((e) => e.userId === userId).reverse();
  },
};

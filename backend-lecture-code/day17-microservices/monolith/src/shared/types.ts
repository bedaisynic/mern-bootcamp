// Every module imports from this one file. Change a type here and you may
// break a module your team has never opened.

export type User = { id: number; email: string; name: string };

export type Product = { sku: string; name: string; price: number; category: string };

export type CartItem = { sku: string; quantity: number };

export type Order = {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: string;
};

export type Payment = { id: number; orderId: number; amount: number; status: string };

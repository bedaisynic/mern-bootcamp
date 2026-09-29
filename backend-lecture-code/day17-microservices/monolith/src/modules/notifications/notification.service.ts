import { Order, User } from "../../shared/types";
import { Notification, notificationRepository } from "./notification.repository";

export const notificationService = {
  async sendOrderConfirmation(user: User, order: Order): Promise<void> {
    const message = `Order #${order.id} confirmed, total $${order.total.toFixed(2)}`;
    await notificationRepository.create(user.id, "order_confirmation", message);
    console.log(`📧 to ${user.email}: ${message}`);
  },

  async listForUser(userId: number): Promise<Notification[]> {
    return notificationRepository.findByUser(userId);
  },

  // DEMO: a bug in the least important module. The error is thrown outside
  // any request, so nothing catches it, and it kills the one process that
  // runs every module, checkout included.
  scheduleCrash(): void {
    setTimeout(() => {
      throw new Error("💥 unhandled error in the notifications module");
    }, 100);
  },
};

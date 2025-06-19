export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

interface ApiClient {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data?: any): Promise<T>;
  patch<T>(endpoint: string, data?: any): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

export class NotificationService {
  constructor(private client: ApiClient) {}

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.client.get(`/notifications/${userId}`);
  }

  async markAsRead(notificationId: string): Promise<void> {
    return this.client.patch(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(userId: string): Promise<void> {
    return this.client.patch(`/notifications/${userId}/read-all`);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    return this.client.delete(`/notifications/${notificationId}`);
  }

  async createNotification(userId: string, notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>): Promise<Notification> {
    return this.client.post('/notifications', { userId, ...notification });
  }

  async sendBulkNotification(userIds: string[], notification: Omit<Notification, 'id' | 'userId' | 'read' | 'createdAt'>): Promise<void> {
    return this.client.post('/notifications/bulk', { userIds, notification });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.client.get(`/notifications/${userId}/unread-count`);
  }
} 
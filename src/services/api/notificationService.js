export class NotificationService {
    constructor(client) {
        this.client = client;
    }
    async getUserNotifications(userId) {
        return this.client.get(`/notifications/${userId}`);
    }
    async markAsRead(notificationId) {
        return this.client.patch(`/notifications/${notificationId}/read`);
    }
    async markAllAsRead(userId) {
        return this.client.patch(`/notifications/${userId}/read-all`);
    }
    async deleteNotification(notificationId) {
        return this.client.delete(`/notifications/${notificationId}`);
    }
    async createNotification(userId, notification) {
        return this.client.post('/notifications', { userId, ...notification });
    }
    async sendBulkNotification(userIds, notification) {
        return this.client.post('/notifications/bulk', { userIds, notification });
    }
    async getUnreadCount(userId) {
        return this.client.get(`/notifications/${userId}/unread-count`);
    }
}

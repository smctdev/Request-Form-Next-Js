export type NotificationContextType = {
  notifications: any[];
  unreadCount: number;
  handleMarkAllAsRead: () => void;
  isRefresh: boolean;
  setIsRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  markAsReadNotification: (id: any) => void;
};

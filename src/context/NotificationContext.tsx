"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2";
import { api } from "@/lib/api";
import echo from "@/hooks/echo";
import { NotificationContextType } from "@/types/notificationTypes";
import { usePathname } from "next/navigation";
import smctLogo from "@/assets/logo.png";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationReceived, setnotificationReceived] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((notif) => !notif.read_at);

    if (unreadNotifications.length === 0) {
      Swal.fire({
        html: `
          <div style="text-align: center; margin-bottom: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l9 6 9-6V4a2 2 0 00-2-2H5a2 2 0 00-2 2v4z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8l-9 6-9-6z" />
            </svg>
            <br/>
            <p>No unread notifications to mark as read.</p>
          </div>
        `,
        confirmButtonColor: "#007bff",
        confirmButtonText: "Close",
      });
      return; // Exit early if there are no unread notifications
    }

    try {
      const response = await api.put(
        `/notifications/mark-all-as-read/${user?.id}/notification-read-all`,
        {}
      );

      if (response.data.success) {
        // Update all notifications as read in local state
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) => ({
            ...notif,
            read_at: new Date().toISOString(),
          }))
        );

        // Update unread count to 0
        setUnreadCount(0);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "All notifications marked as read.",
          confirmButtonColor: "#007bff",
          confirmButtonText: "Close",
        });
      } else {
        console.error("Failed to mark all notifications as read");
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      alert(
        "Failed to mark all notifications as read. Please try again later."
      );
    }
  };

  useEffect(() => {
    if (!user?.id || !echo || !pathname) return;
    echo
      .private(`App.Models.User.${user?.id}`)
      .notification((notification: any) => {
        setnotificationReceived(true);
        if (notification) {
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: notification.message,
            showConfirmButton: false,
            timer: 6000,
            timerProgressBar: true,
            showCloseButton: true,
          });
        }

        if ("Notification" in window && notification) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              const notif = new Notification("Online Request Form", {
                body:
                  notification.message || "New notification from request form",
                icon: smctLogo.src,
              });

              notif.onclick = () => {
                window.focus();
                if(notification.type === "App\\Notifications\\ApprovalProcessNotification") {
                  window.location.href = "/approver/request";
                } else {
                  window.location.href = "/request";
                }
              };
            }
          });
        }
      });

    return () => {
      echo.leave(`private-App.Models.User.${user.id}`);
    };
  }, [user?.id, echo, pathname]);

  useEffect(() => {
    // Fetch initial notifications
    const fetchNotifications = async () => {
      if (!user?.id) return;
      try {
        const response = await api.get(
          `/notifications/${user?.id}/notifications`
        );
        const notificationsData = response.data.unread_notification;
        setNotifications(notificationsData);

        // Count unread notifications
        const unreadNotifications = notificationsData.filter(
          (notif: any) => !notif.read_at
        ).length;
        setUnreadCount(unreadNotifications);
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      } finally {
        setnotificationReceived(false);
      }
    };

    fetchNotifications();
  }, [notificationReceived, user?.id, isRefresh]);

  const markAsReadNotification = async (id: any) => {
    setIsRefresh(true);
    try {
      await api.post(`/read-notification/${id}/notification-read`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefresh(false);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        handleMarkAllAsRead,
        isRefresh,
        setIsRefresh,
        markAsReadNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import { useNotifications, useMarkAllRead } from "@/hooks/use-notifications";
import { NotificationItem } from "@/components/notifications/notification-item";

export default function NotificationsPage() {
  const { data: notifications = [] } = useNotifications();
  const markAllRead = useMarkAllRead();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>كل الإشعارات ({notifications.length})</CardTitle>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          <CheckCheck className="h-4 w-4" /> تعليم الكل كمقروء
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {notifications.map((n) => <NotificationItem key={n.id} notification={n} />)}
        </div>
      </CardContent>
    </Card>
  );
}

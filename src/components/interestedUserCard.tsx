"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface InterestedUserProps {
  user: { id: string; name: string; email: string };
  onAccept: (userId: string) => void;
  onReject: (userId: string) => void;
}

export default function InterestedUserCard({
  user,
  onAccept,
  onReject,
}: InterestedUserProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
        <div className="space-x-2">
          <Button onClick={() => onAccept(user.id)} variant="default">
            Accept
          </Button>
          <Button onClick={() => onReject(user.id)} variant="outline">
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

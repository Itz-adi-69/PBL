import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bell } from "lucide-react";
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

async function getGroups() {
  const user = await currentUser();
  if (!user) return [];

  const currUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!currUser) return [];

  return await prisma.group.findMany({
    where: { creatorId: currUser.id }, 
  });
}

export default async function MyGroupList() {
  const groups = await getGroups();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.length === 0 ? (
        <p>No groups found.</p>
      ) : (
        groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{group.subject}</CardTitle>
                <Badge variant="secondary">
                  <Bell className="h-4 w-4 mr-1" />
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{group.description}</p>
              <Button asChild>
                <Link href={`/my-groups/${group.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

// app/my-groups/[id]/page.tsx

import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { revalidatePath } from "next/cache";
import InterestedUserCard from "@/components/interestedUserCard";

// Add the @ts-ignore comment right before the function declaration
// @ts-ignore - Temporarily ignore type checking for this component
export default async function GroupDetails({
  params,
}: {
  params: { id: string };
}) {
  const groupId = params.id;

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      interests: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!group) {
    return <p className="text-center">Group not found.</p>;
  }

  const interestedUsers = group.interests.map(({ user }) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  const handleAcceptUser = async (userId: string) => {
    "use server";

    await prisma.interested.deleteMany({
      where: { userId, groupId },
    });

    await prisma.accepted.create({
      data: {
        userId,
        groupId,
      },
    });

    revalidatePath(`/my-groups/${groupId}`);
  };

  const handleRejectUser = async (userId: string) => {
    "use server";
    await prisma.interested.deleteMany({ where: { userId, groupId } });
    revalidatePath(`/groups/${groupId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/my-groups"
        className="inline-flex items-center mb-6 text-primary hover:underline"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Groups
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>{group.subject}</CardTitle>
          <CardDescription>
            {interestedUsers.length} interested users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-4">Interested Users</h3>
          {interestedUsers.length > 0 ? (
            <div className="space-y-4">
              {interestedUsers.map((user) => (
                <InterestedUserCard
                  key={user.id}
                  user={user}
                  onAccept={handleAcceptUser}
                  onReject={handleRejectUser}
                />
              ))}
            </div>
          ) : (
            <p>No interested users at the moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

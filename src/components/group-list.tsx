import { prisma } from "@/lib/db";
import GroupCard from "./ui/groupCard";
import { currentUser } from "@clerk/nextjs/server";

async function getGroups() {
  const user = await currentUser();
  if (!user) return [];
  const currUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  const groups = await prisma.group.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      creator: { select: { name: true } },
      interests: { select: { userId: true } },
      acceptedUsers: { select: { userId: true } },
    },
  });

  return groups.map((group) => ({
    id: group.id,
    subject: group.subject,
    description: group.description,
    contact: group.contact,
    section: group.section,
    creator: { name: group.creator.name },
    myPost: group.creatorId == currUser?.id,
    includeMe: group.interests.some(
      (interest) => interest.userId === currUser?.id
    ),
    acceptedMe: group.acceptedUsers.some(
      (accept) => accept.userId === currUser?.id
    ),
  }));
}

export default async function GroupList() {
  const groups = await getGroups();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}

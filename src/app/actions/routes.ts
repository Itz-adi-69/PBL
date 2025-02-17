"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGroup(formdata: FormData) {
  const user = await currentUser();
  if (!user) return;

  const currUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!currUser) return;
  const subject = (formdata.get("subject") as string) || "";
  const desc = (formdata.get("desc") as string) || "";
  const contact = (formdata.get("contact") as string) || "";
  const section = (formdata.get("section") as string) || "";

  await prisma.group.create({
    data: {
      subject,
      description: desc,
      contact,
      section,
      creator: { connect: { id: currUser.id } },
    },
  });
  revalidatePath("/");
  redirect("/");
}

export async function addInterest(groupId: string) {
  const user = await currentUser();
  if (!user) return;

  const currUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!currUser) return;

  const existingInterest = await prisma.interested.findFirst({
    where: {
      userId: currUser.id,
      groupId: groupId,
    },
  });

  if (existingInterest) return;

  await prisma.interested.create({
    data: {
      userId: currUser.id,
      groupId,
    },
  });

  revalidatePath("/");
}

export async function cancelInterest(groupId: string) {
  const user = await currentUser();
  if (!user) return;

  const currUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!currUser) return;

  await prisma.interested.deleteMany({
    where: {
      userId: currUser.id,
      groupId,
    },
  });

  revalidatePath("/");
}

/** ✅ Delete Group Action */
export async function deleteGroup(groupId: string) {
  const user = await currentUser();
  if (!user) return;

  const currUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!currUser) return;

  // Check if the user is the creator of the group
  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group || group.creatorId !== currUser.id) return;

  // Delete all interests associated with this group
  await prisma.interested.deleteMany({
    where: { groupId },
  });

  // Delete the group itself
  await prisma.group.delete({
    where: { id: groupId },
  });

  revalidatePath("/");
}

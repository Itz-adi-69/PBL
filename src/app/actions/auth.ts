"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUserWithDB() {
  try {
    const user = await currentUser();

    if (!user) return;

    await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        name: user.firstName || "Unknown",
        email: user.emailAddresses[0]?.emailAddress || "",
      },
      create: {
        clerkId: user.id,
        name: user.firstName || "Unknown",
        email: user.emailAddresses[0]?.emailAddress || "",
      },
    });

    console.log("User synced successfully");
  } catch (error) {
    console.error("Error syncing user:", error);
  }
}

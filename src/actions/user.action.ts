"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export const syncUser = async () => {
  try {
    // Authenticate user
    const { userId } = await auth();
    const user = await currentUser();

    // If no user is authenticated, exit early
    if (!userId || !user) return null;

    // Check if user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    // Create a new user in the database
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
        username: user?.username ?? user?.emailAddresses?.[0]?.emailAddress.split("@")[0],
        email: user?.emailAddresses?.[0]?.emailAddress ?? "",
        image: user?.imageUrl ?? "",
      },
    });

    return dbUser;
  } catch (error:any) {
    console.error("Error syncing user:", error.message, error.stack);
    return null;
  }
};

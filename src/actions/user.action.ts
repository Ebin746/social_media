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

export const getUserByClerkid = async (clerkId: string) => {
  try {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true
          }
        }
      }
    });
  } catch (error: any) {
    // Handle error appropriately
    console.error(error);
    throw new Error('Failed to fetch user');
    
  }
};

export const getDbUserId=async ()=>{
  try {
    const {userId:clerkId}=await auth();
    if(!clerkId){
       throw new Error("unauthenticated");
      }

    const user=await getUserByClerkid(clerkId);
    if(!user) throw new Error("user not found ");
    return user?.id;
  } catch (error:any) {
    console.log(error)
    
  }
}
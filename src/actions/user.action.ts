"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error syncing user:", error.message, error.stack);
    } else {
      console.error("Error syncing user:", error);
    }
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
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    throw new Error('Failed to fetch user');

  }
};

export const getDbUserId = async () => {
  try {
    const { userId: clerkId } = await auth();
    console.log(clerkId)
    if (!clerkId) {
      return null
    }

    const user = await getUserByClerkid(clerkId);
    if (!user) throw new Error("user not found ");
    return user?.id;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch user');
  }
}


export const getRandomUser = async () => {

  try {
    const userId = await getDbUserId();

    if (!userId) return [];

    // get 3 random users exclude ourselves & users that we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });

    return randomUsers;
  } catch (error) {
    console.log("Error fetching random users", error);
    return [];
  }
}

export const toggleFollow = async (toggleUserId: string) => {
  try {
    const userId = await getDbUserId()
    if (!userId) return { success: false, message: "can not follow , some error occured" }
    if (userId === toggleUserId) throw new Error("you can not follow your self");
    const existingUser = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: toggleUserId
        }
      }
    })
    if (existingUser) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: toggleUserId
          }
        }
      })
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: toggleUserId
          }
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: toggleUserId,
            creatorId: userId,

          }
        })
      ])
    }
    revalidatePath("/")
    return { success: true };
  } catch (error) {
    console.log(error)
    return { success: false, message: "can not follow , some error occured" }
  }
}
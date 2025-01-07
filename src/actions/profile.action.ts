import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getProfileByUsername = async (username: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true,
                name: true,
                username: true,
                bio: true,
                image: true,
                location: true,
                website: true,
                createdAt: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true
                    }
                }
            }
        })
        return user;

    } catch (error) {
        console.error("Error fetching profile:", error);
        throw new Error("Failed to fetch profile");
    }
}

export const getUserPosts = async (userId: string) => {
    try {
        const post = await prisma.post.findMany({
            where: {
                authorId: userId,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                image: true,
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: "asc"
                    }
                },
                likes: {
                    select: {
                        userId: true
                    }
                },

                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return post
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw new Error("Failed to fetch user posts");
    }
}

export const getUserLikedPosts=async (userId:string)=>{
    try {
        const post=await prisma.post.findMany({
            where:{
              likes:{
                some:{
                    userId
                }
              }
            },
            include:{
                author:{
                    select:{
                        id:true,
                        username:true,
                        name:true,
                        image:true
                    }
                },
                comments:{
                    include:{
                        author:{
                            select:{
                                id:true,
                                name:true,
                                username:true,
                                image:true
                            }
                        }
                    },
                    orderBy:{
                        createdAt:"asc"
                    }
                },likes:{
                select:{
                    userId:true
                }
                },
                _count:{
                    select:{
                        comments:true,
                        likes:true
                    }
                }
            }
        })
        return post;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        throw new Error("Failed to fetch user posts");
    }
}

export const updateProfile=async (formData:FormData)=>{
try {
    const {userId:clerkId}=await auth();
    if(!clerkId)  throw new Error("unauthorized");

    const name=formData.get("name") as string;
    const bio=formData.get("bio") as string;
    const website=formData.get("website") as string;
    const location=formData.get("location") as string;

    const result= await prisma.user.update({
        where:{
            clerkId   },
            data:{
                name,bio,website,location
            }

    })
    revalidatePath("/profile")
    return {success:true,result};
} catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
}
}

export const isFollowing=async(userId:string)=>{
    const {userId:currentUserId}=await auth();
    if(!currentUserId) return false;
try {
    const follow=await prisma.follows.findUnique({
        where:{
            followerId_followingId:{
                followerId:currentUserId as string,
                followingId:userId
            },
        }
    })
    return !!follow;
} catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
}
}
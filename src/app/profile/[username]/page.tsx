
import { notFound } from 'next/navigation';
import ProfilePageClient from '@/components/ProfilePageClient';
import { getProfileByUsername, getUserLikedPosts, getUserPosts,isFollowing } from '@/actions/profile.action';
 
export async function generateMetadata({params}:{params:{username:string}}){
    const user=await getProfileByUsername(params.username);
    if(!user) return false;
    return {
        title:`${user.name??user.username}`,
        description:user.bio||`check out the ${user.username} profile`
    }

}
 

const Page = async ({params}:{params:{username:string}}) => {
    console.log(params);
    const username=params.username;
    if(!username) return notFound();
  const user=await getProfileByUsername(username)
  if(!user) return;
    const [posts, likedPosts, isCurrentUserFollowingResult] = await Promise.all([
        getUserPosts(user?.id),
        getUserLikedPosts(user?.id),
        isFollowing(user.id)
    ]);

    const isCurrentUserFollowing = typeof isCurrentUserFollowingResult === 'boolean' ? isCurrentUserFollowingResult : isCurrentUserFollowingResult.success;

  return (
    <ProfilePageClient
    user={user}
    posts={posts}
    likedPosts={likedPosts}
    isFollowing={isCurrentUserFollowing}
  />
  )
}

export default Page
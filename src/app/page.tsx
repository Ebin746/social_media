
import CreatePost from "@/components/CreatePost"
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server"
import { getPosts } from "@/actions/post.action";
import PostCard from "@/components/PostCard";
import { getDbUserId } from "@/actions/user.action";
export default async function Home() {
  const user = await currentUser();
  const dbUserId = await getDbUserId()
  const posts = await getPosts()
  console.log(posts)
  return (<div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
    <div className="lg:col-span-6">
      {user ? <CreatePost /> : ".."}

      {user ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
        </div>

      ) : (<p>please Login ....</p>)}

    </div>

    <div className="hidden lg:block lg:col-span-4 sticky top-20">
      {user ? <WhoToFollow /> : null}
    </div>
  </div>)
}

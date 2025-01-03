"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { toggleFollow } from '@/actions/user.action';
import { Loader2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
const FollowButton = ({userId}:{userId:string}) => {
    const [isLoading,setIsLoading]=useState(false);
    const handleFollow=async ()=>{
        try {
            setIsLoading(true);
            const result=await toggleFollow(userId);
                if(result.success){
                    toast.success("successfully followed");
                }
        } catch (error) {
            console.log(error);
            toast.error("something error occured");
        }finally{
            setIsLoading(false);
        }

    }
  return (
<Button  size={"sm"}
      variant={"secondary"}
      onClick={handleFollow}
      disabled={isLoading}
      className="w-20">
{isLoading?(<Loader2Icon className='animate-spin size-4'/>):"follow"}
</Button>
  )
}

export default FollowButton
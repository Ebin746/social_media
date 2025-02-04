"use client"
import React from 'react'
import { UploadDropzone } from "../lib/uploadthings"
import { XIcon } from "lucide-react";
interface imageUploaderProps {
    onChange:(url:string)=>void,
    value:string,
    endpoint:"imageUploader",


}
const ImageUploader = ({endpoint,onChange,value}:imageUploaderProps) => {
    if(value){
        return (
            <div className="relative size-40">
                              {/* <img src={value} width={500} height={300} alt="Upload" className="rounded-md size-40 object-cover" /> */}
              <button
                onClick={() => onChange("")}
                className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm"
                type="button"
              >
                <XIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          );
    }
    return (
        <UploadDropzone
          endpoint={endpoint}
          onClientUploadComplete={(res) => {
            console.error("response",res)
            onChange(res?.[0].url);
          }}
          onUploadError={(error: Error) => {
            console.log(error);
          }}
        />
      );

}

export default ImageUploader
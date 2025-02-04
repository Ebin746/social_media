import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server"; 
const f = createUploadthing();
 

 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code runs on your server before upload
      const {userId} = await auth();
 
      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");
 
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
    try {
        console.log("Metadata:", metadata);
console.log("Uploaded file:", file);

        return {fileUrl:file.url};
    } catch (error) {
        console.log("an error occured at uploadthings:",error);
        throw error;
    }

    
 
    
    
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
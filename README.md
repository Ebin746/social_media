# Social Media Platform

## Overview
A modern social media platform built using Next.js and Prisma, designed for seamless post and image sharing. It features authentication, media uploads, and a sleek, user-friendly interface.

## GitHub Repository
🔗 [Social Media Platform](https://github.com/Ebin746/social_media)

## Tech Stack
- **Frontend:** Next.js, React, TailwindCSS, Radix UI
- **Backend:** Prisma (Neon DB)
- **Authentication:** Clerk
- **File Uploads:** UploadThing
- **Other Libraries:** Lucide React, React Hot Toast, Date-fns

## Features
✔️ User Authentication with Clerk  
✔️ Create, Edit, and Delete Posts  
✔️ Image Uploading with UploadThing  
✔️ Like & Comment System  
✔️ Modern, Responsive UI  
✔️ Scalable Database with Prisma & Neon DB  

## Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (Neon DB)
- Clerk Account for Authentication

### Clone the Repository
```sh
git clone https://github.com/Ebin746/social_media.git
cd social_media
```

### Install Dependencies
```sh
npm install
```

### Environment Variables
Create a `.env` file and add:
```sh
DATABASE_URL=your_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

### Run the Project
```sh
npm run dev
```

## Scripts
- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run postinstall` - Generate Prisma client





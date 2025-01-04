// pages/404.tsx
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">

        <h1 className="text-8xl font-extrabold tracking-tight animate-pulse ">404</h1>

        <p className=" animate-pulse mt-4 text-xl">Oops! The page you are looking for does not exist.</p>
        <p className="mt-2 text-sm text-muted-foreground animate-pulse">
          It might have been removed or the URL might be incorrect.
        </p>

        <Link href="/" passHref>
          <p className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/80">
            Go Back Home
          </p>
        </Link>
      </div>
    </div>
  );
}

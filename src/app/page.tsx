import { Button } from '@/components/ui/button'
import {

  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import { ModeToggle } from '@/components/ModeToggle'
export default function Home() {
return(<div>
 <SignedOut>
            <SignInButton mode='model'>
           
              <Button> Sign in </Button>
              </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <ModeToggle/>
          <Button variant={"secondary"}>Click me</Button>
</div>)
}

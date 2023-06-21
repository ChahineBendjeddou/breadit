import { getAuthSession } from '@/lib/auth'
import Link from 'next/link'
import { Icons } from './Icons'
import UserAccountNav from './UserAccountNav'
import { buttonVariants } from './ui/Button'
import SearchBar from './SearchBar'

export default async function Navbar() {
  const session = await getAuthSession()
  return (
    <nav className="fixed inset-x-0 top-0 z-10 py-2 border-b h-fit bg-zinc-100 border-zinc-300">
      <div className="container flex items-center justify-between h-full gap-2 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6" />
          <p className="hidden text-sm font-medium text-zinc-700 md:block">
            Breadit
          </p>
        </Link>
        <SearchBar />
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}

import Link from 'next/link'
import { Icons } from './Icons'
import { buttonVariants } from './ui/Button'

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-10 py-2 border-b h-fit bg-zinc-100 border-zinc-300">
      <div className="container flex items-center justify-between h-full gap-2 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6" />
          <p className="hidden text-sm font-medium text-zinc-700 md:block">
            Breadit
          </p>
        </Link>

        <Link href="/sign-in" className={buttonVariants()}>
          Sign In
        </Link>
      </div>
    </nav>
  )
}

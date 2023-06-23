'use client'
import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'
import UserAvatar from './UserAvatar'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { ImageIcon, Link2 } from 'lucide-react'

interface MiniCreatePostProps {
  session: Session | null
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <div className="overflow-hidden bg-white rounded-md shadow">
      <div className="flex justify-between h-full gap-6 px-6 py-4">
        <div className="relative ">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />
          <span className="absolute bottom-0 w-3 h-3 bg-green-500 rounded-full ring-0 outline outline-2 outline-white" />
        </div>
        <Input
          readOnly
          onClick={() => router.push(pathname + '/submit')}
          placeholder="Create post"
        />
        <Button
          variant="ghost"
          onClick={() => router.push(pathname + '/submit')}
          placeholder="Create post"
          className="hidden sm:block"
        >
          <ImageIcon className="text-zinc-600" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push(pathname + '/submit')}
          placeholder="Create post"
          className="hidden sm:block"
        >
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </div>
  )
}

export default MiniCreatePost

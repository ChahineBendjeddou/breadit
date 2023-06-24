'use client'
import { toast } from '@/hooks/use-toast'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { MoreVertical } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useRef } from 'react'
import { Button } from './ui/Button'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from './ui/Menubar'

interface MenuBarProps {
  authorId: string | undefined
  postId: string
}

const MenuBar: FC<MenuBarProps> = ({ authorId, postId }) => {
  const router = useRouter()
  const pathname = usePathname()
  const aRef = useRef<HTMLAnchorElement>(null)
  const { mutate: deletePost, isLoading } = useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await axios.delete(`/api/posts/delete?postId=${postId}`)
      return data
    },
    onError: () => {
      toast({
        description: 'Something went wrong, could not delete post',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        description: 'Post deleted successfully',
      })
      if (pathname.includes('post')) return router.back()
      aRef.current?.click()
    },
  })
  const { data: session } = useSession()
  if (!session || session.user.id !== authorId) return null
  return (
    <Menubar className="p-0 border-none outline-none">
      <a className="hidden" href={pathname} ref={aRef} />
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">
          <MoreVertical size={16} className="text-gray-900 w-fit h-fit" />
        </MenubarTrigger>
        <MenubarContent className="min-w-[50px]">
          <MenubarItem
            className="py-0 m-0 "
            onClick={(e) => e.preventDefault()}
          >
            <Button
              variant="ghost"
              className="px-0.5 text-sm "
              isLoading={isLoading}
              onClick={() => deletePost(postId)}
            >
              Delete post
            </Button>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default MenuBar

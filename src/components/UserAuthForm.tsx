'use client'
import { cn } from '@/lib/utils'
import { FC, HTMLAttributes, useState } from 'react'
import { Button } from './ui/Button'
import { signIn } from 'next-auth/react'
import { Icons } from './Icons'
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signIn('google')
    } catch (error) {
      // toast notification
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <Button
        size="sm"
        className="w-full"
        isLoading={isLoading}
        onClick={loginWithGoogle}
      >
        {isLoading ? null : <Icons.google className="w-4 h-4 mr-2" />}
        Google
      </Button>
    </div>
  )
}

export default UserAuthForm

'use client'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import { FC, HTMLAttributes, useState } from 'react'
import { Icons } from './Icons'
import { Button } from './ui/Button'
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { toast } = useToast()
  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signIn('google')
    } catch (error) {
      toast({
        title: 'There was a problem.',
        description:
          'There was a problem logging you in with google. Please try again.',
        variant: 'destructive',
      })
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

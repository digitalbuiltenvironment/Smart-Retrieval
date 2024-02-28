'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { cn } from '@/app/components/ui/lib/utils'
import { Button, type ButtonProps } from '@/app/components/ui/button'
import { IconGoogle, IconSGid, IconSpinner } from '@/app/components/ui/icons'
import { useSearchParams } from 'next/navigation'

interface LoginButtonProps extends ButtonProps {
  showIcon?: boolean;
  text?: string;
}

function GoogleLoginButton({
  text = 'Login with Google',
  showIcon = true,
  className = 'google-login-button flex items-center justify-center bg-white border-white text-black hover:bg-gray-400 hover:border-gray-400',
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams()
  const callbackURL = searchParams.get("callbackUrl"); // Get the 'callbackURL' query parameter
  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsLoading(true);
        signIn('google', {redirect: true, callbackUrl: callbackURL as string});
      }}
      className={cn(className)}
      {...props}
      disabled={isLoading}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showIcon ? (
        <IconGoogle className="mr-2" />
      ) : null}
      {text}
    </Button>
  );
}

function SGIDLoginButton({
  text = 'Login with sgID',
  showIcon = true,
  className = 'sgid-login-button flex items-center justify-center bg-custom-sgid-red border-custom-sgid-red text-white hover:bg-custom-sgid-red-light hover:border-custom-sgid-red-light',
  ...props
}: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams()
  const callbackURL = searchParams.get("callbackUrl"); // Get the 'callbackURL' query parameter
  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsLoading(true);
        signIn('sgid', {redirect: true, callbackUrl: callbackURL as string});
      }}
      className={cn(className)}
      {...props}
      disabled={isLoading}
    >
      {isLoading ? (
        <IconSpinner className="mr-2 animate-spin" />
      ) : showIcon ? (
        <IconSGid className="mr-2" />
      ) : null}
      {text}
    </Button>
  );
}

export { GoogleLoginButton, SGIDLoginButton };
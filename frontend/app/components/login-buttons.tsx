'use client'

import * as React from 'react'
import { signIn } from 'next-auth/react'

import { cn } from '@/app/components/ui/lib/utils'
import { Button, type ButtonProps } from '@/app/components/ui/button'
import { IconGoogle, IconSGid, IconSpinner } from '@/app/components/ui/icons'
import { useTheme } from 'next-themes';

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
  const [isLoading, setIsLoading] = React.useState(false);
  const { theme } = useTheme();

  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsLoading(true);
        signIn('google', { callbackUrl: `/chat` });
      }}
      disabled={isLoading}
      className={cn(className)}
      {...props}
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
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsLoading(true);
        signIn('sgid', { callbackUrl: `/chat` });
      }}
      disabled={isLoading}
      className={cn(className)}
      {...props}
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
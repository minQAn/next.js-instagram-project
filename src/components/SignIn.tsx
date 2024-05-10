'use client';

import { ClientSafeProvider, signIn } from 'next-auth/react';
import ColorButton from './ui/buttons/ColorButton';

type Props = {
    providers: Record<string, ClientSafeProvider>;
    callbackUrl: string;
}

export default function SignIn({ providers, callbackUrl }: Props){
    return <>
        {Object.values(providers).map((provider) => (
            <ColorButton 
                key={provider.id}  // provider's ID (ex: google's ID)
                text={`Sign In with ${provider.name}`} // (ex: 'google', 'github', 'kakao')
                onClick={() => signIn(provider.id, { callbackUrl })}
                size='big'
            />            
        ))}
    </>;
}
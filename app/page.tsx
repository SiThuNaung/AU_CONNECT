'use client'
import { useRouter, useSearchParams } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const provider = searchParams.get('provider');

  return (
    <div className="flex justify-center items-center h-screen flex-col gap-5">
      {success === 'true' ? (
        <div className='mb-4 p-4 bg-green-200 text-green-800 rounded'>
          {provider === 'google' ? 'Signed in with Google' : provider === 'linkedin' ? 'Signed in with LinkedIn' : 'OAuth'}
        </div>
      ) : null}
      <button className='bg-white text-black px-4 py-2 rounded' 
      onClick={() => {
        router.push('/api/auth/google');
      }}>Sign in with Google</button>

      <button className='bg-white text-black px-4 py-2 rounded' 
      onClick={() => {
        router.push('/api/auth/linkedin');
      }}>Sign in with LinkedIn</button>
    </div>
  );
}

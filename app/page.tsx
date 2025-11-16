'use client'
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen">
      <button className='bg-white text-black px-4 py-2 rounded' 
      onClick={() => {
        router.push('/api/auth/google');
      }}>Sign in with Google</button>
    </div>
  );
}

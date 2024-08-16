import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">You are not signed in</h1>
        <button
          onClick={() => signIn('google', { callbackUrl: '/profile' })}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Profile</h1>
        <div className="flex flex-col items-center">
          {session.user?.image && (
            <Image
              src={session.user.image}
              width={100}
              height={100}
              className="rounded-full mb-4"
              alt="User Image"
            />
          )}
          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Name:</span> {session.user?.name}
          </p>
          <p className="text-lg text-gray-700 mb-4">
            <span className="font-semibold">Email:</span> {session.user?.email}
          </p>
          <button
            onClick={() => signOut()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
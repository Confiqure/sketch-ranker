import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";

export default function Profile() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Session status:", status);
  }, [status]);

  if (!session) {
    return (
      <div>
        <h1>You are not signed in</h1>
        <button onClick={() => signIn('google', { callbackUrl: '/profile' })}>Sign in</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
      {session.user?.image && <Image src={session.user.image} width={100} height={100} alt="User Image" />}
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
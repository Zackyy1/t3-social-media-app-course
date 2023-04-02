import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const AuthButtons = () => {
  const { data: session } = useSession();

  return session ? (
    <div>
      <button
        onClick={() => {
          signOut().catch((err) => console.log(err));
        }}
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="absolute right-2">
      <Link className="block p-4 text-right font-bold" href="/login">
        Login
      </Link>
    </div>
  );
};

export default AuthButtons;

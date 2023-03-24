import { signIn } from "next-auth/react";
import React from "react";

const login = () => {
  const handleLogin = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="grid place-content-center min-h-[100vh]">
      <button
        className="rounded bg-blue-500 p-4 text-white"
        onClick={() => {
          handleLogin().catch((err) => console.error(err));
        }}
      >
        Login with Google
      </button>
    </div>
  );
};

export default login;

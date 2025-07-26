"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Sign in to your account</h1>

      <form
        method="post"
        action="/api/auth/callback/credentials"
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <input name="csrfToken" type="hidden" />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="p-2 bg-gray-800 border border-gray-600 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="p-2 bg-gray-800 border border-gray-600 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          Sign in with Email
        </button>
      </form>

      <div className="mt-6">
        {providers &&
          Object.values(providers).map((provider: any) => {
            if (provider.id === "credentials") return null;
            return (
              <div key={provider.name}>
                <button
                  onClick={() => signIn(provider.id)}
                  className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Sign in with {provider.name}
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

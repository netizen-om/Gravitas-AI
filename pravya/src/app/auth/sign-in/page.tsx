"use client";

import GithubLogo from "@/components/GithubLogo";
import GoogleLogo from "@/components/icons/GoogleLogo";
import LeftArrow from "@/components/icons/LeftArrow";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { getErrorMessage } from "@/utlis/getErrorMessage";

const signinSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignIn({ className = "" }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
      email: "",
      password: "",
  });

  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  


  useEffect(() => {
    if (error) {
      const message = getErrorMessage(error);
      console.log("Error detected:", error, "Message:", message);
      // Add a small delay to ensure toast is visible
      setTimeout(() => {
        toast.error(message);
      }, 100);
    }
  }, [error]);


  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value;
      setEmail(value);
      const result = signinSchema.safeParse({ email: value, password });
      setErrors(prev => ({
        ...prev,
        email: result.success ? "" : result.error.formErrors.fieldErrors.email?.[0] || ""
      }));
  }
  
  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value;
      setPassword(value);
      const result = signinSchema.safeParse({ email, password: value });
      setErrors(prev => ({
        ...prev,
        password: result.success ? "" : result.error.formErrors.fieldErrors.password?.[0] || ""
      }));
  }

  function isFormValid() {
      return email && password && !errors.email && !errors.password;
  }
  
  async function handleGoogleSignIn() {
    try {
      await signIn('google', {
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch {
      toast.error("Failed to sign in with Google. Please try again.");
    }
  } 
  
  async function handleGitHubSignIn() {
    try {
      await signIn('github', {
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch {
      toast.error("Failed to sign in with GitHub. Please try again.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    const result = signinSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
      });
      
      // Show toast for validation errors
      const firstError = fieldErrors.email?.[0] || fieldErrors.password?.[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    try {
      await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/dashboard",
      });
    } catch {
      toast.error("Failed to sign in. Please check your credentials and try again.");
    }
  }

  return (
    <div className={`bg-black min-h-screen ${className}`}>
      <div className="flex overflow-x-auto overflow-y-auto justify-center items-center items-start px-4 min-h-screen bg-black max-sm:px-2 max-sm:min-h-screen">
        <div className="fixed inset-0 z-0 pointer-events-none select-none min-h-screen w-auto">
          <Image
            src="/bgImg/background-auth.png"
            alt="Background Image"
            fill
            className="absolute object-cover inset-0 max-w-full align-middle pointer-events-none select-none border-black border-opacity-0 decoration-black decoration-opacity-0 outline-black outline-opacity-0 overflow-x-clip overflow-y-clip size-full text-black text-opacity-0"
            priority
          />
        </div>

        <Link
          href="/"
          className="flex absolute top-6 left-6 z-10 gap-0 gap-y-0 justify-center items-center px-4 h-10 text-sm font-semibold leading-5 rounded-2xl border-solid ease-in-out cursor-pointer select-none border-[0.8px] border-black border-opacity-0 decoration-neutral-400 duration-[0.2s] outline-neutral-400 text-neutral-400 transition-[color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,visibility,content-visibility,overlay,pointer-events]"
        >
          <LeftArrow />
          Home
        </Link>

        <main className="relative z-10 pt-8 w-full max-w-lg max-sm:pt-4 max-sm:max-w-full">
          <div className="mb-6 text-center">
            {/* Logo comes here */}

            <h1 className="mt-6 text-3xl font-semibold tracking-tighter leading-9 text-center text-white">
              Log in to Pravya
            </h1>
            <span className="inline text-sm leading-5 text-center border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="text-sm font-semibold leading-5 text-center ease-in-out cursor-pointer duration-[0.15s] transition-[color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to] text-white"
              >
                Sign up.
              </Link>
              .
            </span>
          </div>

          <div className="flex gap-4 gap-4 gap-y-4 gap-y-4 items-center mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="group hover:bg-white/90 hover:text-black inline-flex relative gap-0 gap-y-0 gap-y-0 justify-center items-center px-5 w-full h-12 font-semibold text-center text-white bg-origin-border rounded-2xl border-solid ease-in-out cursor-pointer outline-white select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]"
            >
              <GoogleLogo />
              <span className="text-sm group-hover:text-black font-semibold leading-5 text-center text-white border-white cursor-pointer outline-white select-none decoration-white">
                Login with Google
              </span>
            </button>

            <button
              type="button"
              onClick={handleGitHubSignIn}
              className="group hover:bg-white/90 hover:text-black inline-flex relative gap-0 gap-y-0 gap-y-0 justify-center items-center px-5 w-full h-12 font-semibold text-center text-white bg-origin-border rounded-2xl border-solid ease-in-out cursor-pointer outline-white select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]"
            >
              <GithubLogo />
              <span className="text-sm group-hover:text-black font-semibold leading-5 text-center text-white border-white cursor-pointer outline-white select-none decoration-white">
                Login with GitHub
              </span>
            </button>
          </div>

          <div className="flex justify-center items-center my-6">
            <div
              aria-hidden="true"
              role="separator"
              className="w-full h-px bg-neutral-800"
            />
            <span className="mx-4 text-sm leading-5 border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
              or
            </span>
            <div
              aria-hidden="true"
              role="separator"
              className="w-full h-px bg-neutral-800"
            />
          </div>

          <form autoComplete="off" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 gap-y-2 mb-5">
              <label
                htmlFor="email"
                className="text-sm leading-5 cursor-default border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="alan.turing@example.com"
                id="email"
                name="email"
                className='relative px-4 w-full h-12 text-sm leading-5 focus:outline-gray-950 text-white cursor-textbackdrop-blur-[25px] bg-origin-border rounded-2xl border-solid ease-in-out outline-white select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]'
                autoFocus
                required
                value={email}
                onChange={handleEmailChange}
              />
              {errors.email && (
                <div className="mt-1 text-xs text-red-500">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 gap-y-2 mb-5">
              <label
                htmlFor="password"
                className="text-sm leading-5 cursor-default border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                id="password"
                name="password"
                className=' relative px-4 w-full h-12 text-sm leading-5 focus:outline-gray-950 text-white cursor-textbackdrop-blur-[25px] bg-origin-border rounded-2xl border-solid ease-in-out outline-white select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]'
                required
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && (
                <div className="mt-1 text-xs text-red-500">
                  {errors.password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="group inline-flex hover:bg-white/90 hover:text-black relative gap-0 gap-y-0 justify-center items-center px-5 w-full h-12 text-sm font-semibold leading-5 text-center bg-origin-border rounded-2xl border-solid ease-in-out select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]"
              disabled={!isFormValid()}
            >
              <span className="group-hover:text-black">Log in</span>
            </button> 
          </form>

          <p className="mt-8 text-xs leading-4 text-center border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
            By signing in, you agree to our{" "}
            <a
              target="_blank"
              href="/terms"
              className="text-xs leading-4 text-center underline cursor-pointer border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400"
            >
              Terms
            </a>
            ,{" "}
            <a
              target="_blank"
              href="/acceptable-use"
              className="text-xs leading-4 text-center underline cursor-pointer border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400"
            >
              Acceptable Use
            </a>
            , and{" "}
            <a
              target="_blank"
              href="/privacy"
              className="text-xs leading-4 text-center underline cursor-pointer border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400"
            >
              Privacy Policy
            </a>
            .
          </p>
        </main>
      </div>
    </div>
  );
}

"use client";

import GithubLogo from "@/components/GithubLogo";
import GoogleLogo from "@/components/icons/GoogleLogo";
import LeftArrow from "@/components/icons/LeftArrow";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

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

  const credentialsAction = async (formData: FormData) => {
    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

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
      await signIn('google');
  } 
  
  async function handleGitHubSignIn() {
      await signIn('github');
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
      return;
    }

    const res = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/dashboard",
    });

    // You can optionally check `res?.error` or `res?.ok`
  }

  return (
    <div className={`bg-black min-h-screen ${className}`}>
      <div className="flex overflow-x-auto overflow-y-auto justify-center items-center items-start px-4 min-h-screen bg-black max-sm:px-2 max-sm:min-h-screen">
        <div className="fixed inset-0 z-0 pointer-events-none select-none h-[872px] w-[1536px]">
          <img
            src="/bgImg/background-auth.webp"
            alt="Background Image"
            className="absolute inset-0 max-w-full align-middle pointer-events-none select-none border-black border-opacity-0 decoration-black decoration-opacity-0 outline-black outline-opacity-0 overflow-x-clip overflow-y-clip size-full text-black text-opacity-0"
          />
        </div>

        <Link
          href="/"
          className="flex absolute top-6 left-6 z-10 gap-0 gap-y-0 gap-y-0 justify-center items-center px-4 h-10 text-sm font-semibold leading-5 rounded-2xl border-solid ease-in-out cursor-pointer select-none border-[0.8px] border-black border-opacity-0 decoration-neutral-400 duration-[0.2s] outline-neutral-400 text-neutral-400 transition-[color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,visibility,content-visibility,overlay,pointer-events]"
        >
          <LeftArrow />
          Home
        </Link>

        <main className="relative z-10 pt-8 w-full max-w-lg max-sm:pt-4 max-sm:max-w-full">
          <div className="mb-6 text-center">
            {/* Resend Logo  */}
            {/* <svg
              className="inline-block w-10"
              fill="none"
              viewBox="0 0 78 78"
              width="40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="76"
                height="76"
                rx="21"
                stroke="#FDFDFD"
                strokeOpacity="0.1"
                strokeWidth="2"
              />
              <path
                d="M43.0184 21C49.9908 21 54.1374 25.1467 54.1374 30.6513C54.1374 36.1558 49.9908 40.3025 43.0184 40.3025H39.4953L57 57H44.6329L31.3118 44.3394C30.3578 43.4587 29.9174 42.4312 29.9174 41.5506C29.9174 40.3029 30.7984 39.202 32.4864 38.7249L39.3485 36.8897C41.954 36.1925 43.7522 34.1741 43.7522 31.5319C43.7522 28.3027 41.1098 26.4312 37.8438 26.4312H21V21H43.0184Z"
                fill="url(#paint0_linear_1382_599)"
              />
              <path
                d="M54.1375 30.6513C54.1374 25.1467 49.9908 21 43.0184 21V20.55C46.5934 20.55 49.4879 21.6142 51.4941 23.4275C53.4405 25.1867 54.5189 27.6229 54.5844 30.3832L54.5875 30.6513C54.5875 33.5218 53.5032 36.0591 51.4941 37.875C49.5505 39.6317 46.7734 40.6853 43.3515 40.7495L43.0184 40.7525H40.619L58.1237 57.45H44.4532L44.3231 57.3261L31.0064 44.6694C29.978 43.7199 29.4675 42.579 29.4674 41.5506C29.4674 40.0491 30.5379 38.8082 32.3643 38.292L32.37 38.2903L39.2321 36.4551C41.6742 35.8016 43.3023 33.9377 43.3023 31.5319C43.3023 30.0523 42.7022 28.9051 41.7383 28.1191C40.7652 27.3258 39.3949 26.8812 37.8438 26.8812H20.55V20.55H43.0184V21H21V26.4312H37.8438C41.1098 26.4312 43.7522 28.3027 43.7523 31.5319C43.7523 34.1741 41.954 36.1925 39.3485 36.8897L32.4865 38.7249C30.7984 39.202 29.9174 40.3029 29.9174 41.5506C29.9175 42.4312 30.3578 43.4587 31.3118 44.3393L44.633 57H57.0001L39.4953 40.3025H43.0184C49.9909 40.3025 54.1375 36.1558 54.1375 30.6513Z"
                fill="url(#paint1_linear_1382_599)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_1382_599"
                  x1="39"
                  y1="21"
                  x2="58.1887"
                  y2="56.4242"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FDFDFD" />
                  <stop offset="1" stopColor="#ADADAD" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_1382_599"
                  x1="39.3369"
                  y1="20.55"
                  x2="58.8097"
                  y2="57.1549"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FDFDFD" />
                  <stop offset="1" stopColor="#ADADAD" />
                </linearGradient>
              </defs>
            </svg> */}

            <h1 className="mt-6 text-3xl font-semibold tracking-tighter leading-9 text-center text-white">
              Log in to Pravya
            </h1>
            <span className="inline text-sm leading-5 text-center border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
              Don't have an account?{" "}
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

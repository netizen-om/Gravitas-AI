"use client";
import * as React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";

interface SignupFormProps {
  className?: string;
}

// Zod schema for validation
const signupSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Signup({ className = "" }: SignupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setEmail(value);
    const result = signupSchema.safeParse({ email: value, password });
    setErrors(prev => ({
      ...prev,
      email: result.success ? "" : result.error.formErrors.fieldErrors.email?.[0] || ""
    }));
  }

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setPassword(value);
    const result = signupSchema.safeParse({ email, password: value });
    setErrors(prev => ({
      ...prev,
      password: result.success ? "" : result.error.formErrors.fieldErrors.password?.[0] || ""
    }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = signupSchema.safeParse({ email, password });
    setErrors({
      email: result.success ? "" : result.error.formErrors.fieldErrors.email?.[0] || "",
      password: result.success ? "" : result.error.formErrors.fieldErrors.password?.[0] || "",
    });
    if (!result.success) return;
    setIsLoading(true);
    try {
      // Simulate API call for account creation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Handle successful signup
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
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
          <span className="-ml-2 text-sm font-semibold leading-5 cursor-pointer select-none border-zinc-500 decoration-zinc-500 outline-zinc-500 text-zinc-500">
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-x-hidden overflow-y-hidden w-6 h-6 text-sm font-semibold leading-5 align-middle cursor-pointer select-none border-neutral-400 decoration-neutral-400 fill-none outline-neutral-400 text-neutral-400"
            >
              <path
                d="M13.25 8.75L9.75 12L13.25 15.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </span>
          Home
        </Link>

        <main className="relative z-10 pt-8 w-full max-w-lg max-sm:pt-4 max-sm:max-w-full">
          <div className="mb-6 text-center">
            <svg
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
            </svg>

            <h1 className="mt-6 text-3xl font-semibold tracking-tighter leading-9 text-center text-white">
              Create a Resend Account
            </h1>
            <span className="inline text-sm leading-5 text-center border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-sm font-semibold leading-5 text-center ease-in-out cursor-pointer duration-[0.15s] transition-[color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to] text-white"
              >
                Log in
              </Link>
              .
            </span>
          </div>

          <div className="flex gap-4 gap-4 gap-y-4 gap-y-4 items-center mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="inline-flex relative gap-0 gap-y-0 gap-y-0 justify-center items-center px-5 w-full h-12 font-semibold text-center text-white bg-origin-border rounded-2xl border-solid ease-in-out cursor-pointer outline-white select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]"
            >
              <svg
                className="relative -left-2"
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_829_635)">
                  <path
                    d="M19.8094 12.1497C19.8094 11.4942 19.7562 11.0158 19.6411 10.5198H12.1558V13.4784H16.5495C16.4609 14.2137 15.9826 15.321 14.9195 16.0651L14.9046 16.1641L17.2714 17.9976L17.4353 18.0139C18.9412 16.6232 19.8094 14.5769 19.8094 12.1497Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.1557 19.945C14.3083 19.945 16.1153 19.2363 17.4353 18.0139L14.9195 16.065C14.2463 16.5345 13.3427 16.8623 12.1557 16.8623C10.0474 16.8623 8.25806 15.4716 7.6202 13.5493L7.5267 13.5573L5.06575 15.4618L5.03357 15.5513C6.34459 18.1556 9.03754 19.945 12.1557 19.945Z"
                    fill="currentColor"
                    fillOpacity="0.6"
                  />
                  <path
                    d="M7.62023 13.5494C7.45193 13.0533 7.35453 12.5218 7.35453 11.9726C7.35453 11.4233 7.45193 10.8918 7.61138 10.3958L7.60692 10.2901L5.11514 8.35498L5.03361 8.39376C4.49327 9.47449 4.18323 10.6881 4.18323 11.9726C4.18323 13.257 4.49327 14.4706 5.03361 15.5513L7.62023 13.5494Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.1557 7.08269C13.6527 7.08269 14.6626 7.72934 15.2384 8.26974L17.4884 6.07286C16.1065 4.7884 14.3083 4 12.1557 4C9.03754 4 6.34459 5.78937 5.03357 8.39371L7.61134 10.3957C8.25806 8.47347 10.0474 7.08269 12.1557 7.08269Z"
                    fill="currentColor"
                    fillOpacity="0.6"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_829_635">
                    <rect fill="white" height="16" transform="translate(4 4)" width="16" />
                  </clipPath>
                </defs>
              </svg>
              <span className="text-sm font-semibold leading-5 text-center text-white border-white cursor-pointer outline-white select-none decoration-white">
                Login with Google
              </span>
            </button>

            <button
              type="button"
              onClick={handleGitHubSignIn}
              className="inline-flex relative gap-0 gap-y-0 gap-y-0 justify-center items-center px-5 w-full h-12 font-semibold text-center text-white bg-origin-border rounded-2xl border-solid ease-in-out cursor-pointer outline-white select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]"
            >
              <svg
                className="relative -left-2"
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4C7.58267 4 4 7.67255 4 12.2022C4 15.8263 6.292 18.9007 9.47133 19.9855C9.87067 20.0614 10 19.8071 10 19.5911V18.0641C7.77467 18.5603 7.31133 17.0962 7.31133 17.0962C6.94733 16.1482 6.42267 15.896 6.42267 15.896C5.69667 15.3868 6.478 15.3977 6.478 15.3977C7.28133 15.4551 7.704 16.2432 7.704 16.2432C8.41733 17.4968 9.57533 17.1345 10.032 16.9247C10.1033 16.395 10.3107 16.0327 10.54 15.8283C8.76333 15.6198 6.89533 14.9165 6.89533 11.7744C6.89533 10.8783 7.208 10.1469 7.71933 9.57274C7.63667 9.36563 7.36267 8.53106 7.79733 7.40188C7.79733 7.40188 8.46933 7.18179 9.998 8.24261C10.636 8.06079 11.32 7.96989 12 7.96647C12.68 7.96989 13.3647 8.06079 14.004 8.24261C15.5313 7.18179 16.202 7.40188 16.202 7.40188C16.6373 8.53174 16.3633 9.36632 16.2807 9.57274C16.794 10.1469 17.104 10.8789 17.104 11.7744C17.104 14.9247 15.2327 15.6185 13.4513 15.8215C13.738 16.0758 14 16.5747 14 17.3403V19.5911C14 19.8091 14.128 20.0655 14.534 19.9848C17.7107 18.8987 20 15.8249 20 12.2022C20 7.67255 16.418 4 12 4Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-sm font-semibold leading-5 text-center text-white border-white cursor-pointer outline-white select-none decoration-white">
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

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 gap-2 gap-y-2 gap-y-2 mb-5">
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
                className='relative px-4 w-full h-12 text-sm leading-5 text-white rounded-2xl border-solid ease-in-out cursor-text outline-white select-none backdrop-blur-[25px] bg-[0%_0%,0%_0%] bg-[auto,auto] bg-[url("https://resend.com/static/texture-btn.png"),linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] overflow-x-clip overflow-y-clip transition-[color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,visibility,content-visibility,overlay,pointer-events]'
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

            <div className="flex flex-col gap-2 gap-2 gap-y-2 gap-y-2 mb-5">
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
                className='relative px-4 w-full h-12 text-sm leading-5 text-white rounded-2xl border-solid ease-in-out cursor-text outline-white select-none backdrop-blur-[25px] bg-[0%_0%,0%_0%] bg-[auto,auto] bg-[url("https://resend.com/static/texture-btn.png"),linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] decoration-white duration-[0.2s] overflow-x-clip overflow-y-clip transition-[color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,visibility,content-visibility,overlay,pointer-events]'
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
              className="inline-flex relative gap-0 gap-y-0 gap-y-0 justify-center items-center px-5 w-full h-12 text-sm font-semibold leading-5 text-center bg-origin-border rounded-2xl border-solid ease-in-out select-none backdrop-blur-[25px] bg-[linear-gradient(104deg,rgba(253,253,253,0.05)_5%,rgba(240,240,228,0.1))] bg-black bg-opacity-0 border-[1.6px] border-[oklab(0.999994_0.0000455678_0.0000200868_/_0.05)] duration-[0.2s] shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_1px_3px_0px,rgba(0,0,0,0.1)_0px_1px_2px_-1px]"
              disabled={!isFormValid() || isLoading}
              style={{
                color:
                  isFormValid() && !isLoading
                    ? "rgb(255, 255, 255)"
                    : "oklab(0.999994 0.0000455678 0.0000200868 / 0.5)",
                cursor:
                  isFormValid() && !isLoading ? "pointer" : "not-allowed",
                opacity: isFormValid() && !isLoading ? "1" : "0.3",
                outlineColor:
                  isFormValid() && !isLoading
                    ? "rgb(255, 255, 255)"
                    : "oklab(0.999994 0.0000455678 0.0000200868 / 0.5)",
                textDecorationColor:
                  isFormValid() && !isLoading
                    ? "rgb(255, 255, 255)"
                    : "oklab(0.999994 0.0000455678 0.0000200868 / 0.5)",
              }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button> 
          </form>

          <p className="mt-8 text-xs leading-4 text-center border-neutral-400 decoration-neutral-400 outline-neutral-400 text-neutral-400">
            By signing up, you agree to our{" "}
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
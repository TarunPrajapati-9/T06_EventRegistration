"use client";

/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import trpc from "../_trpc/client";

type FormSchema = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate, isPending } = trpc.login.useMutation();
  function onSubmit(state: FormSchema) {
    mutate(state, {
      onSettled(data, error) {
        if (data) {
          toast.success("Welcome!");
          router.push("/home");
        }
        if (!data) toast.error("Invalid credentials");
        if (error) toast.error(error.message);
        reset();
      },
    });
  }
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row">
      {/* left image section */}
      <img
        src="/images/login_hero.jpg"
        alt="Hero image"
        className="h-1/3 w-full md:w-1/2 object-cover md:h-screen pointer-events-none"
        loading="lazy"
      />

      {/* left section */}
      <div className="flex h-full w-full md:w-1/2 items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[95%] md:w-[70%] flex flex-col items-center justify-center gap-y-6 rounded-sm shadow-lg p-10"
          autoComplete="off"
        >
          <Image
            src="/images/event.png"
            alt="logo"
            className="pointer-events-none"
            height={100}
            width={300}
          />
          <label className="form-control w-full">
            <div className="label">
              <span
                className={twMerge("label-text", errors.email && "text-error")}
              >
                {errors.email ? "Enter valid email" : "Enter your email"}
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter your email"
              className={twMerge(
                "input input-bordered w-full",
                errors.email && "input-error"
              )}
              disabled={isPending}
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span
                className={twMerge(
                  "label-text",
                  errors.password && "text-error"
                )}
              >
                {errors.password
                  ? "Enter valid password"
                  : "Enter your password"}
              </span>
            </div>
            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              placeholder="Enter your password"
              className={twMerge(
                "input input-bordered w-full",
                errors.password && "input-error"
              )}
              disabled={isPending}
            />
          </label>
          <button
            disabled={isPending}
            type="submit"
            className="btn btn-primary w-full"
          >
            {isPending && <span className="loading loading-spinner" />}
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

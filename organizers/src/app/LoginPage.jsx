import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { signIn } from "../utils/dataPoster";

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: (res) => {
      if (res.detail.status) {
        toast.success("Login Successful");
        localStorage.setItem("eventify_organizer_token", res.detail.token);
        navigate("/");
      } else {
        toast.error("Invalid credentials");
      }
    },
    onError: (err) => {
      toast.error(`Error : ${err.message}`);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    mutate({
      o_email: data.email,
      o_password: data.password,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row">
        {/* left image section */}
        <img
          src="/images/login_hero.jpg"
          alt="Hero image"
          className="h-1/3 w-full md:w-1/2 object-cover md:h-screen pointer-events-none"
          loading="lazy"
        />

        {/* left section */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="w-[70%] flex flex-col items-center justify-center gap-y-6 rounded-sm shadow-lg p-10">
            <img
              src="/images/event.png"
              alt="logo"
              className="pointer-events-none"
              height={100}
              width={300}
            />
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Enter email</span>
              </div>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                {...register("email", {
                  required: "Email is Required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Enter a Valid Email",
                  },
                })}
                disabled={isPending}
              />
              {errors.email && (
                <div className="text-red-500 mx-2 my-1">
                  {errors.email.message}
                </div>
              )}
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Enter password</span>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                {...register("password", {
                  required: "Password is Required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 8 characters",
                  },
                })}
                disabled={isPending}
              />
              {errors.password && (
                <div className="text-red-500 mx-2 my-1">
                  {errors.password.message}
                </div>
              )}
            </label>
            <button
              disabled={isPending}
              type="submit"
              className="btn btn-primary w-full"
            >
              {isPending && <span className="loading loading-spinner" />}
              Login
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;

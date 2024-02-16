import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../utils/dataPoster";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: (res) => {
      if (res.detail.status) {
        toast.success("Login Successfully!");
        localStorage.setItem("participant_token", res.detail.token);
        navigate("/");
      }
    },
    onError: () => {
      toast.error("Invalid Credentials");
    },
  });

  const onSubmit = async (data) => {
    mutate({ p_email: data.p_email, p_password: data.p_password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="h-screen w-screen overflow-hidden flex flex-col md:flex-row">
        {/* left image section */}
        <img
          src="/login_hero.jpg"
          alt="Hero image"
          className="h-1/3 w-full md:w-1/2 object-cover md:h-screen pointer-events-none"
          loading="lazy"
        />

        {/* Right section */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="w-[70%] flex flex-col items-center justify-center gap-y-6 rounded-sm shadow-lg p-10">
            <img
              src="event.png"
              alt="logo"
              className="pointer-events-none"
              height={100}
              width={300}
            />
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Enter Email</span>
              </div>
              <input
                type="text"
                name="p_email"
                placeholder="Enter your email"
                disabled={isPending}
                className={`input input-bordered w-full ${
                  errors.p_email ? "input-error" : ""
                }`}
                {...register("p_email", {
                  required: "Email is Required!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Enter a Valid Email!",
                  },
                })}
              />
              {errors.p_email && (
                <div className="text-red-500 mx-2 my-1">
                  {errors.p_email.message}
                </div>
              )}
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Enter Password</span>
              </div>
              <input
                type="password"
                name="p_password"
                placeholder="Enter your password"
                disabled={isPending}
                className={`input input-bordered w-full ${
                  errors.p_password ? "input-error" : ""
                }`}
                {...register("p_password", {
                  required: "Password is Required! ",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters!",
                  },
                })}
              />
              {errors.p_password && (
                <div className="text-red-500 mx-2 my-1">
                  {errors.p_password.message}
                </div>
              )}
            </label>
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? <span className="loading loading-dots" /> : "Login"}
            </button>
            <button
              type="button"
              disabled={isPending}
              className="btn btn-link"
              onClick={() => {
                navigate("/signUp");
              }}
            >
              Don&apos;t have an account?
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;

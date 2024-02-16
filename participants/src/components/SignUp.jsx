import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../utils/dataPoster";

const SignUp = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: (res) => {
      if (res.detail.status) {
        toast.success("Account Created Successfully!");
        localStorage.setItem("participant_token", res.detail.token);
        localStorage.setItem("participant_id", res.detail._id);
        navigate("/");
      }
    },
    onError: () => {
      toast.error("Invalid Credentials");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();

  const password = watch("p_password");

  const onSubmit = async (data) => {
    mutate({
      p_name: data.p_name,
      p_email: data.p_email,
      p_password: data.p_password,
    });
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
          <div className="w-[70%] flex flex-col items-center justify-center gap-y-1 rounded-sm shadow-lg p-10">
            <Toaster
              containerStyle={{
                position: "relative",
                width: "100%",
              }}
              toastOptions={{
                className: "bg-base-300 text-white",
              }}
            />
            <img
              src="event.png"
              alt="logo"
              className="pointer-events-none"
              height={100}
              width={300}
            />
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Enter Full Name</span>
              </div>
              <input
                type="text"
                name="p_name"
                placeholder="Enter your name"
                disabled={isPending}
                className={`input input-bordered w-full ${
                  errors.p_name ? "input-error" : ""
                }`}
                {...register("p_name", { required: "Name is Required!" })}
              />
              {errors.p_name && (
                <div className="text-red-500 mx-2 my-1">
                  {errors.p_name.message}
                </div>
              )}
            </label>
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
                <span className="label-text">Password</span>
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
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Confirm Password</span>
              </div>
              <input
                type="password"
                name="cn_password"
                disabled={isPending}
                placeholder="Confirm your password"
                className={`input input-bordered w-full ${
                  errors.cn_password ? "input-error" : ""
                }`}
                {...register("cn_password", {
                  required: "Confirm Password Needed!",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />

              {errors.cn_password && (
                <div className="text-red-500 mx-2 my-1">
                  {errors.cn_password.message}
                </div>
              )}
            </label>
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-dots" />
              ) : (
                "Create Account"
              )}
            </button>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => {
                navigate("/signIn");
              }}
            >
              Already have an account?
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignUp;

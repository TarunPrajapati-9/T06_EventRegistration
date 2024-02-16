/* eslint-disable react/prop-types */
import { Fragment } from "react";
import { useForm } from "react-hook-form";

export default function Contact({ open, handleClose }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {};
  return (
    <Fragment>
      {open && (
        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center z-50">
          <div className="relative bg-base-300 rounded-lg p-8 max-w-md w-full">
            <div className="absolute top-0 right-0">
              <button
                className="btn bg-transparent btn-circle hover:bg-base-100"
                onClick={handleClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <h1 className="text-2xl flex justify-center font-semibold">
              Contact
            </h1>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Enter Email</span>
                </div>
                <input
                  type="text"
                  name="p_email"
                  placeholder="Enter your email"
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
                  <span className="label-text">Enter Mobile Number</span>
                </div>
                <input
                  type="text"
                  name="mno"
                  placeholder="Enter your mobile no"
                  className={`input input-bordered w-full ${
                    errors.mno ? "input-error" : ""
                  }`}
                  {...register("mno", {
                    required: "Mobile Number is Required!",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a Valid Mobile Number!",
                    },
                  })}
                />
                {errors.mno && (
                  <div className="text-red-500 mx-2 my-1">
                    {errors.mno.message}
                  </div>
                )}
              </label>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Enter Message</span>
                </div>
                <textarea
                  className={`textarea textarea-bordered resize-none ${
                    errors.msg ? "textarea-error" : ""
                  }`}
                  name="msg"
                  placeholder="Enter your message"
                  {...register("msg", {
                    required: "Message Required!",
                  })}
                ></textarea>
                {errors.msg && (
                  <div className="text-red-500 mx-2 my-1">
                    {errors.msg.message}
                  </div>
                )}
              </label>
              <button
                type="submit"
                className="btn hover:bg-blue-600 w-full bg-blue-700"
              >
                Place Message
              </button>
            </form>
            <p className="mt-4 text-sm">
              Contact via E-Mail :- eventify@gmail.com <br /> ( We will try to
              reply you as soon as possible.)
            </p>
          </div>
        </div>
      )}
    </Fragment>
  );
}

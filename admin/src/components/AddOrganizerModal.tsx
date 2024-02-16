"use client";

import { useForm } from "react-hook-form";
import Modal from "./Modal";
import { twMerge } from "tailwind-merge";
import useModal from "@/hooks/useModal";
import { useRouter } from "next/navigation";
import trpc from "@/app/_trpc/client";
import toast from "react-hot-toast";

type FormSchema = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const AddOrganizerModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormSchema>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { closeModal } = useModal();
  const router = useRouter();
  const { mutate, isPending } = trpc.organizer.addOrganizer.useMutation();

  function onSubmit(data: FormSchema) {
    mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess(res) {
          if (res) {
            toast.success("Organizer added!");
            reset();
            router.refresh();
            closeModal();
          } else {
            toast.error("Something went wrong!");
          }
        },
        onError(error) {
          toast.error(error.message);
        },
      }
    );
  }
  return (
    <Modal type="add-organizer" className="w-[500px]">
      <h1 className="text-2xl font-bold">Add Organizer</h1>
      <form
        className="flex flex-col gap-4 p-2"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        {/* name */}
        <label className="form-control w-full">
          <div className="label">
            <span
              className={twMerge("label-text", errors.name && "text-error")}
            >
              {errors.name
                ? "Enter valid organizer name"
                : "Enter organizer name"}
            </span>
          </div>
          <input
            type="text"
            placeholder="Enter organizer name"
            className={twMerge(
              "input input-bordered w-full",
              errors.name && "input-error"
            )}
            {...register("name", {
              required: true,
              minLength: 3,
            })}
            disabled={isPending}
          />
        </label>
        {/* email */}
        <label className="form-control w-full">
          <div className="label">
            <span
              className={twMerge("label-text", errors.email && "text-error")}
            >
              {errors.name
                ? "Enter valid organizer email"
                : "Enter organizer email"}
            </span>
          </div>
          <input
            type="text"
            placeholder="Enter organizer email"
            className={twMerge(
              "input input-bordered w-full",
              errors.email && "input-error"
            )}
            {...register("email", {
              required: true,
              minLength: 3,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter valid email",
              },
            })}
            disabled={isPending}
          />
        </label>
        {/* password */}
        <label className="form-control w-full">
          <div className="label">
            <span
              className={twMerge("label-text", errors.password && "text-error")}
            >
              {errors.password
                ? "Enter valid organizer password"
                : "Enter organizer password"}
            </span>
          </div>
          <input
            type="text"
            placeholder="Enter organizer password"
            className={twMerge(
              "input input-bordered w-full",
              errors.password && "input-error"
            )}
            {...register("password", {
              required: true,
              minLength: 3,
            })}
            disabled={isPending}
          />
        </label>
        {/* confirm password */}
        <label className="form-control w-full">
          <div className="label">
            <span
              className={twMerge(
                "label-text",
                errors.confirmPassword && "text-error"
              )}
            >
              {errors.confirmPassword
                ? "Confirm password does not match"
                : "Confirm organizer password"}
            </span>
          </div>
          <input
            type="text"
            placeholder="confirm organizer password"
            className={twMerge(
              "input input-bordered w-full",
              errors.confirmPassword && "input-error"
            )}
            {...register("confirmPassword", {
              required: true,
              minLength: 3,
              validate: (value) => value === watch("password"),
            })}
            disabled={isPending}
          />
        </label>
        <button className="btn w-full" type="submit" disabled={isPending}>
          {isPending && <span className="loading loading-spinner" />}
          Add organizer
        </button>
      </form>
    </Modal>
  );
};

export default AddOrganizerModal;

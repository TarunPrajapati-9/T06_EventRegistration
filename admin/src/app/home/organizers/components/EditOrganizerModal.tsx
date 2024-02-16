"use client";

import { Organizer } from "@prisma/client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

import Modal from "@/components/Modal";
import trpc from "@/app/_trpc/client";
import useModal from "@/hooks/useModal";

type Props = {
  organizer: Organizer;
};
type FormSchema = {
  o_name: string;
  o_email: string;
};

const EditOrganizerModal = ({ organizer }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: {
      o_email: organizer.o_email,
      o_name: organizer.o_name,
    },
  });
  const { closeModal } = useModal();
  const router = useRouter();
  const { mutate, isPending } = trpc.organizer.updateOrganizer.useMutation();
  function onSubmit(data: FormSchema) {
    mutate(
      {
        id: organizer.id,
        o_name: data.o_name,
        o_email: data.o_email,
      },
      {
        onSuccess: (data) => {
          if (data) {
            toast.success("Organizer updated successfully");
            router.refresh();
            closeModal();
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  }
  return (
    <Modal type={`organizer-edit-${organizer.id}`} className="w-[600px]">
      <h1 className="text-3xl mb-10 mt-3 font-bold">
        Edit Organizer {organizer.o_name}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-2"
        autoComplete="off"
      >
        {/* name */}
        <label className="form-control w-full">
          <div className="label">
            <span
              className={twMerge("label-text", errors.o_name && "text-error")}
            >
              {errors.o_name
                ? "Enter valid organizer name"
                : "Edit organizer name"}
            </span>
          </div>
          <input
            type="text"
            placeholder="Enter organizer name"
            className={twMerge(
              "input input-bordered w-full",
              errors.o_name && "input-error"
            )}
            {...register("o_name", {
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
              className={twMerge("label-text", errors.o_email && "text-error")}
            >
              {errors.o_email
                ? "Enter valid event email"
                : "Edit organizer email"}
            </span>
          </div>
          <input
            type="text"
            placeholder="Enter your email"
            className={twMerge(
              "input input-bordered w-full",
              errors.o_email && "input-error"
            )}
            {...register("o_email", {
              required: true,
              minLength: 3,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            disabled={isPending}
          />
        </label>
        <button disabled={isPending} type="submit" className="btn btn-outline">
          {isPending && <span className="loading loading-spinner" />}
          Save
        </button>
      </form>
    </Modal>
  );
};

export default EditOrganizerModal;

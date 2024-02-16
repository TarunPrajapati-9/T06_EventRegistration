/* eslint-disable @next/next/no-img-element */
"use client";

import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { Organizer } from "@prisma/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import type { ParsedEventType } from "@/utils/types";
import { UploadButton } from "@/utils/uploadthing";
import trpc from "@/app/_trpc/client";
import useModal from "@/hooks/useModal";

import Modal from "./Modal";

type Props = {
  event: ParsedEventType;
  organizer: Organizer | null;
};
type FormSchema = {
  event_description: string;
  event_name: string;
  canvas_image: string;
  event_date: string;
  reg_fees: number;
  hosted_by: string;
  event_capacity: number;
};

const EditEventModal = ({ event, organizer }: Props) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormSchema>({
    defaultValues: {
      event_description: event.event_description,
      event_name: event.event_name,
      event_date: event.event_date,
      reg_fees: event.reg_fees,
      canvas_image: event.canvas_image,
      hosted_by: organizer?.o_name ?? "Not available",
      event_capacity: event.event_capacity,
    },
  });
  const { mutate, isPending } = trpc.events.editEvent.useMutation();
  const { closeModal } = useModal();
  const imgUrl = watch("canvas_image");
  function onSubmit(value: FormSchema) {
    mutate(
      {
        id: event.id,
        event_description: value.event_description,
        event_name: value.event_name,
        event_date: value.event_date,
        reg_fees: Number(value.reg_fees),
        canvas_image: value.canvas_image,
        event_capacity: Number(value.event_capacity),
        organizer_id: event.organizer_id,
      },
      {
        onSuccess(data) {
          if (data) {
            toast.success("Event edited successfully");
            router.refresh();
            closeModal();
          } else {
            toast.error("Failed to edit event");
          }
        },
        onError(error) {
          toast.error(error.message);
        },
      }
    );
  }
  return (
    <Modal type={`event-edit-${event.id}`} className="overflow-y-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col md:flex-row flex-wrap"
      >
        <div className="grid flex-1">
          <h1 className="text-4xl font-bold">Edit Event</h1>
          <div className="mt-8">
            <h1 className="text-xl text-gray-500 font-bold">
              Organized By:{" "}
              <span className="font-bold text-gray-800">
                {organizer?.o_name}
              </span>
            </h1>
            <div className="mt-6 p-2 flex flex-col gap-4">
              {/* name */}
              <label className="form-control w-full">
                <div className="label">
                  <span
                    className={twMerge(
                      "label-text",
                      errors.event_name && "text-error"
                    )}
                  >
                    {errors.event_name
                      ? "Enter valid event name"
                      : "Edit event name"}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Enter your email"
                  className={twMerge(
                    "input input-bordered w-full",
                    errors.event_name && "input-error"
                  )}
                  {...register("event_name", {
                    required: true,
                    minLength: 3,
                  })}
                  disabled={isPending}
                />
              </label>
              {/* fees */}
              <label className="form-control w-full">
                <div className="label">
                  <span
                    className={twMerge(
                      "label-text",
                      errors.reg_fees && "text-error"
                    )}
                  >
                    {errors.reg_fees
                      ? "Enter valid number"
                      : "Edit event registration fees"}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Enter your email"
                  className={twMerge(
                    "input input-bordered w-full",
                    errors.reg_fees && "input-error"
                  )}
                  {...register("reg_fees", {
                    required: true,
                  })}
                  disabled={isPending}
                />
              </label>
              {/* date */}
              <label className="form-control w-full">
                <div className="label">
                  <span
                    className={twMerge(
                      "label-text",
                      errors.event_date && "text-error"
                    )}
                  >
                    {errors.event_date ? "Enter valid date" : "Edit event date"}
                  </span>
                </div>
                <input
                  type="date"
                  className={twMerge(
                    "input input-bordered w-full",
                    errors.event_date && "input-error"
                  )}
                  {...register("event_date", {
                    required: true,
                  })}
                  disabled={isPending}
                />
              </label>
              {/* desc */}
              <label className="form-control w-full">
                <div className="label">
                  <span
                    className={twMerge(
                      "label-text",
                      errors.event_description && "text-error"
                    )}
                  >
                    {errors.event_description
                      ? "Enter valid description"
                      : "Edit event description"}
                  </span>
                </div>
                <textarea
                  placeholder="Enter your email"
                  className={twMerge(
                    "textarea textarea-bordered resize-none w-full h-[100px]",
                    errors.event_description && "input-error"
                  )}
                  {...register("event_description", {
                    required: true,
                    minLength: 30,
                  })}
                  disabled={isPending}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="grid h-full flex-1 p-4 flex-grow rounded-box place-items-center">
          <img
            src={imgUrl}
            alt={event.event_name}
            className="h-[400px] w-[560px] object-cover rounded-box pointer-events-none"
          />
          <UploadButton
            endpoint="imageUploader"
            className="w-full mt-4 btn no-animation border-0 cursor-default"
            onClientUploadComplete={(res) => {
              toast.success(`Image uploaded with size ${res[0].size}kb`);
              setValue("canvas_image", res[0].url);
            }}
            onUploadError={(err) => {
              toast.error(err.message);
            }}
          />
          {/* capacity */}
          <label className="form-control w-full">
            <div className="label">
              <span
                className={twMerge(
                  "label-text",
                  errors.event_capacity && "text-error"
                )}
              >
                {errors.event_capacity
                  ? "Enter valid capacity"
                  : "Edit event capacity"}
              </span>
            </div>
            <input
              type="number"
              placeholder="Enter event capacity"
              className={twMerge(
                "input input-bordered w-full",
                errors.event_capacity && "input-error"
              )}
              {...register("event_capacity", {
                required: true,
                max: 10000,
              })}
              disabled={isPending}
            />
          </label>
          <button className="btn w-full mt-4" disabled={isPending}>
            {isPending && <span className="loading loading-spinner" />}
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditEventModal;

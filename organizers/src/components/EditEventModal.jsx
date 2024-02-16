/* eslint-disable react/prop-types */
"use client";

import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useModal from "../../hooks/useModal";

import Modal from "./Modal";
import { editEvent } from "../utils/dataPoster";
import supabase from "../utils/supabase";

const EditEventModal = ({ event, refetch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      event_description: event.event_description,
      event_name: event.event_name,
      event_date: event.event_date.split("T")[0],
      reg_fees: event.reg_fees,
      canvas_image: event.canvas_image,
      event_capacity: event.event_capacity,
    },
  });
  const [loading, setLoading] = useState(false);
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: editEvent,
    onSuccess: async (data) => {
      if (data) {
        toast.success("Event edited successfully");
        await refetch();
        closeModal();
      } else {
        toast.error("Please login to continue");
        navigate("/signin");
      }
    },
  });
  async function onSubmit(value) {
    mutate({
      _id: {
        $oid: event._id,
      },
      event_name: value.event_name,
      canvas_image: value.canvas_image,
      organizer_id: event.organizer_id,
      event_description: value.event_description,
      event_date: {
        $date: new Date(value.event_date).toISOString(),
      },
      reg_fees: parseFloat(value.reg_fees),
      event_capacity: parseInt(value.event_capacity),
    });
    setLoading(false);
  }
  async function handleFileUpload(e) {
    setLoading(true);

    const file = e?.target.files[0];
    const prevFileName =
      event.canvas_image.split("/")[event.canvas_image.split("/").length - 1];
    await supabase.storage
      .from("canvas")
      .remove([prevFileName])
      .then(() => {
        toast.success("Previous image deleted successfully");
      })
      .catch(() => {
        toast.error("Previous image deletion failed");
      });
    const fileName = file.name
      .replace(/\s+/g, "-")
      .toLowerCase()
      .concat(`-${Date.now()}`);
    await supabase.storage
      .from("canvas")
      .upload(fileName, file)
      .then(() => {
        toast.success("Image uploaded successfully");
      })
      .catch(() => {
        toast.error("Image upload failed");
      });
    const url = supabase.storage.from("canvas").getPublicUrl(fileName)
      .data.publicUrl;
    setValue("canvas_image", url);
    setLoading(false);
  }
  const imgUrl = watch("canvas_image");
  return (
    <Modal type={`event-edit-${event._id}`} className="overflow-y-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col md:flex-row flex-wrap"
      >
        <div className="grid flex-1">
          <h1 className="text-4xl font-bold">Edit Event</h1>
          <div className="mt-8">
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
                  disabled={isPending || loading}
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
                  type="number"
                  placeholder="Enter your email"
                  className={twMerge(
                    "input input-bordered w-full",
                    errors.reg_fees && "input-error"
                  )}
                  {...register("reg_fees", {
                    required: true,
                  })}
                  disabled={isPending || loading}
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
                  placeholder="Enter your email"
                  className={twMerge(
                    "input input-bordered w-full",
                    errors.event_date && "input-error"
                  )}
                  {...register("event_date", {
                    required: true,
                  })}
                  disabled={isPending || loading}
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
                  disabled={isPending || loading}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="grid h-full flex-1 p-4 rounded-box place-items-center">
          <img
            src={imgUrl}
            alt={event.event_name}
            className="h-[400px] w-[560px] object-cover rounded-box pointer-events-none"
          />
          <input
            {...register("canvas_image")}
            type="file"
            className={twMerge(
              "file-input w-full mt-4",
              errors.canvas_image && "input-error"
            )}
            disabled={isPending || loading}
            onChange={handleFileUpload}
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
                {errors.reg_fees ? "Enter valid number" : "Edit event capacity"}
              </span>
            </div>
            <input
              type="number"
              placeholder="Enter event capacity"
              className={twMerge(
                "input input-bordered w-full",
                errors.reg_fees && "input-error"
              )}
              {...register("event_capacity", {
                required: true,
              })}
              disabled={isPending || loading}
            />
          </label>
          <button
            type="submit"
            className="btn w-full mt-4"
            disabled={isPending || loading}
          >
            {isPending && <span className="loading loading-spinner" />}
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditEventModal;

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import supabase from "../utils/supabase";
import { createEvent } from "../utils/dataPoster";

const CreateEvent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      event_name: "",
      canvas_image: "",
      event_description: "",
      event_date: "",
      reg_fees: "",
      event_capacity: 0,
    },
  });
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      toast.success("Event created successfully");
      navigate("/");
    },
    onError: () => {
      toast.error("Please login to continue");
      navigate("/signin");
    },
  });

  const onSubmit = async (formData) => {
    const file = formData.canvas_image[0];
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
    const data = {
      event_name: formData.event_name,
      canvas_image: url,
      organizer_id: null,
      event_description: formData.event_description,
      event_date: { $date: new Date(formData.event_date).toISOString() },
      reg_fees: parseFloat(formData.reg_fees),
      event_capacity: parseInt(formData.event_capacity),
    };
    mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-[70%] flex flex-col items-center justify-center gap-y-6 rounded-sm shadow-lg p-10 ">
          <img
            src="/images/event.png"
            alt="logo"
            className="pointer-events-none"
            height={100}
            width={300}
          />
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">
                {errors.event_name ? (
                  <span className="text-red-500 ">Enter valid event name</span>
                ) : (
                  "Event title"
                )}
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter title of the Event"
              className="input input-bordered w-full"
              {...register("event_name", {
                required: "Title is required",
              })}
              disabled={isPending}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">
                {errors.event_date ? (
                  <span className="text-red-500 ">Select event date</span>
                ) : (
                  "Event date"
                )}
              </span>
            </div>
            <input
              type="date"
              placeholder="Enter date of the event"
              className="input input-bordered w-full"
              {...register("event_date", {
                required: "Date is required",
              })}
              disabled={isPending}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">
                {errors.event_description ? (
                  <span className="text-red-500 ">
                    Enter valid event description
                  </span>
                ) : (
                  "Event description"
                )}
              </span>
            </div>
            <textarea
              type="text"
              placeholder="Enter description of the event"
              className="textarea textarea-bordered w-full resize-none"
              {...register("event_description", {
                required: "Event Description is required",
              })}
              disabled={isPending}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">
                {errors.reg_fees ? (
                  <span className="text-red-500 ">
                    Enter valid registration fees
                  </span>
                ) : (
                  "Event registration fees"
                )}
              </span>
            </div>
            <input
              type="number"
              name="reg_fees"
              placeholder="Enter registration fees"
              className="input input-bordered w-full"
              {...register("reg_fees", {
                required: "Price is required",
              })}
              disabled={isPending}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">
                {errors.event_capacity ? (
                  <span className="text-red-500 ">
                    Enter valid event capacity
                  </span>
                ) : (
                  "Event capacity"
                )}
              </span>
            </div>
            <input
              type="number"
              placeholder="Enter registration fees"
              className="input input-bordered w-full"
              {...register("event_capacity", {
                required: true,
              })}
              disabled={isPending}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">
                {errors.canvas_image ? (
                  <span className="text-red-500 ">Upload event image</span>
                ) : (
                  "Event image"
                )}
              </span>
            </div>
            <input
              type="file"
              name="canvas_image"
              placeholder="Enter registration fees"
              className="file-input file-input-bordered w-full"
              {...register("canvas_image", {
                required: "Image is required",
              })}
              disabled={isPending}
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isPending}
          >
            {isPending && <span className="loading loading-spinner" />}
            Create
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateEvent;

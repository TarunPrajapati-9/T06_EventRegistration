import axios from "axios";

export async function isValidUser() {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_URI}/organizer/create_event`,
    null,
    {
      headers: {
        "API-Key": import.meta.env.VITE_HEADER_SECRET,
      },
    }
  );
  if (data && data.detail.status == true) return true;
  else return false;
}

export async function getEvents() {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URI}/organizer/view_event`,
    {
      headers: {
        "API-Key": import.meta.env.VITE_HEADER_SECRET,
        token: localStorage.getItem("eventify_organizer_token") ?? "",
      },
    }
  );
  return data.detail.events;
}

export async function getParticipants({ id }) {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URI}/organizer/view_participant/${id}`,
    {
      headers: {
        "API-Key": import.meta.env.VITE_HEADER_SECRET,
        token: localStorage.getItem("eventify_organizer_token") ?? "",
      },
    }
  );
  console.log(data);
  return data.detail.participants ?? [];
}

import axios from "axios";

export async function signIn(params) {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_URI}/organizer/login`,
    params,
    {
      headers: {
        "API-Key": import.meta.env.VITE_HEADER_SECRET,
      },
    }
  );
  return data;
}

export async function createEvent(params) {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/organizer/create_event`,
      params,
      {
        headers: {
          "API-Key": import.meta.env.VITE_HEADER_SECRET,
          token: localStorage.getItem("eventify_organizer_token") ?? "",
        },
      }
    );
    if (data && data.detail.status == true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export async function editEvent(params) {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URI}/organizer/edit_event`,
      params,
      {
        headers: {
          "API-Key": import.meta.env.VITE_HEADER_SECRET,
          token: localStorage.getItem("eventify_organizer_token") ?? "",
        },
      }
    );
    if (data.detail.status) return true;
    else return false;
  } catch (error) {
    return false;
  }
}

export async function deleteEvent({ id }) {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_URI}/organizer/delete_event/${id}`,
      {
        headers: {
          "API-Key": import.meta.env.VITE_HEADER_SECRET,
          token: localStorage.getItem("eventify_organizer_token") ?? "",
        },
      }
    );
    if (data.detail.status) return true;
    else return false;
  } catch (error) {
    return false;
  }
}

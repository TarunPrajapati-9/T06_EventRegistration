import axios from "axios";

export async function getParticipant() {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/participant/view_participant`,
        {
            headers: {
                "API-Key": import.meta.env.VITE_HEADER_SECRET,
                token: localStorage.getItem("participant_token") ?? "",
            },
        })
    return data.detail.participant;
}

export async function getEvents() {
    const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/participant/view_events`,
        {
            headers: {
                "API-Key": import.meta.env.VITE_HEADER_SECRET,
                token: localStorage.getItem("participant_token") ?? "",
            },
        }
    );
    return data.data;
}

export async function getSingleEvent({ id }) {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/participant/view_event/${id}`,
        {
            headers: {
                "API-Key": import.meta.env.VITE_HEADER_SECRET,
                token: localStorage.getItem("participant_token") ?? "",
            }
        }
    );
    return data.detail.event;
}

export async function eventRegistration({ id }) {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/participant/event_register/${id}`,
        {
            headers: {
                "API-Key": import.meta.env.VITE_HEADER_SECRET,
                token: localStorage.getItem("participant_token") ?? "",
            }
        }
    )
    console.log(data.detail);
    return data.detail;
}

export async function getRegisteredEvents() {
    const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/participant/view_registered_event`,
        {
            headers: {
                "API-Key": import.meta.env.VITE_HEADER_SECRET,
                token: localStorage.getItem("participant_token") ?? "",
            }
        }
    )
    console.log(data.detail.events);
    return data.detail.events;
}
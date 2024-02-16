import axios from "axios";

export async function signUp(params) {
    const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/participant/register_participant`,
        params, {
        headers: {
            "API-Key": import.meta.env.VITE_HEADER_SECRET,
        }
    })
    console.log(data);
    return data;
}

export async function signIn(params) {
    const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/participant/login`,
        params,
        {
            headers: {
                "API-Key": import.meta.env.VITE_HEADER_SECRET,
            },
        }
    );
    return data;
}
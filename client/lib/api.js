import axios from "axios";

const api = async ({url, method, body, signal = null}) => {
    const token = localStorage.getItem("token");
    const request = {
        url: import.meta.env.VITE_SERVER_ENDPOINT + url,
        method,
        data: body,
        headers: {
            Authorization : `Bearer ${token}`
        },
        signal
    }   
    return await axios(request);
}

export default api;
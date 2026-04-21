import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // ⏱ prevent hanging requests
  headers: {
    "Content-Type": "application/json"
  }
})

/* 🔐 ATTACH TOKEN AUTOMATICALLY */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("venex_token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* 🚨 GLOBAL ERROR HANDLER (OPTIONAL DEBUG) */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR:", error?.response || error.message)

    return Promise.reject(error)
  }
)

export default api
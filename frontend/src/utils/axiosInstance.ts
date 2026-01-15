import axios, { AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL; // Usa VITE_API_URL en tu .env
const axiosInstance = axios.create({
  baseURL, // No agregues "http://" ni el puerto si ya está en la variable
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 600000,
});

// Interceptor para agregar el token a las solicitudes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Obtén el token del localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Agrega el token al header Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función para manejar configuraciones personalizadas
function customRequest(
  configOrUrl: string | AxiosRequestConfig,
  additionalConfig: AxiosRequestConfig = {}
) {
  let finalConfig: AxiosRequestConfig;

  if (typeof configOrUrl === "string") {
    // Si es un string, usar configuración predeterminada
    finalConfig = {
      url: configOrUrl,
      method: "post", // Método predeterminado
      data: {}, // Payload vacío por defecto
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 600000, // Tiempo de espera predeterminado
      ...additionalConfig, // Configuración adicional
    };
  } else {
    // Si es un objeto, hacer merge entre la configuración inicial y la proporcionada
    finalConfig = {
      ...configOrUrl,
      ...additionalConfig,
    };
  }

  // Realizar la solicitud con la configuración final
  return axiosInstance.request(finalConfig);
}

export { axiosInstance, customRequest };

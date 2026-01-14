// filepath: /Users/plomochavez/Documents/GitHub/delfaro/frontend/src/utils/apiRequest.ts
import {
  showErrorMessage,
  showSuccessMessage,
} from "@/components/apps/sweetAlerts/SweetAlets";

export const apiRequest = async (params = {}) => {
  const {
    url = null,
    method = "POST",
    payload = {},
    headers = {}, // Agregar soporte para headers personalizados
    onSuccess = null,
    onError = null,
    showMessages = true,
  }: any = params;

  try {
    if (!url) {
      console.log("Falta URL en la solicitud API");
      return;
    }
    const response = await customRequest({
      url,
      method: method,
      data: payload,
      headers: headers, // Pasar los headers personalizados
    });
    const dataResponse = response.data;

    if (dataResponse.result) {
      if (showMessages) {
        console.log(dataResponse);
        showSuccessMessage({
          title: "Éxito",
          message: dataResponse.message ?? "Operación realizada con éxito.",
        });
      }
      if (typeof onSuccess === "function") {
        onSuccess(dataResponse.data);
      }
    } else {
      showErrorMessage({
        title: "Error",
        message: dataResponse.message,
      });
      if (onError) {
        onError(dataResponse.message);
      }
    }
  } catch (error: any) {
    showErrorMessage({
      title: "Error",
      message: error?.message || "Error de conexión",
    });
    if (onError) {
      onError(error);
    }
  }
};

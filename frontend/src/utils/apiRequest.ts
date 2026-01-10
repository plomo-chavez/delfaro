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
    onSuccess = null,
    onError = null,
    showMessages = true,
  }: any = params;

  try {
    if (!url) {
      console.error("Falta URL en la solicitud API");
      return;
    }
    console.log(`API Request - Payload:`, payload);
    const response = await customRequest({
      url,
      method: method,
      data: payload,
    });
    const dataResponse = response.data;

    if (dataResponse.result) {
      if (typeof onSuccess === "function") {
        onSuccess(dataResponse.data);
      } else {
        if (showMessages) {
          showSuccessMessage({
            title: "Éxito",
            message: dataResponse.message ?? "Operación realizada con éxito.",
          });
        }
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

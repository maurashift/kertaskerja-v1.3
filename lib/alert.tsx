import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";

/* base alert options */
type BaseAlertOptions = {
  title: string;
  text?: string;
  icon?: SweetAlertIcon;
};

/* alert notification */
type AlertNotificationOptions = BaseAlertOptions & {
  timer?: number;
  showConfirmButton?: boolean;
};

export const AlertNotification = (
  title?: string,
  text: string = "",
  icon: SweetAlertIcon = "info",
  timer: number = 2000,
  showConfirmButton = false,
): Promise<SweetAlertResult> => {
  return Swal.fire({
    title,
    text,
    icon,
    timer,
    showConfirmButton,
  });
};

/* alert question */
type AlertQuestionOptions = BaseAlertOptions & {
  confirmButtonText?: string;
  cancelButtonText?: string;
};

export const AlertQuestion = (
  title: string,
  text?: string,
  icon: SweetAlertIcon = "question",
  confirmButtonText = "Ya",
  cancelButtonText = "Batal"
): Promise<SweetAlertResult> => {
  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });
};

export const AlertQuestion2 = (
  title?: string,
  text: string = "",
  icon: SweetAlertIcon = "question",
  confirmButtonText = "Ya",
  cancelButtonText = "Batal",
): Promise<SweetAlertResult> => {
  return Swal.fire({
    title,
    text,
    icon,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#08C2FF",
    cancelButtonColor: "#DA415B",
    reverseButtons: true,
  });
};
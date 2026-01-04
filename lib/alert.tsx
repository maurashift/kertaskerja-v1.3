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
  options: AlertNotificationOptions
): Promise<SweetAlertResult> => {
  const {
    title,
    text = "",
    icon = "info",
    timer = 2000,
    showConfirmButton = false,
  } = options;

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
  options: AlertQuestionOptions
): Promise<SweetAlertResult> => {
  const {
    title,
    text = "",
    icon = "question",
    confirmButtonText = "Ya",
    cancelButtonText = "Batal",
  } = options;

  return Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#2F2F30",
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });
};

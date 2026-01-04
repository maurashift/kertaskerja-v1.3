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
export const AlertQuestion2 = (
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
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: "#08C2FF",
    cancelButtonColor: "#DA415B",
    reverseButtons: true,
  });
};
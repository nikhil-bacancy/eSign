import { toast } from "react-toastify";

const options = {
    autoClose: 1500,
    className: '',
    position: toast.POSITION.TOP_RIGHT,
};

export const toastSuccess = (message, optionsData = null) => {
    toast.success(message, optionsData ? optionsData : options);
};

export const toastError = (message, optionsData = null) => {
    toast.error(message, optionsData ? optionsData : options);
};

export const toastDefault = (message, optionsData = null) => {
    toast.warn(message, optionsData ? optionsData : options);
};
let toastRef = null;

export const setGlobalToast = (fn) => {
  toastRef = fn;
};

export const showToast = (msg) => {
  if (toastRef) toastRef(msg);
};

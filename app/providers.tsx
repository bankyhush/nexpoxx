"use client"; // This is needed because react-hot-toast uses client-side features

import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "",
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
        },

        // Default options for specific types
        success: {
          duration: 3000,
          iconTheme: {
            primary: "green",
            secondary: "black",
          },
        },
        error: {
          duration: 4000,
        },
      }}
    />
  );
};

export default ToastProvider;
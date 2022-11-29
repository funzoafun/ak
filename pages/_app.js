import React from "react";
import { Provider } from "react-redux";

import "../styles/globals.css";

import { Layout } from "../components";
import store from "../context";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;

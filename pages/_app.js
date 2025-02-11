import { Provider } from "react-redux";
import store from "./store";
import { SessionProvider } from "next-auth/react"; // Import SessionProvider

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
    </SessionProvider>
  );
}

export default MyApp;

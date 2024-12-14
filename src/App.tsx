import RootApp from "./routes/RootApp";
import { Provider } from "react-redux";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { persistor, store } from "./redux";
import "../src/utils/prototype";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <ToastContainer />
        <div>
          <RootApp />
        </div>
      </Provider>
    </PersistGate>
  );
}

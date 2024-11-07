import { configureStore } from "@reduxjs/toolkit";
import CartReducer, { loadCart, saveCartMiddleware } from "./CartReducer";

const store = configureStore({
    reducer: {
        cart: CartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(saveCartMiddleware),
});

store.dispatch(loadCart());

export default store;

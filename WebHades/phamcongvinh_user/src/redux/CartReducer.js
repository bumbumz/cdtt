
import { createSlice } from "@reduxjs/toolkit";

export const CartReducer = createSlice({
    name: "cart",
    initialState: {
        cart: [],
        flag: true,
    },
    reducers: {
        addToCart: (state, action) => {
            const itemPresent = state.cart.find(
                (item) => item.id === action.payload.id
            );
            const stockQuantity = action.payload.qty;
            if (itemPresent) {
                if (itemPresent.quantity < stockQuantity) {
                    itemPresent.quantity++;
                } else {
                    state.flag = false;
                }
            } else {
                state.cart.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            const removeItem = state.cart.filter(
                (item) => item.id !== action.payload.id
            );
            state.cart = removeItem;
        },
        incementQuantity: (state, action) => {
            const itemPresent = state.cart.find(
                (item) => item.id === action.payload.id
            );
            const stockQuantity = action.payload.qty;

            if (itemPresent && itemPresent.qty > stockQuantity) {
                itemPresent.quantity++;
            } else {
                state.flag = false;
            }
        },
        decrementQuantity: (state, action) => {
            const itemPresent = state.cart.find(
                (item) => item.id === action.payload.id
            );
            if (itemPresent) {
                if (itemPresent.quantity === 1) {
                    const removeItem = state.cart.filter(
                        (item) => item.id !== action.payload.id
                    );
                    state.cart = removeItem;
                } else {
                    itemPresent.quantity--;
                }
            }
        },
        cleanCart: (state) => {
            state.cart = [];
        },
        setCart: (state, action) => {
            state.cart = action.payload;
        },
    },
});

export const loadCart = () => async (dispatch) => {
    try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            dispatch(setCart(JSON.parse(cartData)));
        }
    } catch (error) {
        console.error("Failed to load cart", error);
    }
};

export const saveCart = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error("Failed to save cart", error);
    }
};

export const saveCartMiddleware = (store) => (next) => (action) => {
    const result = next(action);

    if (
        action.type === "cart/addToCart" ||
        action.type === "cart/removeFromCart" ||
        action.type === "cart/incementQuantity" ||
        action.type === "cart/decrementQuantity" ||
        action.type === "cart/cleanCart"
    ) {
        saveCart(store.getState().cart.cart);
    }

    return result;
};

export const { addToCart, removeFromCart, incementQuantity, decrementQuantity, cleanCart, setCart } = CartReducer.actions;

export default CartReducer.reducer;

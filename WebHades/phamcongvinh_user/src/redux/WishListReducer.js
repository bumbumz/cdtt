// import { createSlice } from "@reduxjs/toolkit";

// export const WishListReducer = createSlice({
//     name: "wishlist",
//     initialState: {
//         wishlist: [],
//         addToWishListStatus: null,
//     },
//     reducers: {
//         addToWishList: (state, action) => {
//             const itemPresent = state.wishlist.find(
//                 (item) => item.colorId === action.payload.colorId
//             );
//             if (!itemPresent) {
//                 state.wishlist.push({ ...action.payload });
//                 state.addToWishListStatus = true;
//             } else {
//                 state.addToWishListStatus = false;

//             }
//         },
//         removeFromWishList: (state, action) => {
//             const removeItem = state.wishlist.filter(
//                 (item) => item.colorId !== action.payload.colorId
//             );
//             state.wishlist = removeItem;
//         },

//         cleanWishList: (state) => {
//             state.wishlist = [];
//         }
//     },
// });


// export const { addToWishList, removeFromWishList, cleanWishList } = WishListReducer.actions;

// export default WishListReducer.reducer


// // import { createSlice } from "@reduxjs/toolkit";
// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // const saveWishlistToStorage = async (wishlist) => {
// //     try {
// //         await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
// //     } catch (error) {
// //         console.log("Lỗi khi lưu wishlist vào AsyncStorage", error);
// //     }
// // };

// // export const WishListReducer = createSlice({
// //     name: "wishlist",
// //     initialState: {
// //         wishlist: [],
// //         addToWishListStatus: null,
// //     },
// //     reducers: {
// //         addToWishList: (state, action) => {
// //             const itemPresent = state.wishlist.find(
// //                 (item) => item.colorId === action.payload.colorId
// //             );
// //             if (!itemPresent) {
// //                 state.wishlist.push({ ...action.payload });
// //                 state.addToWishListStatus = true;
// //                 const token = AsyncStorage.getItem("authToken", token);
// //                 if (token) {
// //                     saveWishlistToStorage(state.wishlist);
// //                 }
// //             } else {
// //                 state.addToWishListStatus = false;
// //             }
// //         },
// //         removeFromWishList: (state, action) => {
// //             const removeItem = state.wishlist.filter(
// //                 (item) => item.colorId !== action.payload.colorId
// //             );
// //             state.wishlist = removeItem;

// //             saveWishlistToStorage(state.wishlist);
// //         },
// //         cleanWishList: (state) => {
// //             state.wishlist = [];
// //             AsyncStorage.removeItem('wishlist');
// //         }
// //     },
// // });

// // export const { addToWishList, removeFromWishList, cleanWishList } = WishListReducer.actions;

// // export default WishListReducer.reducer;


import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './../layout/Home';
import DetailProduct from '../layout/DetailProduct';
import Login from '../layout/Login';
import ProductAll from '../layout/ProductAll';
import OderDetail from '../layout/OderDetail';
import CartList from '../layout/CartList';
import Tops from './Tops';
import Bottoms from './Bottoms';
import OrderHistory from '../layout/OrderHistory';
import Register from '../layout/Register';
import EditProfile from '../layout/EditProfile';

const Main = () => (
    <main>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/detail-product" element={<DetailProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/productAll" element={<ProductAll />} />
            <Route path="/cartList" element={<CartList />} />
            <Route path="/OderDetail" element={<OderDetail />} />
            <Route path="/tops" element={<Tops />} />
            <Route path="/bottoms" element={<Bottoms />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/edit" element={<EditProfile />} />



            
            



            Tops
        </Routes>
    </main>
);

export default Main;
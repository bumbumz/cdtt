import React, { useEffect } from 'react';
import Menu from './components/Menu';
import TopNav from './components/TopNav';
import { Outlet } from 'react-router-dom';
import AdminProductBox from './scenes/Product/AdminProductBox';
import AdminStatsTable from './scenes/Product/AdminStatsTable'
import Header from './components/Header';
export default function Admin() {
    useEffect(() => {
        const ss = document.createElement("link");
        ss.rel = "stylesheet";
        ss.type = "text/css";
        ss.href = "/admin/dist/css/adminlte.min.css";
        document.head.appendChild(ss);

        return () => {
            document.head.removeChild(ss);
        };
    }, []);

    return (
        <div className="wrapper flex flex-col h-screen">

            <TopNav />
            <div className="flex flex-1">
               
                <Menu />
                <div className="flex-1 w-full bg-gray-900">

                    {/* Main Content */}
                    <section className="">
                        <div className=" ">
                            <div className="flex flex-col">
                                <Header/>
                                <Outlet />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

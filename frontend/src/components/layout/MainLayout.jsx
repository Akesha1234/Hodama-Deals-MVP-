import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="layout-wrapper">
            <Header />
            <main className="layout-main page-fade-in">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;

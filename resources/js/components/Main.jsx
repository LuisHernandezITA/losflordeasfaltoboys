import React from "react";
import ListCard from "./ListCard";
import Menu from "./Menu";
import { Routes, Route, Navigate } from "react-router-dom";
import Login_B from "./Login_B";
import Cart from "./Cart";
import Product from "./Product";
import Crud from "./Crud";
import CrudCategory from "./CrudCategory";
import CrudBanner from "./CrudBanner";
import CrudMusic from "./CrudMusic";
import MusicBlog from "./MusicBlog";
import CrudEvents from "./CrudEvents";
import EventView from "./EventView";
import BlogView from "./BlogView";
import CrudBlogs from "./CrudBlogs";
import AvisoLegal from "./AvisoLegal";
import AboutUs from "./AboutUs";
import CrudGallery from "./CrudGallery";
import CrudUsers from "./CrudUsers";

function Main() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Menu />}>
                    <Route path="item/:id" element={<Product />} />
                    <Route path="events/:id" element={<EventView />} />
                    <Route path="about-us" element={<AboutUs />} />
                    <Route path="legal-notice" element={<AvisoLegal />} />
                    <Route path="blog" element={<BlogView />} />
                    <Route path="crudusers" element={<CrudUsers />} />
                    <Route path="crudgallery" element={<CrudGallery />} />
                    <Route path="crudblogs" element={<CrudBlogs />} />
                    <Route path="crudproducts" element={<Crud />} />
                    <Route path="crudevents" element={<CrudEvents />} />
                    <Route path="crudcategories" element={<CrudCategory />} />
                    <Route path="crudbanners" element={<CrudBanner />} />
                    <Route path="crudsongs" element={<CrudMusic />} />
                    <Route path="store" element={<ListCard />} />
                    <Route path="gallery" element={<MusicBlog />} />
                    <Route path="login" element={<Login_B />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                </Route>
            </Routes>
        </>
    );
}

export default Main;

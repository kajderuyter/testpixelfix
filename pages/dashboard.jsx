import React from "react";
import { withRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Header from "./components/Header";
import Main from "./components/Main"
import NavImage from "/public/images/navimage.png"


function Dashboard({ router }) {
    const [page, setPage] = useState('pixel')
    return(
        <>
            <Header name={router.query.store_name} />
            <div className="container">
                <nav>
                    <ul>
                        <li>
                            <a className={page === 'pixel' ? 'active' : ''} onClick={() => {
                                setPage('pixel')
                            }}>Connect Pixel</a>
                        </li>
                        <li>
                            <a className={page === 'info' ? 'active' : ''} onClick={() => {
                                setPage('info')
                            }}>Your License</a>
                        </li>
                        <li>
                            <a className={page === 'whyus' ? 'active' : ''} onClick={() => {
                                setPage('whyus')
                            }}>Why choose us</a>
                        </li>
                        <li>
                            <a className={page === 'contact' ? 'active' : ''} onClick={() => {
                                setPage('contact')
                            }}>Contact us</a>
                        </li>
                        <li>
                            <a className={page === 'faq' ? 'active' : ''} onClick={() => {
                                setPage('faq')
                            }}>FAQ</a>
                        </li>
                    </ul>
                    <Image src={NavImage} alt='navimage'/>
                </nav>
                <Main page={page} access_token={router.query.access_token}/>
            </div>
        </>
    )
}

export default withRouter(Dashboard)
import React from "react";
import { withRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Header from "./components/Header";
import Main from "./components/Main"
import NavImage from "/public/images/navimage.png"


function Dashboard({ router }) {
    const [page, setPage] = useState('pixelid')
    return(
        <>
            <Header name={router.query.store_name} />
            <div className="container">
                <nav>
                    <ul>
                        <li>
                            <a className={page === 'pixelid' ? 'active' : ''} onClick={() => {
                                setPage('pixelid')
                            }}>Connect Pixel</a>
                        </li>
                        <li>
                            <a className={page === 'pixelac' ? 'active' : ''} onClick={() => {
                                setPage('pixelac')
                            }}>Pixel Access Code</a>
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
                    </ul>
                    <Image src={NavImage} alt='navimage'/>
                </nav>
                <Main page={page} access_token={router.query.access_token}/>
            </div>
        </>
    )
}

export default withRouter(Dashboard)
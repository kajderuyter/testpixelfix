import React from "react";
import { withRouter } from "next/router";
import { useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main"


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
                            <a className={page === 'test3' ? 'active' : ''} onClick={() => {
                                setPage('test3')
                            }}>Test 3</a>
                        </li>
                    </ul>
                </nav>
                <Main page={page} access_token={router.query.access_token}/>
            </div>
        </>
    )
}

export default withRouter(Dashboard)
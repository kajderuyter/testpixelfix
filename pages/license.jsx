import React from 'react'
import Header from './components/Header.jsx'
import LicenseMain from './components/LicenseMain'
import logo from '../public/logo.png'

function LicensePage(props) {
    return (
        <>
            <Header logo={logo}/>
            <LicenseMain />
        </>
    )
}

export default LicensePage
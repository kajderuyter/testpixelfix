import React from 'react'
import Image from 'next/image'
import logo from '../../public/assets/images/logo.png'

function Header(props) {
    return (
        <header>
            <div className='header-brand'><Image src={logo} alt="logo" width={250} height={75}/></div>
            <div className='header-store-wrapper'>
                <h2 className='header-store-name'>{props.name ? props.name.split('.myshopify.com')[0] : ''}</h2>
            </div>
        </header>
    )
}

export default Header
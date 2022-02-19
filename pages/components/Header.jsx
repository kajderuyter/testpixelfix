import React from 'react'
import Image from 'next/image'

function Header(props) {
    return (
        <header>
            <div className='header-brand'><Image src={props.logo} alt="logo" width={250} height={75}/><img src={'/logo.png'} alt='LOGO' /></div>
            <div className='header-store-wrapper'>
                <h2 className='header-store-name'>{props.name ? props.name.split('.myshopify.com')[0] : ''}</h2>
            </div>
        </header>
    )
}

export default Header
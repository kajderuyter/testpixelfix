import { useState, useEffect } from 'react'
import Pixel from './Pixel'
import WhyUs from './WhyUs'
import Contact from './Contact'
import Faq from './Faq'
import Info from './Info.jsx'

export default function Main(props) {

    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [accessToken, setAccessToken] = useState(props.access_token)
    const [pixelId, setPixelId] = useState('')
    
    useEffect(() => {
        getPixelId()
        getData()
    })

    const getData = async () => {
        const config = {
            method: 'GET',
            headers: {
                'X-shopify-key': accessToken
            }
        }
        const data = await fetch('https://tiktok-api-fix-backend.herokuapp.com/api/store', config)
        .then(response => response.json())
        .catch(err => console.log(err))
        setName(data.store_name)
        setUrl(data.store_url)
    }

    const getPixelId = async () => {
        const config = {
            method: 'GET',
            headers: {
                'X-shopify-key': accessToken
            }
        }
        const data = await fetch('https://tiktok-api-fix-backend.herokuapp.com/api/tiktok/pixel', config)
        .then(response => response.json())
        .catch(err => console.log(err))
        setPixelId(data.pixel_id)
    }

    if(props.page === 'pixel') {
        return (<><main><Pixel pixelid={pixelId} access_code={accessToken} /></main></>)
    } else if(props.page === 'info') {
        return (<><main><Info name={name} url={url} /></main></>)
    } else if(props.page === 'whyus') {
        return (<><main><WhyUs /></main></>)
    } else if(props.page === 'contact') {
        return (<><main><Contact /></main></>)
    } else if(props.page === 'faq') {
        return (<><main><Faq /></main></>)
    } else {
        return (<><main><Pixel pixelid={pixelId} access_code={accessToken} /></main></>)
    }
}
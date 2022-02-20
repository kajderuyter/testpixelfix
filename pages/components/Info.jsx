import React from "react";
import { useEffect, useState } from "react";

export default function Info(props) {
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    
    let data
    useEffect(() => {
        fetchData()
    })

    const fetchData = async () => {
        const config = {
            method: 'GET',
            headers: {
                'X-shopify-key': props.access_code
            }
        }
        data = await fetch('https://tiktok-api-fix-backend.herokuapp.com/api/store', config)
        .then(response => response.json())
        .catch(err => console.log(err))
        setName(data.store_name)
        setUrl(data.store_url)
    }

    return(
        <>
            <div className="page-content">
                <h1 className="content-title">Your license info</h1>
                <p className="content-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae dolor eaque laboriosam aut, voluptas, inventore placeat nesciunt mollitia fugiat aspernatur nihil, harum quam minus quos!</p>
            </div>

            <div className="info">
                <label>Store name</label>
                <input className="input" type="text" value={name} disabled/>
                <label>Store url</label>
                <input className="input" type="text" value={url} disabled/>
            </div>
        </>
    )
}
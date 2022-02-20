import React from "react";
import { useEffect } from "react";

export default function Info(props) {
    
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
        const data = await fetch('https://tiktok-api-fix-backend.herokuapp.com/api/store', config)
        .then(response => response.json)
        .catch(err => console.log(err))
        console.log(data.store_name)
    }

    return(
        <>
            <div className="page-content">
                <h1 className="content-title">Your license info</h1>
                <p className="content-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae dolor eaque laboriosam aut, voluptas, inventore placeat nesciunt mollitia fugiat aspernatur nihil, harum quam minus quos!</p>
            </div>
        </>
    )
}
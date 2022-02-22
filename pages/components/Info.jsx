import React from "react";

export default function Info(props) {
    return(
        <>
            <div className="page-content">
                <h1 className="content-title">Your license info</h1>
                <p className="content-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae dolor eaque laboriosam aut, voluptas, inventore placeat nesciunt mollitia fugiat aspernatur nihil, harum quam minus quos!</p>
            </div>

            <div className="info">
                <label>Store name</label>
                <input className="input" type="text" value={props.name} disabled/>
                <label>Store url</label>
                <input className="input" type="text" value={props.url} disabled/>
            </div>
        </>
    )
}
import React, { Component } from "react";
import { withRouter } from "next/router";

class LicenseForm extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            access_token: props.router.query.access_token,
            store_url: props.router.query.store_name
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({value: event.target.value.trim()})
        console.log(this.state)
    }

    handleSubmit(event) {
        event.preventDefault()
        const store_url = this.state.store_url
        const store_name = store_url.split(".myshopify.com")[0]
        let config = {
            method: "POST",
            headers: {"Content-Type":"application/json",'X-license-key':this.state.value},
        }
        // X-license-key in header, shopify_store_access_token in body
        fetch(`https://tiktok-api-fix-backend.herokuapp.com/api/store/auth?shopify_store_access_token=${this.state.access_token}`, config)
        .then(response => {
            if(response.status == 200) {
                // X-shopify-key (access_code) in header, store_name & store_url in body
                config = {
                    method: "POST",
                    headers: {"Content-Type":"application/json",'X-shopify-key':this.state.access_token}
                }
                fetch(`https://tiktok-api-fix-backend.herokuapp.com/api/store?store_name=${store_name}&store_url=${this.state.store_url}`, config)
                .then(response => (response.json()))
                .then(result => (console.log(result)))
                .catch(err => (console.log(err)))
            } else if(response.status == 401) {
                console.log(response.body)
            } else if(response.status == 404) {
                console.log(response.body)
            } else {
                console.log("Hier gaat iets fout")
            }
        return response.json()
        },err => {
            console.log(err)
        })
        .then(result => {
            console.log(result)
        })
        this.props.router.push({
            pathname: "/dashboard",
            query: {
                access_token: this.state.access_token,
                store_name: this.state.store_url
            },
        })
    }
    
    render() {
        return (
            <form className="license-form" onSubmit={this.handleSubmit}>
                <h2>Add License Key</h2>
                <input className='license-input' type="text" placeholder='Enter License Key' value={this.state.value} onChange={this.handleChange} required />
                <div className='license-box-content'>
                    <h3>How to get it?</h3>
                    <p>After you bought the plan we sent a unique license key to your email.<br/>
                    <b>Note:</b> This code can only be used for one store.</p>
                </div>
                <input className='license-submit' type='submit' value='Connect' />
            </form>
        )
    }
}

export default withRouter(LicenseForm)

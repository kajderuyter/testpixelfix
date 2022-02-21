import React, { Component } from "react";
import { withRouter } from "next/router";

class LicenseForm extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            access_token: props.router.query.access_token,
            store_url: props.router.query.store_name,
            licenseError: ''
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
        if(this.state.value.length === 32){
            this.setState({licenseError: ''})
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
                    .then(response => {
                        // If 200, route to dashboard
                        if(response.status == 200) {
                            this.props.router.push({
                                pathname: "/dashboard",
                                query: {
                                    access_token: this.state.access_token,
                                    store_name: this.state.store_url
                                },
                            })
                        } 
                        return response.json()
                    })
                    .catch(err => (this.setState({licenseError: 'Can\'t push store data'})))
                } else {
                    const json = response.json()
                    this.setState({licenseError: 'License key not valid or expired'})
                } 
            },err => {
                console.log(err)
            })
        } else {
            this.setState({licenseError: 'Please enter a valid license key.'})
        }
    }
    
    render() {
        return (
            <form className="input-form" onSubmit={this.handleSubmit}>
                <h2>Add License Key</h2>
                <input className='input' type="text" placeholder='Enter License Key' value={this.state.value} onChange={this.handleChange} required />
                <div className='input-box-content'>
                    <h3>How to get it?</h3>
                    <p>After you bought the plan we sent a unique license key to your email.<br/>
                    <b>Note:</b> This code can only be used for one store.</p>
                </div>
                <input className='input-submit' type='submit' value='Connect' />
                <span className="form-error">{this.state.licenseError}</span>
            </form>
        )
    }
}

export default withRouter(LicenseForm)

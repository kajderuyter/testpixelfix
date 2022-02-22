import { Component } from "react"

class Pixel extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tiktokpixelid: '',
            tiktokpixelac: '',
            access_code: props.access_code,
            pixelidError: '',
            pixelAcerror: '',
            formSuccess: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        if(event.target.name === 'pixelid') {
            this.setState({tiktokpixelid: event.target.value.trim()})
        } else {
            this.setState({tiktokpixelac: event.target.value})
        }
    }

    handleSubmit(event) {
        event.preventDefault()
        if(this.state.tiktokpixelid){
            if(this.state.tiktokpixelac.length === 40) {
                let config = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-shopify-key': this.state.access_code
                    }
                }
                // Save Pixel ID
                fetch(`https://tiktok-api-fix-backend.herokuapp.com/api/tiktok/pixel?pixel_id=${this.state.tiktokpixelid}`, config)
                .then(response => (response.json())).then(result => (console.log(result))).catch(err => this.setState({pixelidError: 'Couldn\'t save Pixel ID'}))
                // Save Pixel AC
                fetch(`https://tiktok-api-fix-backend.herokuapp.com/api/tiktok/auth?pixel_access_token=${this.state.tiktokpixelac}`, config)
                .then(response => (response.json())).then(result => this.setState({formSuccess: 'Pixel ID and Access Code successfully added.'})).catch(err => this.setState({pixelAcerror: 'Couldn\'t save Pixel Access Code'}))
            } else {
                // Pixel Access Code leeg
                this.setState({pixelAcerror: 'Please enter a valid Pixel Access Code'})
            }
        } else {
            // Pixel Id leeg
            this.setState({pixelidError: 'Please enter a valid Pixel ID'})
        }
    }

    render() {
        return(
            <>
                <div className="page-content">
                    <h1 className="content-title">Welcome to 100% TikTok Pixel Tracking</h1>
                    <p className="content-text">We can proudly announce that we are the first Shopify App with 100% TikTok pixel tracking. Can you already imagine how accurate your ads can spend with this tool?</p>
                </div>

                <div className="video-wrapper">Hier komt een video</div>
                <div className="tiktok-input-box">
                    <form className="input-form" onSubmit={this.handleSubmit}>
                        <div className="settings-box">
                            <h2>Connect your TikTok Pixel</h2>
                            <input className='input' name="pixelid" type="text" placeholder={this.props.pixelid || 'Enter Tiktok Pixel ID'} value={this.state.tiktokpixelid} onChange={this.handleChange} required />
                            <div className='input-box-content'>
                                <p>You can find your TikTok Pixel ID in your Pixel settings.<br/>
                                <b>Note:</b> The app won't work with the wrong Pixel ID</p>
                            </div>
                            <span className="form-error">{this.state.pixelidError}</span>
                        </div>
                        <div className="settings-box">
                            <h2>Enter your TikTok Pixel Access Code</h2>
                            <input className='input' name="pixelac" type="text" placeholder='Enter Tiktok Pixel Access Code' value={this.state.tiktokpixelac} onChange={this.handleChange} required />
                            <div className='input-box-content'>
                                <p>You can find your TikTok Pixel Access Code in your Pixel settings.<br/>
                                <b>Note:</b> The app won't work with the wrong Pixel Access Code</p>
                            </div>
                            <span className="form-error">{this.state.pixelAcerror}</span>
                        </div>
                        <input className="input-submit" type='submit' value='Connect'/>
                    </form>
                    <span className="form-success"> {this.state.formSuccess} </span>
                </div>
            </>
        )
    }
}

export default Pixel
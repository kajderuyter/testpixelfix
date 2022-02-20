import { Component } from "react"

class PixelID extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tiktokpixelid: '',
            access_code: props.access_code
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({tiktokpixelid: event.target.value.trim()})
        console.log(this.state)
        console.log(this.state.access_code)
    }

    handleSubmit(event) {
        event.preventDefault()
        if(this.state.tiktokpixelid.length === 20){
            const config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-shopify-key': this.state.access_code
                }
            }
            fetch(`https://tiktok-api-fix-backend.herokuapp.com/api/tiktok/pixel?pixel_id=${this.state.tiktokpixelid}`, config)
            .then(response => (response.json())).then(result => (console.log(result))).catch(err => (console.log(err)))
        } else {
            console.log('is niet 20')
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
                <div className="input-box">
                    <h2>Connect your TikTok Pixel</h2>
                    <form className="input-form" onSubmit={this.handleSubmit}>
                        <input className='input' type="text" placeholder='Enter Tiktok Pixel ID' value={this.state.tiktokpixelid} onChange={this.handleChange} required />
                        <div className='input-box-content'>
                            <h3>Where can I find my TikTok Pixel ID?</h3>
                            <p>You can find your TikTok Pixel ID in your Pixel settings.<br/>
                            <b>Note:</b> The app won't work with the wrong Pixel ID</p>
                        </div>
                        <input className="input-submit" type='submit' value='Submit'/>
                    </form>
                </div>
            </>
        )
    }
}

export default PixelID
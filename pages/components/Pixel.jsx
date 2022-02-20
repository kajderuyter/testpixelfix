import { Component } from "react"

class Pixel extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tiktokpixelid: '',
            tiktokpixelac: '',
            access_code: props.access_code,
        }

        this.handleChangeId = this.handleChangeId.bind(this)
        this.handleSubmitId = this.handleSubmitId.bind(this)
        this.handleChangeAc = this.handleChangeAc.bind(this)
        this.handleSubmitAc = this.handleSubmitAc.bind(this)
    }

    async componentDidMount() {
        if(!this.state.tiktokpixelid){
            const config = {
                method: 'GET',
                headers: {
                    'X-shopify-key': this.state.access_code
                }
            }
            const data = await fetch('https://tiktok-api-fix-backend.herokuapp.com/api/tiktok/pixel', config)
            .then(response => response.json())
            .catch(err => console.log(err))
            if(data.pixel_id) {
                this.setState({tiktokpixelid: data.pixel_id})
            }
        }
    }

    handleChangeId(event) {
        this.setState({tiktokpixelid: event.target.value.trim()})
    }

    handleSubmitId(event) {
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
    
    handleChangeAc(event) {
        this.setState({tiktokpixelac: event.target.value})
    }

    handleSubmitAc(event) {
        event.preventDefault()
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-shopify-key': this.state.access_code
            }
        }
        fetch(`https://tiktok-api-fix-backend.herokuapp.com/api/tiktok/auth?pixel_access_token=${this.state.tiktokpixelac}`, config)
        .then(response => (response.json())).then(result => (console.log(result))).catch(err => (console.log(err)))
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
                    <form className="input-form" onSubmit={this.handleSubmitId}>
                        <input className='input' type="text" placeholder={this.state.tiktokpixelid || 'Enter Tiktok Pixel ID'} value={this.state.tiktokpixelid} onChange={this.handleChangeId} required />
                        <div className='input-box-content'>
                            <h3>Where can I find my TikTok Pixel ID?</h3>
                            <p>You can find your TikTok Pixel ID in your Pixel settings.<br/>
                            <b>Note:</b> The app won't work with the wrong Pixel ID</p>
                        </div>
                        <input className="input-submit" type='submit' value='Submit'/>
                    </form>
                </div><br/><br/>
                <div className="input-box">
                    <h2>Enter your TikTok Pixel Access Code</h2>
                    <form className="input-form" onSubmit={this.handleSubmitAc}>
                        <input className='input' type="text" placeholder='Enter Tiktok Pixel Access Code' value={this.state.tiktokpixelac} onChange={this.handleChangeAc} required />
                        <div className='input-box-content'>
                            <h3>Where can I find my TikTok Pixel Access Code?</h3>
                            <p>You can find your TikTok Pixel Access Code in your Pixel settings.<br/>
                            <b>Note:</b> The app won't work with the wrong Pixel Access Code</p>
                        </div>
                        <input className="input-submit" type='submit' value='Submit'/>
                    </form>
                </div>
            </>
        )
    }
}

export default Pixel
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
                <h1>Tiktok pixel ID instellen</h1>
                <form onSubmit={this.handleSubmit}>
                    <input className='license-input' type="text" placeholder='Enter Tiktok Pixel ID' value={this.state.tiktokpixelid} onChange={this.handleChange} required />
                    <input type='submit' value='Submit'/>
                </form>
            </>
        )
    }
}

export default PixelID
import { Component } from "react"

class PixelAC extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tiktokpixelac: '',
            access_code: props.access_code
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({tiktokpixelac: event.target.value})
        console.log(this.state.tiktokpixelac)
    }

    handleSubmit(event) {
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
                <h1>Tiktok Pixel Access Code instellen</h1>
                <form onSubmit={this.handleSubmit}>
                    <input className='license-input' type="text" placeholder='Enter Tiktok Pixel Access Code' value={this.state.tiktokpixelid} onChange={this.handleChange} required />
                    <input type='submit' value='Submit'/>
                </form>
            </>
        )
    }

}

export default PixelAC
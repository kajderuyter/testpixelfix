import React, { Component } from "react";

class Contact extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            subject: '',
            message: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const target = event.target
        const name = target.name

        this.setState({
            [name]: target.value
        })
        console.log(this.state)
    }

    handleSubmit(event) {
        console.log('submit')
    }

    render() {
        return(
            <>
            <div className="page-content">
                <h1 className="content-title">Contact us</h1>
                <p className="content-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas dolores nulla culpa voluptate laudantium sapiente modi architecto eaque libero nobis!</p>
            </div>
            <form className="contact-form" onSubmit={this.handleSubmit}>
                <label htmlFor="name">Name</label>
                <input name="name" className="input" type="text" placeholder="Your Name" value={this.state.name} onChange={this.handleChange}/>
                <label htmlFor="email">Email</label>
                <input name="email" className="input" type="email" placeholder="Your E-mail" value={this.state.email} onChange={this.handleChange}/>
                <label htmlFor="name">Subject</label>
                <input name="subject" className="input" type="text" placeholder="Subject" value={this.state.subject} onChange={this.handleChange}/>
                <label htmlFor="name">Message</label>
                <textarea name="message" className="input" rows="5" placeholder="Your Message" value={this.state.message} onChange={this.handleChange}/>
                <button className="input-submit" type="submit" onClick={this.handleSubmit}>Submit</button>
            </form>
            </>
        )
    }
}

export default Contact
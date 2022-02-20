import React, { Component } from "react";
import isEmail from "validator/lib/isEmail";

class Contact extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            email: '',
            subject: '',
            message: '',
            nameError: '',
            emailError: '',
            subjectError: '',
            messageError: '',
            emailSuccess: '',
            emailFailed: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const target = event.target
        const name = target.name
        if(name === 'email') {
            this.setState({[name]: target.value.trim()})
        } else {
            this.setState({[name]: target.value})
        }
    }

    handleSubmit(event) {
        event.preventDefault()
        if(this.state.name){
            this.state.nameError = ''
            if(this.state.email){
                this.state.emailError = ''
                if(isEmail(this.state.email)) {
                    this.state.emailError = ''
                    if(this.state.subject) {
                        this.state.subjectError = ''
                        if(this.state.message) {
                            this.state.messageError=  ''
                            const config = {
                                method: 'POST',
                                headers: {'Content-Type':'application/json'},
                                body: JSON.stringify({
                                    name: this.state.name,
                                    email: this.state.email,
                                    subject: this.state.subject,
                                    message: this.state.message
                                })
                            }
                            fetch('https://74f0-2a02-a210-2786-ce80-f4ae-5fec-32ce-34b8.ngrok.io/contact', config)
                            .then(response => (response.json))
                            .then(response => {
                                this.state.emailSuccess = response.message
                            })
                            .catch(err => {
                                console.log(err.message)
                                this.state.emailFailed = err.response.message
                            })
                        } else {
                            this.state.messageError = 'Please enter a message'
                        }
                    } else {
                        this.state.subjectError = 'Please enter a subject'
                    }
                } else {
                    this.state.emailError = 'Please enter a valid email'
                }
            } else {
                this.state.emailError = 'Please enter your email'
            }
        } else {
            this.state.nameError = 'Please enter your name'
        }
        console.log(this.state)
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
                <span className="form-error">{this.state.nameError}</span>
                <label htmlFor="email">Email</label>
                <input name="email" className="input" type="text" placeholder="Your E-mail" value={this.state.email} onChange={this.handleChange}/>
                <span className="form-error">{this.state.emailError}</span>
                <label htmlFor="name">Subject</label>
                <input name="subject" className="input" type="text" placeholder="Subject" value={this.state.subject} onChange={this.handleChange}/>
                <span className="form-error">{this.state.subjectError}</span>
                <label htmlFor="name">Message</label>
                <textarea name="message" className="input" rows="5" placeholder="Your Message" value={this.state.message} onChange={this.handleChange}/>
                <span className="form-error">{this.state.messageError}</span>
                <button className="input-submit" type="submit" onClick={this.handleSubmit}>Submit</button>
                <span className="email-success">{this.state.emailSuccess}</span>
                <span className="email-failed">{this.state.emailFailed}</span>
            </form>
            </>
        )
    }
}

export default Contact
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

        this.baseState = this.state

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

    async handleSubmit(event) {
        event.preventDefault()
        if(this.state.name){
            this.setState({nameError: ''})
            if(this.state.email){
                this.setState({emailError: ''})
                if(isEmail(this.state.email)) {
                    this.setState({emailError: ''})
                    if(this.state.subject) {
                        this.setState({subjectError: ''})
                        if(this.state.message) {
                            this.setState({messageError: ''})
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
                            await fetch('https://74f0-2a02-a210-2786-ce80-f4ae-5fec-32ce-34b8.ngrok.io/contact', config)
                            .then(response => {
                                return response.json()
                            })
                            .then(response => {
                                console.log(response)
                                this.setState(this.baseState)
                                this.setState({emailSuccess: response.message})
                            })
                            .catch(err => {
                                console.log(err)
                                this.setState({emailFailed: 'foutje'})
                            })
                        } else {
                            this.setState({messageError: 'Please enter a message'})
                        }
                    } else {
                        this.setState({subjectError: 'Please enter a subject'})
                    }
                } else {
                    this.setState({emailError: 'Please enter a valid email'})
                }
            } else {
                this.setState({emailError: 'Please enter your email'})
            }
        } else {
            this.setState({nameError: 'Please enter your name'})
        }
    }

    render() {
        return(
            <>
            <div className="page-content">
                <h1 className="content-title">Contact us</h1>
                <p className="content-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quas dolores nulla culpa voluptate laudantium sapiente modi architecto eaque libero nobis!</p>
            </div>
            <div className="page-content">
                <span className="email-success">{this.state.emailSuccess}</span>
                <span className="email-failed">{this.state.emailFailed}</span>
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

            </form>
            </>
        )
    }
}

export default Contact
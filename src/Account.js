import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import firebase from 'firebase/app';

class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            'email': undefined,
            'password': undefined
        };
    }

    componentDidMount() {
        this.authUnRegFunc = firebase.auth().onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                this.setState({ user: firebaseUser, loading: false });
            } else {
                this.setState({ user: null, loading: false });
            }
        })
    }

    componentWillUnmount() {
        this.authUnRegFunc();
    }

    handleChange(event) {
        let field = event.target.name;
        let value = event.target.value;
        let changes = {};
        changes[field] = value;
        this.setState(changes);
    }

    handleSignUp(email, password) {
        this.setState({ errorMessage: null });
        console.log(this.state.email);
        console.log(this.state.password);
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((firebaseUser) => {
                let user = firebase.auth().currentUser;
                return user;
            }).catch((error) => {
                this.setState({ errorMessage: error.message });
            });
    }

    handleSignIn(email, password) {
        this.setState({ errorMessage: null });
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch((error) => {
                if (error.message === 'The password is invalid or the user does not have a password.') {
                    this.setState({ errorMessage: "The email or password is incorrect." });
                } else {
                    this.setState({ errorMessage: error.message });
                }
            });
    }

    handleSignOut() {
        this.setState({ errorMessage: null });
        firebase.auth().signOut()
            .catch((error) => {
                this.setState({ errorMessage: error.message });
            });
    }

    render() {
        let content = null;
        if (!this.state.user) {
            return (
                <Form className="form">
                    <FormGroup>
                        {this.state.errorMessage &&
                            <p className="alert alert-danger">{this.state.errorMessage}</p>
                        }
                        <Label for="email">Email</Label>
                        <Input type="email" name="email" id="email" onChange={(event) => this.handleChange(event)} placeholder="example@email.com" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="password" name="password" id="password" onChange={(event) => this.handleChange(event)} placeholder="******" />
                    </FormGroup>
                    <Button color="primary" onClick={() => this.handleSignUp(this.state.email, this.state.password)}>Sign Up</Button>
                    <Button color="primary" onClick={() => this.handleSignIn(this.state.email, this.state.password)}>Login</Button>
                </Form>
            );
        } else {
            return (
                <div className="form">
                    <h1>Welcome!</h1>
                    {this.state.user &&
                        <div className="alert alert-success"><h3>Logged In</h3></div>
                    }
                    <Button color="primary" onClick={() => this.handleSignOut()}>Sign Out</Button>
                </div>
            );
        }
    }
}

export default Account;
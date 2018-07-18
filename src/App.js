import React, { Component } from 'react';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import firebase from 'firebase/app';
import HomePage from './HomePage';
import Hiring from './Hiring';
import Skills from './Skills';
import Location from './Location'

class App extends Component {

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <nav>
                        <ul>
                            <li><NavLink exact to="/" activeClassName="activeLink">Home</NavLink></li>
                            <li><NavLink to="/job-skills" activeClassName="activeLink">Job Skills</NavLink></li>
                            <li><NavLink to="/jobs-near-you" activeClassName="activeLink">Jobs Near You</NavLink></li>
                            <li><NavLink to="/hiring" activeClassName="activeLink">Hiring?</NavLink></li>
                            {/* <li><NavLink to="/recent-searches" activeClassName="activeLink">Recent Searches</NavLink></li> */}
                            <li><NavLink to="/account" activeClassName="activeLink">Account</NavLink></li>
                        </ul>
                    </nav>
                    <h1 className="App-title center-small">PathFinder</h1>
                </header>

                <main>
                    <Switch>
                        <Route exact path='/' component={HomePage} />
                        <Route path='/job-skills' component={Skills} />
                        <Route path='/jobs-near-you' component={Location} />
                        <Route path='/hiring' component={Hiring} />
                        {/* <Route path='/recent-searches' component={Hiring} /> */}
                        <Route path='/account' component={Account} />
                        <Redirect to='/' />
                    </Switch>
                </main>

                <footer>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-4">
                                <p>
                                    Privacy Policy: Our Website Title will NOT save, distrubute, or use
                                    your account information for any purpose other than sending you
                                    updates based on your saved items.
                                </p>
                            </div>
                            <div className="col-xs-4"></div>
                            <div className="col-xs-4">
                                <p>Copyright 2018 PathFinder. All Rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}

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
            if(firebaseUser) {
              this.setState({user: firebaseUser, loading: false});
            } else {
              this.setState({user: null, loading: false});
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
        this.setState({errorMessage: null});
        console.log(this.state.email);
        console.log(this.state.password);
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((firebaseUser) => {
                let user = firebase.auth().currentUser;
                return user;
            }).catch((error) => {
                this.setState({errorMessage: error.message});
            });
    }

    handleSignIn(email, password) {
        this.setState({errorMessage: null});
        firebase.auth().signInWithEmailAndPassword(email, password)
            .catch((error) => {
                this.setState({errorMessage: error.message});
            });
    }

    handleSignOut() {
        this.setState({errorMessage: null});
        firebase.auth().signOut()
            .catch((error) => {
                this.setState({errorMessage: error.message});
            });
    }

    render() {
        let content = null;
        if (!this.state.user) {
            return(
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
            return(
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

export default App;
import React, { Component } from 'react';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import firebase from 'firebase/app';
import HomePage from './HomePage';
import Hiring from './Hiring';
import Skills from './Skills';
import Location from './Location';
import RecentSearches from './RecentSearches'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            'email': undefined,
            'password': undefined,
            modal: false,
            errorMessage: null
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
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
        let modal;
        if (!this.state.user) {
            modal = (
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalBody>
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
                        </Form>
                        <ModalFooter>
                            <Button color="primary" onClick={() => this.handleSignUp(this.state.email, this.state.password)}>Sign Up</Button>
                            <Button color="primary" onClick={() => this.handleSignIn(this.state.email, this.state.password)}>Login</Button>
                            <Button color="secondary" onClick={() => this.toggle()}>Close</Button>
                        </ModalFooter>
                    </ModalBody>
                </Modal>
            );
        } else {
            modal = (
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalBody>
                        <div className="form">
                            <h1>Welcome!</h1>
                            {this.state.user &&
                                <div className="alert alert-success"><h3>Logged In</h3></div>
                            }
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={() => {
                            this.handleSignOut();
                            window.location.reload(true);
                        }}>Sign Out</Button>
                        <Button color="secondary" onClick={() => this.toggle()}>Close</Button>
                    </ModalFooter>
                </Modal>
            );
        }


        return (
            <div className="App">
                <header className="App-header">
                    <nav>
                        <ul>
                            <li><NavLink exact to="/" activeClassName="activeLink">Home</NavLink></li>
                            <li><NavLink to="/job-skills" activeClassName="activeLink">Job Skills</NavLink></li>
                            <li><NavLink to="/jobs-near-you" activeClassName="activeLink">Jobs Near You</NavLink></li>
                            <li><NavLink to="/hiring" activeClassName="activeLink">Hiring?</NavLink></li>
                            <li><NavLink to="/recent-searches" activeClassName="activeLink">Recent Searches</NavLink></li>
                            <li id="account-button"><div><Button onClick={() => this.toggle()}>Account</Button></div></li>
                            {/* <li><NavLink to="/account" activeClassName="activeLink">Account</NavLink></li> */}
                        </ul>
                    </nav>
                    <h1 className="App-title center-small">PathFinder</h1>
                </header>

                <main>
                    {modal}
                    <Switch>
                        <Route exact path='/' component={HomePage} />
                        <Route path='/job-skills' component={Skills} />
                        <Route path='/jobs-near-you' component={Location} />
                        {/* save={(jobArray, searchTerm, screenWidth, location) => this.save(jobArray, searchTerm, screenWidth, location)} */}
                        <Route path='/hiring' component={Hiring} />
                        <Route path='/recent-searches' component={RecentSearches} />
                        {/* <Route path='/account' component={Account} /> */}
                        <Redirect to='/' />
                    </Switch>
                </main>

                <footer>
                    <Container>
                        <Row>
                            <Col xs="4">
                                <p>
                                    Privacy Policy: PathFinder will NOT save, distrubute, or use
                                    your account information for any purpose other than allowing
                                    you to view your saved searches from our "Recent Searches" tab.
                                </p>
                            </Col>
                            <Col xs="4"></Col>
                            <Col xs="4">
                                <p>Copyright 2018 PathFinder. All Rights reserved.</p>
                            </Col>
                        </Row>
                    </Container>
                </footer>
            </div>
        );
    }
}

export default App;



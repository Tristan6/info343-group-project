import React, { Component } from 'react';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
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
                            {/* <li><NavLink to="/recent-searches" activeClassName="activeLink">Recent Searches</NavLink></li>
                            <li><NavLink to="/account" activeClassName="activeLink">Account</NavLink></li> */}
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
                        {/* <Route path='/recent-searches' component={Hiring} />
                        <Route path='/account' component={Hiring} /> */}
                        <Redirect to='/' />
                    </Switch>
                </main>

                <footer>
                    <Container>
                        <Row>
                            <Col xs="4">
                                <p>
                                    Privacy Policy: Our Website Title will NOT save, distrubute, or use
                                    your account information for any purpose other than sending you
                                    updates based on your saved items.
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
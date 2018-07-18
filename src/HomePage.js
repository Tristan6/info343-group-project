import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

class HomePage extends Component {
    render() {
        return (
            <div className="container">
                <h2 className="center-small">Welcome!</h2>
                <p className="App-intro center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        We are PathFinder and this is our explanatory introduction. You can navigate our
                        website using the navigation bar above, using the tab most relevant to you. The
                        “Job Skills” tab allows you to search for a job title and view a graphic of the
                        frequency of key words like skills or job duties. The “Jobs Near You” tab allows
                        you to search for a location of interest and view the most common job positions
                        in that location. The “Hiring?” tab allows you to search for a job position and
                        a location of interest to get an ‘average’ pay of said job in the location. If
                        you login, our website will save your recent searches to a list that you can
                        revisit.
                    </p>
                <div className="blue-bar"></div>
                <h3>Quick Tips:</h3>
                <Grid>
                    <Row>
                        <Col xs={12} sm={4}>
                            <div className="card">
                                <div className="card-body">
                                    <h4>Know Your Role</h4>
                                    <ul>
                                        <li>What type of skills do you have?</li>
                                        <li>What companies are near you?</li>
                                        <li>What do you expect from your new hires?</li>
                                    </ul>
                                    <p className="card-text"></p>
                                    <p className="card-text"></p>
                                    <p className="card-text"></p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} sm={4}>
                            <div className="card">
                                <div className="card-body">
                                    <h4>Have Goals</h4>
                                    <p className="card-text">
                                        Set goals for yourself, whether that is to get a job or hire a
                                        new employee in set time frame.
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} sm={4}>
                            <div className="card">
                                <div className="card-body">
                                    <h4>Independent Research</h4>
                                    <p className="card-text">
                                        Do not solely rely on our website! While we do pride ourselves on
                                        the quality of our product, we cannot guarantee that we provide
                                        all of the information you need to meet your goals.
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}

export default HomePage;
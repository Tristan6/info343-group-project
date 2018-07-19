import React, { Component } from 'react';
import { Container, Col, Row } from 'reactstrap';

class HomePage extends Component {
    render() {
        return (
            <div className="container">
                <h2 className="center-small">Welcome!</h2>
                <p className="App-intro center">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        We are PathFinder and we want to help you find your path, whether that be as a
                        student looking for the typical job in your city, an employer trying to grow your
                        company, or a professional looking to bulk up your resume for your next big career
                        move. We at PathFinder have designed three unique search features that you can
                        access using tabs above. The “Job Skills” tab allows you to search for a job title
                        and view a graphic of the frequency of key words like skills or job duties. The
                        “Jobs Near You” tab allows you to search for a location of interest and view the
                        most common job positions in that location. The “Hiring?” tab allows you to search
                        for a job position and a location of interest to get an ‘average’ pay of said job
                        in the location. If you login, our website will save your recent searches to a
                        list that you can revisit.
                    </p>
                <div className="blue-bar"></div>
                <h3>Quick Tips:</h3>
                <Container>
                    <Row>
                        <Col xs="12" sm="4">
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
                        <Col xs="12" sm="4">
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
                        <Col xs="12" sm="4">
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
                </Container>
            </div>
        )
    }
}

export default HomePage;
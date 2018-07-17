import React, { Component } from 'react';
import 'whatwg-fetch';
// import Plot from 'react-plotly.js';
import key from './key';

class App extends Component {
    constructor(props) {
        super(props);
        //initialize state
        this.state = {
            results: [],
            jobTerm: null,
            locationTerm: null,
            errorMessage: null
        };
    }

    // Places an error alert under the search input & button
    renderError(errorText) {
        let newError = <p className="alert alert-danger">{errorText}</p>
        this.setState({ errorMessage: newError });
    }

    // Fetches data based on the defined values in the state
    getData(job, location, hiring) {
        let url = 'https://data.usajobs.gov/api/search?Keyword=' + job;
        if (location) {
            url = url + '&' + location;
        }

        fetch(url, {
            headers: {
                "Host": 'data.usajobs.gov',
                "User-Agent": key.userAgent,
                "Authorization-Key": key.authorizationKey
            }
        })
            .then((response) => (response.json()))
            .then((data) => {
                // This removes the error message when a valid search has been completed (data to render) 
                this.setState({ errorMessage: null });
                // The following if statements determine what data manipulation you would like to do 
                // using passed-in or state values
                if (location) {
                    // Do job search by location data manipulation (call a function)
                    console.log('Do a job search by location!');
                } else if (hiring) {
                    this.getSalaryData(data);
                } else {
                    // Do job skills/description data manipulation (call a function)
                    console.log('Do a job skill or job description search!');
                }
            })
            .catch((err) => {
                this.setState({ results: null });
                this.renderError(err.message);
            });
    }

    // Structure the data for the 'hiring' tab-component
    getSalaryData(data) {
        let salaryResults = data.SearchResult.SearchResultItems.map((result) => {

            let salaryInfo = result.MatchedObjectDescriptor.PositionRemuneration[0];
            let MaxSalary = parseInt(salaryInfo.MaximumRange, 10);
            let MinSalary = parseInt(salaryInfo.MinimumRange, 10);
            let payInterval = salaryInfo.RateIntervalCode;

            let resultObj = {
                jobTitle: result.MatchedObjectDescriptor.PositionTitle,
                avgSalary: ((MaxSalary + MinSalary) / 2),
                payInterval: payInterval
            }
            return resultObj;
        });
        console.log(salaryResults);
        this.setState({ results: salaryResults });
        this.setState({ jobTerm: null, locationTerm: null });
    }

    // Attach to job/skill keyword search bar
    handleJobChange(event) {
        this.setState({ jobTerm: event.target.value });
    }

    // This fetches the data when the search button is clicked
    handleClick(hiring) {
        this.getData(this.state.jobTerm, this.state.locationTerm, hiring);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <nav>
                        <ul>
                            <li><a href="">Home</a></li>
                            <li><a href="">Job Skills</a></li>
                            <li><a href="">Jobs Near You</a></li>
                            <li><a href="">Hiring?</a></li>
                            <li><a href="">Recent Searches</a></li>
                            <li><a href="">Account</a></li>
                        </ul>
                    </nav>
                    <h1 className="App-title">Welcome to Our Website</h1>
                </header>
                <p className="App-intro">
                    This will be our landing page!
                </p>
                <Hiring
                    handleJobChange={(event) => this.handleJobChange(event)}
                    handleClick={(hiring) => this.handleClick(hiring)}
                    results={this.state.results}
                />
                {this.state.errorMessage}
            </div>
        );
    }
}

export default App;

class Hiring extends Component {
    render() {
        this.hiring = true;

        return (
            <div className="container">
                <div className="row">
                    <input
                        type="text"
                        name="term"
                        id="searchQuery"
                        className="form-control" placeholder="Search for jobs. . ."
                        onChange={(event) => this.props.handleJobChange(event)}
                    />
                </div>
                <div className="row">
                    <button className="btn" onClick={() => this.props.handleClick(this.hiring)}>Search</button>
                </div>
                <div className="row">
                    {/* <BarGraph results={this.props.results} /> */}
                </div>
            </div>
        );
    }
}
import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import 'whatwg-fetch';
import Plot from 'react-plotly.js';
import key from './key';


class Hiring extends Component {
    constructor(props) {
        super(props);
        //initialize state
        this.state = {
            results: [],
            jobTerm: null,
            plot: false,
            errorMessage: null
        };
    }

    // Places an error alert under the search input & button
    renderError(errorText) {
        let newError = <p className="alert alert-danger">{errorText}</p>
        this.setState({ errorMessage: newError });
    }

    // Fetches data based on the defined values in the state
    getData(job) {
        let url = 'https://data.usajobs.gov/api/search?Keyword=' + job;
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
                this.setState({ results: salaryResults });
                this.setState({ plot: true });
                this.setState({ jobTerm: null });
            })
            .catch((err) => {
                this.setState({ plot: false });
                this.setState({ results: null });
                this.renderError(err.message);
            });
    }

    // Attach to job/skill keyword search bar
    handleJobChange(event) {
        this.setState({ jobTerm: event.target.value });
    }

    // This fetches the data when the search button is clicked
    handleClick(hiring) {
        this.getData(this.state.jobTerm);
    }

    render() {
        this.screenWidth = (
            window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth
        );
        return (
            <div className="margin-left">
                <h2 className="center-small">For Hiring Managers</h2>
                <div className="center-small">
                    <input
                        type="text"
                        name="term"
                        id="hiringQuery"
                        className="form-control"
                        placeholder="Search for jobs. . ."
                        onChange={(event) => this.handleJobChange(event)}
                    />
                </div>
                <div className="center-small">
                    <Button
                        bsStyle="primary"
                        disabled={this.state.jobTerm === null || this.state.jobTerm.length === 0}
                        onClick={() => this.handleClick(this.hiring)}>
                        Search
                    </Button>
                </div>
                <div className="blue-bar"></div>
                <div>
                    <BarGraph
                        results={this.state.results}
                        plot={this.state.plot}
                        screenWidth={this.screenWidth}
                    />
                </div>
            </div>
        );
    }
}

export default Hiring;

class BarGraph extends Component {
    render() {
        if (this.props.plot) {
            let salaryData = this.props.results;
            // Create an array of returned job titles
            let xIndex = salaryData.map((result) => {
                return result.jobTitle;
            });

            // Create an array of returned salaries
            let ySalary = salaryData.map((result) => {
                return result.avgSalary;
            });

            // Determine the size of the graph
            if (this.props.screenWidth < 768) {
                this.layout = { width: 320, height: 400, title: 'Salary Data' }
            } else if (this.props.screenWidth < 992) {
                this.layout = { width: 600, height: 500, title: 'Salary Data' }
            } else {
                this.layout = { width: 800, height: 600, title: 'Salary Data' }
            }

            // Job Title by Salary (Plotly.js bar plot)
            return (
                <div className="center">
                    <Plot
                        data={[
                            {
                                type: 'bar',
                                x: xIndex,
                                y: ySalary
                            },
                        ]}
                        // The width and height will need to be responsive :)
                        layout={this.layout}
                    />
                </div>
            );
        }
        return null;
    }
}
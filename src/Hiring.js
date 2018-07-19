import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Plot from 'react-plotly.js';
import firebase from 'firebase/app';
import 'whatwg-fetch';
import key from './key';
import 'bootstrap/dist/css/bootstrap.min.css';

class Hiring extends Component {
    constructor(props) {
        super(props);
        //initialize state
        this.state = {
            results: [],
            isLoaded: false,
            jobTerm: null,
            screenWidth: null,
            errorMessage: null
        };
    }

    save(searchResults, searchTerm, typeOfSearch) {
        let newSavedObj = {
            searchResults: searchResults,
            searchTerm: searchTerm,
            typeOfSearch: typeOfSearch
        };

        let userId = firebase.auth().currentUser.uid;
        let ref = firebase.database().ref(userId);
        ref.push(newSavedObj);
    }

    // Places an error alert under the search input & button
    renderError(errorText) {
        let newError = <p className="alert alert-danger">{errorText}</p>
        this.setState({ errorMessage: newError });
    }

    // Manipulates the resulting data into a usable format (returns an array of objects)
    cleanResults(data) {
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
        return salaryResults;
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
                let salaryResults = this.cleanResults(data);
                if (salaryResults.length === 0) {
                    this.setState({
                        results: null,
                        isLoaded: false
                    });
                    this.renderError('Too few results');
                } else {
                    this.setState({
                        results: salaryResults,
                        isLoaded: true,
                        screenWidth: (
                            window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth
                        )
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    results: null,
                    isLoaded: false
                });
                this.renderError(err.message);
            });
    }

    // Attach to job/skill keyword search bar
    handleJobChange(event) {
        this.setState({ jobTerm: event.target.value });
    }

    // This fetches the data when the search button is clicked
    handleClick() {
        this.getData(this.state.jobTerm);
    }

    render() {
        this.barGraph = (
            <HiringBarGraph
                data={this.state.results}
                isLoaded={this.state.isLoaded}
                errorMessage={this.state.errorMessage}
                screenWidth={this.state.screenWidth}
            />
        );

        return (
            <div className="margin-left">
                <h2 className="center-small">For Hiring Managers</h2>
                <p className="center-small page-description">
                    Search for a job to see the average salary of that job among other, similar jobs!
                </p>
                <div className="center-small">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter a job title. . ."
                        onChange={(event) => this.handleJobChange(event)}
                    />
                </div>
                <div className="center-small">
                    <Button
                        color="primary"
                        disabled={this.state.jobTerm === null || this.state.jobTerm.length === 0}
                        onClick={() => this.handleClick()}>
                        Search
                    </Button>
                    {' '}
                    <Button
                        color="danger"
                        disabled={!this.state.isLoaded}
                        onClick={() => this.save(
                            this.state.results,
                            this.state.jobTerm,
                            'hiring')}>
                        Save new search
                    </Button>
                </div>
                <div className="blue-bar"></div>
                <h3 className="center-small">Results</h3>
                <div>
                    {this.state.errorMessage}
                    {this.barGraph}
                </div>
            </div>
        );
    }
}

export default Hiring;

export class HiringBarGraph extends Component {
    render() {
        // Only render the bar graph when their is no error message displayed and the results are loaded
        if (this.props.isLoaded && !this.props.errorMessage) {
            let salaryData = this.props.data;
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
                this.layout = {
                    width: 320, height: 400, title: 'Salary Data',
                    yaxis: {
                        title: "wage ($)",
                        titlefont: {
                            family: 'Open Sans',
                            size: 18
                        }
                    }
                }
            } else if (this.props.screenWidth < 992) {
                this.layout = {
                    width: 600, height: 500, title: 'Salary Data',
                    yaxis: {
                        title: "wage ($)",
                        titlefont: {
                            family: 'Open Sans',
                            size: 18
                        }
                    }
                }
            } else {
                this.layout = {
                    width: 780, height: 600, title: 'Salary Data',
                    yaxis: {
                        title: "wage ($)",
                        titlefont: {
                            family: 'Open Sans',
                            size: 18
                        }
                    }
                }
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
        return <div></div>;
    }
}
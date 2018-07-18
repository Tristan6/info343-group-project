import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Plot from 'react-plotly.js';
import 'whatwg-fetch';
import key from './key';
import 'bootstrap/dist/css/bootstrap.min.css';

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobArray: [],
            isLoaded: false,
            location: null,
            errorMessage: null
        }
    }

    // Places an error alert under the search input & button
    renderError(errorText) {
        let newError = <p className="alert alert-danger">{errorText}</p>
        this.setState({ errorMessage: newError });
    }

    count(array) {
        let a = [];
        let b = [];
        let prev;
        array.sort();
        for (let i = 0; i < array.length; i++) {
            if (array[i].MatchedObjectDescriptor.JobCategory[0].Name !== prev) {
                a.push(array[i].MatchedObjectDescriptor.JobCategory[0].Name);
                b.push(1);
            } else {
                b[b.length - 1]++;
            }
            prev = array[i].MatchedObjectDescriptor.JobCategory[0].Name;
        }
        return [a, b];
    }

    getData(location) {
        let url = 'https://data.usajobs.gov/api/search?Keyword=' + location + "&ResultsPerPage=100";
        fetch(url, {
            headers: {
                "Host": 'data.usajobs.gov',
                "User-Agent": key.userAgent,
                "Authorization-Key": key.authorizationKey
            }
        })
            .then((response) => (response.json()))
            .then((data) => {
                let dataToClean = data.SearchResult.SearchResultItems;
                let cleanedData = this.count(dataToClean);
                this.setState({
                    jobArray: cleanedData,
                    isLoaded: true
                });
            })
            .catch((err) => {
                this.setState({ errorMessage: err.message });
            })

    }

    handleLocationChange(event) {
        this.setState({ location: event.target.value });
    }

    handleClick() {
        this.getData(this.state.location);
    }

    render() {
        this.screenWidth = (
            window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth
        );

        return (
            <div className="margin-left">
                <div>
                    <h2 className="center-small">Jobs Near You</h2>
                    <p className="center-small">
                        Search for a location to see the most common jobs that appear in that location!
                    </p>
                    <div className="center-small">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter a location. . ."
                            onChange={(event) => this.handleLocationChange(event)}
                        />
                    </div>
                    <div className="center-small">
                        <Button
                            color="primary"
                            disabled={this.state.location === null || this.state.location.length === 0}
                            onClick={() => this.handleClick()}>
                            Search
                        </Button>
                    </div>
                </div>
                <div className="blue-bar"></div>
                <h3 className="center-small">Results</h3>
                {this.state.errorMessage}
                <BarGraph
                    data={this.state.jobArray}
                    isLoaded={this.state.isLoaded}
                    errorMessage={this.state.errorMessage}
                    screenWidth={this.screenWidth}
                />
            </div>
        );
    }
}

export default Location;

class BarGraph extends Component {
    render() {
        // Only render the bar graph when their is no error message displayed and the results are loaded
        if (this.props.isLoaded && !this.props.errorMessage) {
            // Determine the size of the graph
            if (this.props.screenWidth < 768) {
                this.layout = {
                    width: 320, height: 400,
                    yaxis: {
                        title: "Number of Job Postings",
                        titlefont: {
                            family: 'Open Sans',
                            size: 18
                        }
                    }
                }
            } else if (this.props.screenWidth < 992) {
                this.layout = {
                    width: 600, height: 500,
                    yaxis: {
                        title: "Number of Job Postings",
                        titlefont: {
                            family: 'Open Sans',
                            size: 18
                        }
                    }
                }
            } else {
                this.layout = {
                    width: 800, height: 600,
                    yaxis: {
                        title: "Number of Job Postings",
                        titlefont: {
                            family: 'Open Sans',
                            size: 18
                        }
                    }
                }
            }

            return (
                <div id="locationPlot">
                    <Plot
                        data={[
                            {
                                x: this.props.data[0],
                                y: this.props.data[1],
                                type: 'bar'
                            }
                        ]}
                        layout={this.layout}
                    />
                </div>
            );
        }
        return <div></div>;
    }
}
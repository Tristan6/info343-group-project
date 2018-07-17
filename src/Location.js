import React, { Component } from 'react';
import key from './key';
import Plot from 'react-plotly.js';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function count(array) {
    let a = [];
    let b = [];
    let prev;
    array.sort();
    for (let i=0; i<array.length; i++) {
        if (array[i].MatchedObjectDescriptor.JobCategory[0].Name !== prev) {
            a.push(array[i].MatchedObjectDescriptor.JobCategory[0].Name);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = array[i].MatchedObjectDescriptor.JobCategory[0].Name;
    }
    return [a, b];
}

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobArray: [],
            isLoaded: false,
            location: null
        }
    }

    getData(location) {
        let url = 'https://data.usajobs.gov/api/search?Keyword=' + location;
        fetch(url, {
            headers: {
                "Host": 'data.usajobs.gov',
                "User-Agent": key.userAgent,
                "Authorization-Key": key.authorizationKey
            }
        })
            .then((response) => (response.json()))
            .then((data) => {
                this.setState({
                    jobArray: data.SearchResult.SearchResultItems,
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
        let data = count(this.state.jobArray);
        let plot;
        if (!this.state.isLoaded) {
            plot = <div></div>
        } else {
            plot = <div id="locationPlot"><Plot
                data={[
                    {
                        x: data[0],
                        y: data[1],
                        type: 'bar'
                    }
                ]}
                layout={{
                    yaxis: {
                        title: "Number of Job Postings",
                        titlefont: {
                            family: 'Open Sans',
                            size: 18
                        }
                    }
                }
                }
            />
            </div>
        }
        return(
            <div>
                <div>
                    <input className="form-control" onChange={(event) => this.handleLocationChange(event)} type="text" placeholder="Enter a Location" />
                    <Button color="primary" size="sm" onClick={() => this.handleClick()}>Search</Button>
                </div>
                <h3>Results</h3>
                {plot}
            </div>
        );
    }
}

export default Location;
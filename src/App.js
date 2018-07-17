import React, { Component } from 'react';
import key from './key';
import Location from './Location';

class App extends Component {
    constructor(props) {
        super(props);
        //initialize state
        this.state = {
            results: [],
            jobTerm: null,
            locationTerm: null,
            hiring: false,
            errorMessage: undefined
        };
    }

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
                this.setState({ results: data.SearchResult.SearchResultItems })
            })
            .catch((err) => {
                this.setState({ errorMessage: err.message });
            })
    }

    // Attach to job/skill keyword search bar
    handleJobChange(job) {
        this.setState({ jobTerm: job });
    }

    // Attach to location search bar
    handleLocationChange(job, location) {
        // Converting the location into an API acceptable format 
        if (location.indexOf(',') > -1) {
            let city = location.substring(0, location.indexOf(',') + 1);
            let state = location.substring((location.indexOf(',') + 2));
            location = city + '%20' + state;
            this.setState({ jobTerm: job, locationTerm: location });
        }
    }

    // Attach to 'hiring' tab search bar
    handleHiringManagers(job) {
        this.setState({ jobTerm: job, hiring: true });
    }

    // 
    handleClick() {
        this.getData(this.state.jobTerm, this.state.locationTerm, this.state.hiring);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to Our Website</h1>
                </header>
                <p className="App-intro">
                    This will be our landing page!
                </p>
                <div>
                    <button onClick={() => this.handleJobChange('Software Engineering')}>Search for a Job</button>
                </div>
                <div>
                    <button onClick={() => this.handleLocationChange('Software Engineering', 'Atlanta, Georgia')}>Search for a job at a specified location</button>
                </div>
                <div>
                    <button onClick={() => this.handleHiringManagers('Software Engineering')}>Get the avg salary of a job</button>
                </div>
                <div>
                    <button onClick={() => this.handleClick('Software Engineering', 'Atlanta, Georgia')}>Get the Data</button>
                </div>
                <Location />
            </div>
        );
    }
}

export default App;


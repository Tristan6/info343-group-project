import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Plot from 'react-plotly.js';
import firebase from 'firebase/app';
import 'whatwg-fetch';
import key from './key';
import 'bootstrap/dist/css/bootstrap.min.css';
import commonWords from './CommonWords'

class Skills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobArray: [],
            isLoaded: false,
            jobTitle: null,
            screenWidth: null,
            errorMessage: null
        }
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

    //Reiterate through each job description and count the frequency of each word
    count(array) {
        let words = {};
        //Reiterates through job results and creates a object with the word as a key and frequency as a value
        for (let i = 0; i < array.length; i++) {
            let summary = array[i].MatchedObjectDescriptor.QualificationSummary;
            let wordsArray = summary.split(" ")
            for (let j = 0; j < wordsArray.length; j++) {
                if (wordsArray[j].length > 3) {
                    let wordKey = wordsArray[j].toLowerCase();
                    if (wordsArray[j] in words) {
                        words[wordKey] = words[wordKey] + 1;

                    } else {
                        words[wordKey] = 1;
                    }
                }
            }
        }
        for (let i = 0; i < commonWords.length; i++) {
            if (commonWords[i] in words) {
                delete words[commonWords[i]]
            }
        }
        //From https://stackoverflow.com/questions/32302234/get-top-n-values-keys-of-an-object
        //Number of highest frequency words desired
        let numWords = 15;
        //Makes new object with the words with highest frequency and sorts it
        let props = Object.keys(words).map(function (key) {
            return { key: key, value: this[key] };
        }, words);
        props.sort(function (p1, p2) { return p2.value - p1.value; });
        let topWords = props.slice(0, numWords).reduce(function (obj, prop) {
            obj[prop.key] = prop.value;
            return obj;
        }, {});
        //Converts object to two arrays, one for the word and another for the frequency
        let result = Object.keys(topWords);
        let count = Object.values(topWords);
        return [result, count];
    }

    //Fetches results from the search bar
    getData(jobTitle) {
        jobTitle = jobTitle.replace(/\s+/g, '%20')
        let url = 'https://data.usajobs.gov/api/search?jobTitle=' + jobTitle + '&ResultsPerPage=500';
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
                    isLoaded: true,
                    screenWidth: (
                        window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth
                    )
                });
            })
            .catch((err) => {
                this.setState({ errorMessage: err.message });
            })

    }

    handlejobTitleChange(event) {
        this.setState({ jobTitle: event.target.value });
    }

    handleClick() {
        this.getData(this.state.jobTitle);
    }

    render() {
        this.barGraph = (
            <SkillsBarGraph
                data={this.state.jobArray}
                isLoaded={this.state.isLoaded}
                errorMessage={this.state.errorMessage}
                screenWidth={this.state.screenWidth}
            />
        );

        return (
            <div className="margin-left">
                <div>
                    <h2 className="center-small">Job Skills</h2>
                    <p className="center-small page-description">
                        Search for a job title to see the most common words that appear in the
                        qualifications for the searched job!
                    </p>
                    <div className="center-small">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter a job title. . ."
                            onChange={(event) => this.handlejobTitleChange(event)}
                        />
                    </div>
                    <div className="center-small">
                        <Button
                            color="primary"
                            disabled={this.state.jobTitle === null || this.state.jobTitle.length === 0}
                            onClick={() => this.handleClick()}>
                            Search
                        </Button>
                        {' '}
                        <Button
                            color="danger"
                            disabled={!this.state.isLoaded}
                            onClick={() => this.save(
                                this.state.jobArray,
                                this.state.jobTitle,
                                'skills')}>
                            Save new search
                        </Button>
                    </div>
                </div>
                <div className="blue-bar"></div>
                <h3 className="center-small">Results</h3>
                {this.state.errorMessage}
                {this.barGraph}
            </div>
        );
    }
}

export default Skills;

export class SkillsBarGraph extends Component {
    render() {
        // Only render the bar graph when their is no error message displayed and the results are loaded
        if (this.props.isLoaded && !this.props.errorMessage) {
            // Determine the size of the graph
            if (this.props.screenWidth < 768) {
                this.layout = {
                    width: 320, height: 400,
                    yaxis: {
                        title: "Skill frequency",
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
                        title: "Skill frequency",
                        titlefont: {
                            family: 'Open Sans',
                            size: 18
                        }
                    }
                }
            } else {
                this.layout = {
                    width: 780, height: 600,
                    yaxis: {
                        title: "Skill frequency",
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
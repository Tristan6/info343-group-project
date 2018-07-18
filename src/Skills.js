import React, { Component } from 'react';
import key from './key';
import Plot from 'react-plotly.js';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import commonWords from './CommonWords'


//Reiterate through each job description and count the frequency of each word
function count(array) {
   //console.log(array)
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
   console.log(topWords)
   //Converts object to two arrays, one for the word and another for the frequency
   let result = Object.keys(topWords);
   let count = Object.values(topWords);
   return [result, count];
}

class Skills extends Component {
   constructor(props) {
      super(props);
      this.state = {
         jobArray: [],
         isLoaded: false,
         jobTitle: null
      }
   }

   //Fetches results from the search bar
   getData(jobTitle) {
      jobTitle = jobTitle.replace(/\s+/g, '%20')
      let url = 'https://data.usajobs.gov/api/search?Keyword=' + jobTitle + '&ResultsPerPage=500';
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
            console.log(data.SearchResult.SearchResultItems)
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
      let data = count(this.state.jobArray);
      let plot;
      if (!this.state.isLoaded) {
         plot = <div></div>
      } else {
         plot = <div id="jobTitlePlot"><Plot
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
      return (
         <div>
            <div>
               <p>Search for a job title to see the most words that appear in the qualifications for the searched job!</p>
               <input className="form-control" onChange={(event) => this.handlejobTitleChange(event)} type="text" placeholder="Enter a job title" />
               <Button color="primary" size="sm" onClick={() => this.handleClick()}>Search</Button>
            </div>
            <h3>Results</h3>
            {plot}
         </div>
      );
   }
}

export default Skills;
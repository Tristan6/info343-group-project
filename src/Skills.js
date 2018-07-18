import React, { Component } from 'react';
import key from './key';
import Plot from 'react-plotly.js';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

//Reiterate through each job description and count the frequency of each word
function count(array) {
   //console.log(array)
   let words = {};
   //Reiterates through job results and creates a object with the word as a key and frequency as a value
   for (let i = 0; i < array.length; i++) {
      let summary = array[i].MatchedObjectDescriptor.QualificationSummary;
      console.log(summary)
      let wordsArray = summary.split(" ")
      for (let j = 0; j < wordsArray.length; j++) {
         let wordKey = wordsArray[j];
         if (wordsArray[j] in words) {
               words[wordKey] = words[wordKey] + 1;

         } else {
            words[wordKey] = 1;
         }
      }

      //Filters out the words with length of greater than 10 or less than 4
      for (let key in words) {
         let wordKey = key;
         /*if (words[wordKey] > 10 || words[wordKey] < 4) {
            console.log[words[wordKey]]
            delete words[wordKey]
         }*/
      }
   }
   //Converts object to two arrays, one for the word and another for the frequency
   let result = Object.keys(words);
   console.log(words)
   let count = Object.values(words);
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
      let url = 'https://data.usajobs.gov/api/search?Keyword=' + jobTitle;
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

   handlejobTitleChange(event) {
      this.setState({ jobTitle: event.target.value });
   }

   handleClick() {
      this.getData(this.state.jobTitle);
   }

   render() {
      console.log(this.state.jobArray)
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
               <p>Search for a job title to see the most common skills or requirements for the searched job!</p>
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
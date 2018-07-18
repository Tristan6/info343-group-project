import React, { Component } from 'react';
import key from './key';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function count(array) {
   let min = 0;
   let max = 0;
   array.sort();
   for (let i = 0; i < array.length; i++) {
      min += Number(array[i].MatchedObjectDescriptor.PositionRemuneration[0].MinimumRange)
      max += Number(array[i].MatchedObjectDescriptor.PositionRemuneration[0].MaximumRange)
   }

   min = Math.round(min / array.length);
   max = Math.round(max / array.length);
   //Courtesy to https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
   let numberWithCommas = (x) => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   }
   let minString = numberWithCommas(min)
   let maxString = numberWithCommas(max)
   return [minString, maxString];
}

class Salary extends Component {
   constructor(props) {
      super(props);
      this.state = {
         jobArray: [],
         isLoaded: false,
      }
   }

   getData(jobTitle) {
      jobTitle = jobTitle.replace(/\s+/g, '%20')
      let url = 'https://data.usajobs.gov/api/search?PositionTitle=' + jobTitle;
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
            console.log(this.state.jobArray)
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
      return (
         <div>
            <div>
               <p>Search for a job title to view it's average salary range!</p>
               <input className="form-control" onChange={(event) => this.handlejobTitleChange(event)} type="text" placeholder="Enter a Location" />
               <Button color="primary" size="sm" onClick={() => this.handleClick()}>Search</Button>
            </div>
            <h3>Results</h3>
            <p> The average range is ${data[0]} to ${data[1]}</p>
         </div>
      );
   }
}

export default Salary;
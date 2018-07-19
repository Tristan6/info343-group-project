import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { LocationBarGraph } from './Location';
import { HiringBarGraph } from './Hiring';
import { SkillsBarGraph } from './Skills';

class RecentSearches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recentSearches: [],
            screenWidth: (
                window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth
            )
        }
    }

    componentDidMount() {
        // If logged in, listen for new values
        if (firebase.auth().currentUser !== null) {
            let userId = firebase.auth().currentUser.uid;
            this.searchesRef = firebase.database().ref(userId);
            this.searchesRef.on('value', (snapshot) => {
                this.setState({ recentSearches: snapshot.val() });
            })
        }

    }

    componentWillUnmount() {
        // If logged in, stop listening to new values
        if (this.searchesRef !== undefined) {
            this.searchesRef.off();
        }
    }

    render() {
        if (!this.state.recentSearches) return null;
        let searchKeys = Object.keys(this.state.recentSearches);
        let searchesArray = searchKeys.map((key) => {
            let searchObj = this.state.recentSearches[key];
            searchObj.id = key;
            return searchObj;
        });

        let searchItems = searchesArray.map((search) => {
            return <ShowBarGraphModal key={search.id} savedObj={search} screenWidth={this.state.screenWidth} />
        });

        return (
            <div>
                <div className="margin-left">
                    <h2 className="center-small">Your Recent Searches</h2>
                </div>

                <div className="container">
                    <div className="blue-bar-rs-tab"></div>
                    {searchItems}
                </div>
            </div>
        );
    }
}

export default RecentSearches;

class ShowBarGraphModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        this.barGraph = <div></div>;

        if (this.state.modal) {
            if (this.props.savedObj.typeOfSearch === "location") {
                this.barGraph = (
                    <LocationBarGraph
                        data={this.props.savedObj.searchResults}
                        isLoaded={true}
                        errorMessage={false}
                        screenWidth={this.props.screenWidth}
                    />
                );
            } else if (this.props.savedObj.typeOfSearch === "hiring") {
                this.barGraph = (
                    <HiringBarGraph
                        data={this.props.savedObj.searchResults}
                        isLoaded={true}
                        errorMessage={false}
                        screenWidth={this.props.screenWidth}
                    />
                );
            } else {
                this.barGraph = (
                    <SkillsBarGraph
                        data={this.props.savedObj.searchResults}
                        isLoaded={true}
                        errorMessage={false}
                        screenWidth={this.props.screenWidth}
                    />
                )
            }
        }


        return (
            <div className="search-item">
                <Button color="danger" onClick={this.toggle}>{this.props.savedObj.searchTerm}</Button>
                <Modal size='lg' isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{this.props.savedObj.searchTerm}</ModalHeader>
                    <ModalBody>
                        {this.barGraph}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

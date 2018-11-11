import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'

class PlacesSearch extends Component {
	state = {
		query: ''
		// ,
		// searchResults: this.props.markers
	}

	updateQuery(query) {
		const { markers, updateSearchResultMarkers } = this.props;


		this.setState({query}, () => {
			let searchResults;
			if (this.state.query) {
				const match = new RegExp(escapeRegExp(query),'i')
				searchResults = markers.filter((marker) => match.test(marker.title))
				
			} else if (this.state.query === '') {
				searchResults = markers
			}

			updateSearchResultMarkers(searchResults)
		})	

	}

	render () {

		return (
			<div>
				<input 
					type="text" 
					placeholder="Search route"
					onChange={(evt) => this.updateQuery(evt.target.value)}
				></input>
			</div>
		)
	}
}

export default PlacesSearch;
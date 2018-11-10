import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp'

class PlacesSearch extends Component {
	state = {
		query: '',
		searchResults: this.props.markers
	}

	search(marker, places) {
		for (var place of places) {
			if (marker.title === place.name) {
				marker.setMap(null)
			}
		}
	}

	updateQuery(query) {
		const { markers, updatevisibleMarkers, infoWindows } = this.props;
		this.setState({query})

		markers.map(marker => marker.setVisible(false))

		if (query) {
			// console.log(infoWindows)
			infoWindows.map(infoWindow => infoWindow.close())

			const match = new RegExp(escapeRegExp(query),'i')
			let searchResults = markers.filter((marker) => match.test(marker.title))

			updatevisibleMarkers(searchResults)
			this.setState({searchResults})
		} 
		if (query === '') {
			this.setState({searchResults: markers})
			updatevisibleMarkers(markers)
		}

	}

	render () {

		return (
			<div>
				<input 
					type="text" 
					placeholder="Search route"
					onChange={(evt) => this.updateQuery(evt.target.value)}
				></input>
				{this.state.searchResults.forEach(marker => {
					marker.setVisible(true)
				})}
			</div>
		)
	}
}

export default PlacesSearch;
import React, { Component } from 'react';

class PlacesList extends Component {
	
	// TODO: check propptypes



	selectMarker (selectedMarker, visibleMarkers) {
		const { updateSelectedMarker } = this.props

		updateSelectedMarker(selectedMarker);
	}

	displaySelectedMarker(selectedMarker, visibleMarkers) {
		if (selectedMarker) {
			this.highlightMarker(selectedMarker, visibleMarkers)
			this.highlightListItem(selectedMarker)
		}
	}

	highlightMarker(selectedMarker, visibleMarkers) {
		visibleMarkers.forEach(marker => {
			marker.setIcon('https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png')
			marker.setAnimation(null)
		})

		selectedMarker.setIcon('https://www.google.com/mapfiles/marker_green.png')
		selectedMarker.setAnimation(window.google.maps.Animation.BOUNCE)
	}

	highlightListItem(selectedMarker) {
		const listItems = document.getElementsByTagName('li')
		for (let item of listItems) {
			if (item.innerHTML === selectedMarker.title) {
				// bold the selected item
				item.style.fontWeight='bold';
			} else {
				// unbold all list items
				item.style.fontWeight = 'normal'
			}
		}		
	}

	render () {
		const { visibleMarkers, selectedMarker } = this.props
		this.displaySelectedMarker(selectedMarker, visibleMarkers)

		return (
			<React.Fragment>
				{visibleMarkers.map(marker => 
					<li 
						key={marker.title}
						onClick = {(evt) => this.selectMarker(marker, visibleMarkers)}
						>{marker.title}
					</li>
				)}

			</React.Fragment>
		)
	}
}

export default PlacesList
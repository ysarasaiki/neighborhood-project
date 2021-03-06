import React, { Component } from 'react';

class PlacesList extends Component {
	
	// TODO: check propptypes


	highlightListItem(selectedMarker) {
		const listItems = document.getElementsByTagName('li')
		for (let item of listItems) {
			if (item.innerHTML === selectedMarker.title) {
				// add clas to selected item
				item.className += 'selected'
			} else {
				// deselect
				item.classList.remove('selected')
			}
		}		
	}

	render () {
		const { searchResultMarkers, openMarker } = this.props

		return (
			<React.Fragment>
				{searchResultMarkers.map((marker, index) => 
					<li 
						key={marker.title}
						onClick = {() => {
							openMarker(marker)
							this.highlightListItem(marker)
						}}
						tabIndex = {index + 1}
					><div role = "listitem">{marker.title}</div>
					</li>
				)}

			</React.Fragment>
		)
	}
}

export default PlacesList
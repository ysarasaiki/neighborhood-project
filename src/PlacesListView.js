import React, { Component } from 'react';

class PlacesList extends Component {
	
	// TODO: check propptypes
	
	render () {
		const { places } = this.props
		console.log(places)
		return (
			<React.Fragment>
				{places.map(place => 
					<li key={place.id}>{place.name}</li>
				)}

			</React.Fragment>
		)
	}
}

export default PlacesList
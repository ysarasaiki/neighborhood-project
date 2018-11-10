import React, { Component } from 'react';
import './App.css';
import PlacesList from './PlacesListView.js';
import PlacesSearch from './PlacesSearch.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Hard-code climbing areas.. TODO: dropdown of areas
      // areaName: 'Donner Pass',
      // areaLoc: {
      //   lat: 39.33,
      //   lng: -120.335
      // },
      areaName: 'Yosemite',
      areaLoc: {
        lat: 37.74,
        lng: -119.573
      },
      places: [],
      markers: [],
      visibleMarkers: [],
      selectedMarker: null
    };
    
    this.updatevisibleMarkers = this.updatevisibleMarkers.bind(this)
    this.updateSelectedMarker = this.updateSelectedMarker.bind(this)

  }



  loadAsyncScript(src) {

    const script = window.document.createElement('script');

    script.src = src;
    script.async = true;
    script.onerror = function() {
      document.write('Script failed')
    }

    document.body.appendChild(script);
  }

  componentDidMount() {
    window.initMap = this.initMap.bind(this);
    

    const ApiKey = 'AIzaSyD_uPwl5iUqJPQpqBzrKQNpPxX1BoqbyPk';
    const source = `https://maps.googleapis.com/maps/api/js?key=${ApiKey}&callback=initMap`;

    this.loadAsyncScript(source);
  }

  getData () {
    return new Promise(resolve => {
      const lat = this.state.areaLoc.lat;
      const lng = this.state.areaLoc.lng;

      // get Marker Data from Mountain Project API 
      const apiKey = '200185210-f8a4389a5a9f500ff4af0996569a855a';
      const source = `https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=${lat}&lon=${lng}&maxDistance=10&minDiff=5.6&maxDiff=5.10&key=${apiKey}`

      // Fetch Mountain Project API
      fetch(source)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(results => {
        resolve(results.routes.filter(route => route.stars >= 4.5))
      })
      .catch(error => console.log('There was an error with getting Mountain Project data!'))

    })
  }

  initMap() {
    const google = window.google;
    const mapDiv = document.getElementById('map');

    const map = new google.maps.Map(mapDiv, {
      center: this.state.areaLoc,
      zoom: 13
    });

    var infowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    const markers = [];
    const infoWindows = [];

    // Call function to get places data
    this.getData()

    .then(classicRoutes => {
      this.setState({places: classicRoutes})

      classicRoutes.forEach(route => {
        // console.log(route)
        var marker = new google.maps.Marker({
          map: map,
          position: {
            lat: route.latitude,
            lng: route.longitude
          },
          title: route.name
        });

        marker.addListener('click', function () {
          infowindow.marker = marker;
          infowindow.setContent(
            `<h3>${route.name}</h3>`+
            `<div>${route.type}</div>`+
            `<div>Rating: ${route.rating}</div>`+
            `<div>Stars: ${route.stars}, (${route.starVotes} reviews)</div>`+
            `<a href=${route.url}>Mountain Project</a>`+
            `<div><img src=${route.imgSmall}></div>`
            );
          infowindow.open(map, marker)
          this.setState({selectedMarker: marker})

        }.bind(this));
        
        markers.push(marker);
        infoWindows.push(infowindow)
        bounds.extend(marker.position);
      })

    })
    .then(() => {
      this.setState({markers})
      this.setState({infoWindows})
      this.setState({visibleMarkers: markers})

      map.fitBounds(bounds)
    })

    // Set map height based on current window height
    const headerHeight = document.getElementById('areaTitle').clientHeight
    mapDiv.style.height = window.innerHeight - headerHeight + 'px'

    // Dynamically change map size and resize to fit all markers
    window.addEventListener('resize', function() {
      mapDiv.style.height = window.innerHeight - headerHeight + 'px';
      map.fitBounds(bounds)
    })
  } 

  updatevisibleMarkers(visibleMarkers) {
    this.setState({visibleMarkers})
  }

  updateSelectedMarker(selectedMarker) {
    this.setState({selectedMarker})
  }

  toggleMenu() {
    document.getElementById('list-container').classList.toggle('closed')
  }

  render() {
    return (
      <div id="container">
        <header id="areaTitle">
          <button 
            className="hamburgerIcon"
            onClick = {this.toggleMenu}
          ></button>
          <h1>{this.state.areaName} Classic Climbing Routes!</h1>
        </header>
         <div id="main">
          <div id="list-container" className="closed">
            <div id="search-container">
              <PlacesSearch 
                places = {this.state.places}
                updatevisibleMarkers = {this.updatevisibleMarkers}
                markers = {this.state.markers}
                infoWindows = {this.state.infoWindows}
              />
            </div>
            <ul id="places-list">
              <PlacesList 
                visibleMarkers = {this.state.visibleMarkers}
                selectedMarker = {this.state.selectedMarker}
                updateSelectedMarker = {this.updateSelectedMarker}
              />

            </ul>
          </div>
          <div id="map-container">
            <div id="map"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

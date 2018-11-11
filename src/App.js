import React, { Component } from 'react';
import './App.css';
import PlacesList from './PlacesListView.js';
import PlacesSearch from './PlacesSearch.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areaName: 'Yosemite',
      areaLoc: {
        lat: 37.74,
        lng: -119.573
      },
      places: '',
      infowindow: '',
      markers: [],
      searchResultMarkers: []
    }

    this.generateMarkers = this.generateMarkers.bind(this)
    this.openMarker = this.openMarker.bind(this)
    this.updateSearchResultMarkers = this.updateSearchResultMarkers.bind(this)
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
    return new Promise((resolve) => {
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
        // console.log(results)
        return results.routes.filter(route => route.stars >= 4.5)
      })
      .then(filteredResults => {
        resolve(this.setState({places: filteredResults}))
      })
      .catch(error => console.log('There was an error with getting Mountain Project data!'))

    })
  }

  initMap() {
    const mapDiv = document.getElementById('map');

    const map = new window.google.maps.Map(mapDiv, {
      center: this.state.areaLoc,
      zoom: 13,
      disableDefaultUI: true
    });

    const infowindow = new window.google.maps.InfoWindow();

    this.setState({
      map: map,
      infowindow: infowindow
    })

    this.getData().then(() => {
      this.generateMarkers()
    })

    // Set map height based on current window height
    const headerHeight = document.getElementById('areaTitle').clientHeight
    mapDiv.style.height = window.innerHeight - headerHeight + 'px'

    // Dynamically change map size and resize to fit all markers
    window.addEventListener('resize', function() {
      mapDiv.style.height = window.innerHeight - headerHeight + 'px';
      // map.fitBounds(bounds)
    })
  }

  generateMarkers() {
    const self = this;
    var bounds = new window.google.maps.LatLngBounds();
    var markers = [];

    this.state.places.forEach(place => {
      var marker = new window.google.maps.Marker({
        map: this.state.map,
        position: {
          lat: place.latitude,
          lng: place.longitude
        },
        title: place.name
      })

      marker.addListener('click', function() {
        self.openMarker(marker)
      })

      bounds.extend(marker.position)
      markers.push(marker)
    })

    this.state.map.fitBounds(bounds)
    this.setState({
      markers: markers,
      searchResultMarkers: markers
    })

  } 

  openMarker (marker) {
    const infowindow = this.state.infowindow

    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.open(this.state.map, marker)
    }

    this.loadInfowindowContent(marker);
    marker.setAnimation(window.google.maps.Animation.DROP)



    this.state.map.setCenter(marker.position)
  }

  loadInfowindowContent(marker) {
    let placeInfo = this.state.places.filter(place => place.name === marker.title)[0]

    const infowindowContent = 
      `<h3>${placeInfo.name}</h3>`+
      `<div>${placeInfo.type}</div>`+
      `<div>Rating: ${placeInfo.rating}</div>`+
      `<div>Stars: ${placeInfo.stars}, (${placeInfo.starVotes} reviews)</div>`+
      `<a href=${placeInfo.url}>Mountain Project Link</a><br>`+
      `<img src=${placeInfo.imgSmall}>`

    this.state.infowindow.setContent(infowindowContent)
  }

  updateSearchResultMarkers(searchResultMarkers) {
    this.setState({searchResultMarkers}, () => {
      // close open infowindow
      this.state.infowindow.close()
      
      // initially hide all markers
      this.state.markers.map(marker => marker.setVisible(false))
      
      var bounds = new window.google.maps.LatLngBounds();
      
      if (this.state.searchResultMarkers.length !== 0) {
        this.state.searchResultMarkers.forEach(marker => {
          marker.setVisible(true)
          bounds.extend(marker.position)
        })

        this.state.map.fitBounds(bounds)
      }

      // show only search result markers
    })
  }

  toggleMenu() {
    const sideBar = document.getElementById('sidebar')
    sideBar.classList.toggle('closed')
    
    const mapDiv = document.getElementById('map')
    mapDiv.classList.toggle('menu-open')
  }

  render() {
    // {console.log(this.state.searchResultMarkers)}
    return (
      <div id="container">
        <header id="areaTitle">
          <button 
            className="hamburgerIcon"
            onClick = {this.toggleMenu}
          ></button>
          <h1>{this.state.areaName} Classic Climbing Routes!</h1>
        </header>
         <div id="sidebar" className="closed">
          <div id="list-container">
            <div id="search-container">
              <PlacesSearch 
                markers = {this.state.markers}
                updateSearchResultMarkers = {this.updateSearchResultMarkers}
              />
            </div>
            <ul id="places-list">
              <PlacesList 
                searchResultMarkers = {this.state.searchResultMarkers}
                openMarker = {this.openMarker}
              />
            </ul>
            <div id="att-div">
              <p id="attribution">Data from Mountain Project API</p>
            </div>
          </div>
        </div>
        <div id="main">
          <div id="map-container">
            <div id="map"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

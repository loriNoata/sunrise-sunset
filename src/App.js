import React, {Component} from 'react';
import {googleMap_key} from './constants'; 
import {WrappedMap} from './Comp/Map'; 
import './App.css';
 
class App extends Component{
	constructor(props) {
    super(props); 
    
    this.state = {
      mapData: {
        lat: '', 
        lng: ''
      }
     }
  }



  render() {
   
    return (
      <div>
        <WrappedMap 
            googleMapURL= {`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${googleMap_key}`} 
            loadingElement={<div style={{ height: `100vh` }} />}
            containerElement={<div style={{ height: `100vh` }} />}
            mapElement={<div style={{ height: `100vh` }} />}
            // defaultCenter = {this.props.defaultCenter}

        />
      </div>
     );
  }
}

export default App;

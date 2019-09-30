import React, {Component} from 'react';
import {GoogleMap, withScriptjs, withGoogleMap, InfoWindow} from 'react-google-maps'; 
import {root_sunrisesunsetAPI, googleMapApi_timezone, googleMap_key} from '../constants'; 
import sun from './icons/sun.svg';
import moon from './icons/moon.svg';
import moment from 'moment';
 
import './map.css'; 
require('moment-timezone');

 


export default class Map extends Component{
    constructor(props) {
        super(props); 
       
        this.state = {
            latitude: 44.72, 
            longitude: 26.666, 
            mapCenter : {
                lat : 44.72, 
                lng : 26.666,
            }, 
            zoomMap: 5, 
            mapData :null, 
            timeZoneId: null, 
            timeZone: null, 
            isDay: null
        }

        this.onInfoWindowClose = this.onInfoWindowClose.bind(this);
        this.onHandleCoordinate = this.onHandleCoordinate.bind(this);
        this.setMapDataWithCoordintates = this.setMapDataWithCoordintates.bind(this);
        this.getTimezoneIdFromCoordinates = this.getTimezoneIdFromCoordinates.bind(this);
        this.setTimeZone = this.setTimeZone.bind(this);
        this.getCityFromTimezoneId = this.getCityFromTimezoneId.bind(this);
        
    }
 

    onInfoWindowClose() {
        this.setState({ 
            mapData: null
        })
    }

    setMapDataWithCoordintates(lat, lng){
        let latitude = `lat=${lat}`;
        let longitude  = `lng=${lng}`; 
        let newApiLink = `${root_sunrisesunsetAPI}${latitude}&${longitude}`

        fetch(newApiLink)
            .then(data => data.json())
            .then(data => {
                this.setState({
                    mapData: data.results, 
                    latitude: lat, 
                    longitude: lng, 
                    mapCenter : {
                        lat: lat, 
                        lng: lng, 
                    }, 
                    zoomMap: 10
                });
        });    
    }

    getTimezoneIdFromCoordinates(lat, lng) {
        let timezoneApi = `${googleMapApi_timezone}location=${lat},${lng}&timestamp=1458000000&key=${googleMap_key}`; 
 
       fetch(timezoneApi)
            .then(data => data.json())
            .then(data => {
                this.setTimeZone(data.timeZoneId); 
                this.setState({
                    timeZoneId: data.timeZoneId
                });     
        }); 
    }



    onHandleCoordinate(event){
        let lat = event.latLng.lat();
        let lng = event.latLng.lng();
 
        this.setMapDataWithCoordintates(lat, lng);
        this.getTimezoneIdFromCoordinates(lat, lng);
    }
 
    setTimeZone(timeZoneId) {
        let d = new Date();
        const formatedTimeZone = moment(d).tz(timeZoneId).format('h:mm:ss A');  
        this.setState({
            timeZone: formatedTimeZone
        })
        return formatedTimeZone
    }

    getCityFromTimezoneId(timeZoneId){
        const term= '/';
        const indexOfTerm = parseInt(timeZoneId.indexOf(term));
        return timeZoneId.slice(indexOfTerm+1)
    }

    greetingMessage(sunrise, sunset, time) {
        const dateText = moment().format('DD/MM/YYYY ');
        const sunriseDateTime = moment(dateText + sunrise)
        const sunsetDateTime = moment(dateText + sunset)
        const currentDateTime = moment(dateText + time)

        if (currentDateTime.isAfter(sunriseDateTime) && currentDateTime.isBefore(sunsetDateTime)) {
            this.setState({
                isDay: true
            }); 
            return "Good day"
        }else{
            this.setState({
                isDay: false
            }); 
            return "Good night"
        }
    }

    render() {
       
        return(
            <GoogleMap 
                google = {this.props.google}
                defaultZoom ={this.state.zoomMap} 
                defaultCenter = {this.state.mapCenter}
                onClick= {this.onHandleCoordinate} 
                latitude = {this.state.latitude}
                longitude = {this.state.longitude}
            >
              { (this.state.mapData) && 

                <InfoWindow  onCloseClick={this.onInfoWindowClose} position={{lat: this.state.latitude, lng: this.state.longitude}}>
                    <div className="infoWindow" >
                        {(this.state.isDay)} <img src={sun}/>  
                        {/* <img src={moon}/>  */}
                        <h1 style={{textAlign: "center"}}>{this.greetingMessage(this.state.mapData.sunrise,this.state.mapData.sunset, this.state.timeZone )} ,  {this.getCityFromTimezoneId(this.state.timeZoneId)}</h1>
                        <p> Time in  {this.getCityFromTimezoneId(this.state.timeZoneId)}: {this.state.timeZone} </p>
                        <p> sunrise: {this.state.mapData.sunrise} | sunset: {this.state.mapData.sunset} </p>
                       
                    </div>
                  
                </InfoWindow>
             }
        
              </GoogleMap>
          ) 
    }
    
  }
  
  export const WrappedMap = withScriptjs(withGoogleMap(Map))
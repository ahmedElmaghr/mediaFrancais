import React, { Component } from "react";
import { feature } from "topojson-client"
import * as d3 from "d3";
import medias_francais_mock from "./MediaFrancais/data/medias_francais.tsv";
import relations_medias_francais_mock from "./MediaFrancais/data/relations_medias_francais.tsv";
import MediaFrancais from "./MediaFrancais/MediaFrancais";
import WordMapConnections from "./WorldMapConnection/WordMapConnections";
import connections from "./WorldMapConnection/connections.csv"
import capitalsPopulation from "./WorldMapConnection/capitals-population.csv"



export default class App extends Component {
  
                 constructor(props) {
                   super(props);
                   this.state = {
                     //media file
                     medias_francais : [],
                     //relation media
                     relations_medias_francais : [],
                     //Data for map creations
                     worldData: [],
                     jsonData :[],
                     //Data for cities with most populations
                     cities: [],
                     //Link between cities
                     connections : []
                   };
                 }

                 componentDidMount() {
                  this.updateWordMapJson();      
                  this.updateWordMap();
                  this.updateCitiesFromCsvFile(capitalsPopulation);
                  this.updateConnections(connections);
                }

                 render() {
                  
                  const {worldData, cities, connections,jsonData} = this.state;
                  return (
                    <div>
                      <WordMapConnections 
                          worldData = {worldData} 
                          cities = {cities} 
                          connections = {connections}
                          jsonData={jsonData}
                    ></WordMapConnections>
                    </div>
                  )
                  
                }
                changeTheme = (theme)=>{
                  var mediaFiltered = this.state.medias_francais.filter((d)=>d.theme==theme);
                  console.log("mediaFiltered",mediaFiltered);
                  this.setState({
                    medias_francais : mediaFiltered,
                  })
                  console.log("this.state.medias_francais",this.state.medias_francais);
                 }

                readMediaFile = () =>{
                 
                  d3.tsv(medias_francais_mock).then(response =>{
                    this.setState({
                      medias_francais : response
                    }
                    )
                  });
                }

                readRelationFile = () =>{
                 
                  d3.tsv(relations_medias_francais_mock).then(response =>{
                    this.setState({
                      relations_medias_francais : response
                    })
                  });
                }


                 updateCitiesFromCsvFile = file => {
                   d3.csv(file).then(data => {
                     data.map((row,i) => {
                      this.formatRow(row);
                       var coordinate = [row.x, row.y];
                       data[i] = [row.name, coordinate, row.population];
                     });
                     this.setState({
                       cities: data
                     });
                   });
                 };

                 updateConnections = file => {
                  d3.csv(file).then(data => {
                      this.setState({
                        connections : data,
                      }

                      )
                  });
                };

                
                 formatRow = (row) =>{
                  row.x = +row.x;
                  row.y = +row.y;
                  row.population = +row.population;
                 }

                 updateWordMapJson() {
                  var jsonData = require("./WorldMapConnection/data/countries-10m.json");
                       this.setState({
                        jsonData: jsonData,
                        worldData : feature(jsonData,jsonData.objects.countries).features,
                        });
                  }

                updateWordMap(){
                    fetch(
                      "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-10m.json"
                    ).then(response => {
                      if (response.status !== 200) {
                        console.log(`There was a problem: ${response.status}`);
                        return;
                      }
                      response.json().then(worldData => {
                        this.setState({
                          worldData: feature(worldData,worldData.objects.countries).features,
                          jsonData : worldData
                         });
                       });
                     });
                  }
                 updateCities() {
                   this.setState({
                     cities: this.getCities()
                   });
                 }
                 getCities() {
                   return [
                     {
                       name: "Tokyo",
                       coordinates: [139.6917, 35.6895],
                       population: 37843000
                     },
                     {
                       name: "Jakarta",
                       coordinates: [106.865, -6.1751],
                       population: 30539000
                     },
                     {
                       name: "Delhi",
                       coordinates: [77.1025, 28.7041],
                       population: 24998000
                     },
                     {
                       name: "Manila",
                       coordinates: [120.9842, 14.5995],
                       population: 24123000
                     },
                     {
                       name: "Seoul",
                       coordinates: [126.978, 37.5665],
                       population: 23480000
                     },
                     {
                       name: "Shanghai",
                       coordinates: [121.4737, 31.2304],
                       population: 23416000
                     },
                     {
                       name: "Karachi",
                       coordinates: [67.0099, 24.8615],
                       population: 22123000
                     },
                     {
                       name: "Beijing",
                       coordinates: [116.4074, 39.9042],
                       population: 21009000
                     },
                     {
                       name: "New York",
                       coordinates: [-74.0059, 40.7128],
                       population: 20630000
                     },
                     {
                       name: "Guangzhou",
                       coordinates: [113.2644, 23.1291],
                       population: 20597000
                     },
                     {
                       name: "Sao Paulo",
                       coordinates: [-46.6333, -23.5505],
                       population: 20365000
                     },
                     {
                       name: "Mexico City",
                       coordinates: [-99.1332, 19.4326],
                       population: 20063000
                     },
                     {
                       name: "Mumbai",
                       coordinates: [72.8777, 19.076],
                       population: 17712000
                     },
                     {
                       name: "Osaka",
                       coordinates: [135.5022, 34.6937],
                       population: 17444000
                     },
                     {
                       name: "Moscow",
                       coordinates: [37.6173, 55.7558],
                       population: 19170000
                     },
                     {
                       name: "Dhaka",
                       coordinates: [90.4125, 23.8103],
                       population: 15669000
                     },
                     {
                       name: "Greater Cairo",
                       coordinates: [31.2357, 30.0444],
                       population: 15600000
                     },
                     {
                       name: "Los Angeles",
                       coordinates: [-118.2437, 34.0522],
                       population: 15058000
                     },
                     {
                       name: "Bangkok",
                       coordinates: [100.5018, 13.7563],
                       population: 14998000
                     },
                     {
                       name: "Kolkata",
                       coordinates: [88.3639, 22.5726],
                       population: 14667000
                     },
                     {
                       name: "Buenos Aires",
                       coordinates: [-58.3816, -34.6037],
                       population: 14122000
                     },
                     {
                       name: "Tehran",
                       coordinates: [51.389, 35.6892],
                       population: 13532000
                     },
                     {
                       name: "Istanbul",
                       coordinates: [28.9784, 41.0082],
                       population: 13287000
                     },
                     {
                       name: "Lagos",
                       coordinates: [3.3792, 6.5244],
                       population: 13123000
                     },
                     {
                       name: "Shenzhen",
                       coordinates: [114.0579, 22.5431],
                       population: 12084000
                     },
                     {
                       name: "Rio de Janeiro",
                       coordinates: [-43.1729, -22.9068],
                       population: 11727000
                     },
                     {
                       name: "Kinshasa",
                       coordinates: [15.2663, -4.4419],
                       population: 11587000
                     },
                     {
                       name: "Tianjin",
                       coordinates: [117.3616, 39.3434],
                       population: 10920000
                     },
                     {
                       name: "Paris",
                       coordinates: [2.3522, 48.8566],
                       population: 10858000
                     },
                     {
                       name: "Lima",
                       coordinates: [-77.0428, -12.0464],
                       population: 10750000
                     }
                   ];
                 }

                 handleFiles = files => {
                   var reader = new FileReader();
                   reader.onload = function() {
                     // Use reader.result
                     alert(reader.result);
                   };
                   reader.readAsText(files[0]);
                 };
                 onFileChange = e => {
                   let files = e.target.files;
                   let reader = new FileReader();
                   reader.readAsDataURL(files[0]);
                   reader.onload = e => {
                     console.warn(e.target.result);
                   };
                 };

               } 
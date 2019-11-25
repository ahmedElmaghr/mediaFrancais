import * as d3 from "d3";
import React, { Component } from "react";
import { merge} from "topojson-client"
import "./MediaFrancais.css"

export default class MediaFrancais extends Component {
                 //Constantes

                 width = "100%";
                 height = "100%";
                 scale = 250;
                 lastX = 0;
                 lastY = 0;
                 origin = {
                   x: 55,
                   y: -40
                 };
                 viewBox = "0 0 800 450";
                 borderColor = "red";

                 constructor(props) {
                   super(props);
                   this.state = {
                     medias_francais: this.props.medias_francais,
                     isMapLoaded: false
                   };
                   this.changeTheme = this.changeTheme.bind(this);
                 }
                 componentWillMount() {
                   console.log("componentWillMount");

                   //Draw svg Wrapper
                   var svg = this.drawSvgWrapper();
                   var gGlobal = svg.append("g").attr("id", "gWrapper");
                   //Draw Path from worldData
                   var g = this.drawMap(gGlobal, this.props.worldData);
                  //merge Morocco
                  var jsonData = this.props.jsonData;
                    //Moroccan Sahar id = 732
                   //Morocco id = 504
                  var morocco = jsonData.objects.countries.geometries.filter((d)=> d.id==504);
                  var morrocanSahara = jsonData.objects.countries.geometries.filter((d)=> d.id==732);
                  var toBeMerged = [morocco[0],morrocanSahara[0]];
                  //
                  console.log("g",g);
                  console.log("morocco",morocco);
                  console.log("morrocanSahara",morrocanSahara);
                  console.log("toBeMerged",toBeMerged);
                  g.append("path").datum(merge(jsonData,toBeMerged))
                  .attr("className", "country")
                  .attr("d", d => this.calculatePath(d))
                  .attr("stroke", this.borderColor)
                  .attr("stroke-width", 0.05)
                  .attr("fill", "rgba(44, 130, 201, 1)");
                  console.log("g",g);

                }

                 componentDidMount() {
                   console.log("call the componentDidMount");
                 }

                 componentDidUpdate() {
                   console.log("call didComponentUpdate");
                 }
                 render() {
                   this.initMarkersAndLinks();
                   console.log("call MediaFrancais render");
                   const medias_francais = this.state.medias_francais;
                   const { worldData, relations_medias_francais } = this.props;
                   if (worldData.length > 0) {
                     this.createWorldMap(
                       medias_francais,
                       relations_medias_francais
                     );
                     this.showMarkersOnFirstOrder();
                   }
                   return (
                     <div className="dropdown">
                    <select
                         id="mySelect"
                         className="dropbtn"
                         onChange={e => {this.changeTheme(e.target.value);                         }}
                       >
                         <option value="0">All theme</option>
                         <option value="1">Theme 1</option>
                         <option value="2">Theme 2</option>
                         <option value="3">Theme 3</option>
                         <option value="4">Theme 4</option>
                      </select>
                    </div>
                   );
                 }

                 initMarkersAndLinks = () => {
                   d3.selectAll(".markers").remove();
                   d3.selectAll(".paths").remove();
                 };
                 changeTheme = theme => {
                   if (theme == 0) {
                     this.setState({
                       ...this.state,
                       medias_francais: this.props.medias_francais
                     });
                   } else {
                     var mediaFiltered = this.props.medias_francais.filter(
                       d => d.theme == theme
                     );
                     this.setState({
                       ...this.state,
                       medias_francais: mediaFiltered
                     });
                   }
                 };

                 showMarkersOnFirstOrder = () => {
                   d3.select(".markers").raise();
                 };
                 //Create the world map
                 createWorldMap = (
                   medias_francais,
                   relations_medias_francais
                 ) => {
                   var gGlobal = d3.select("#gWrapper");
                   //Draw Medias
                   this.drawMediaPosition(gGlobal, medias_francais);
                   //Draw connexions
                   this.drawCnx(
                     gGlobal,
                     relations_medias_francais,
                     medias_francais
                   );
                   //add zoom
                   this.addZoom(gGlobal);
                 };

                 //Draw svg wrapper for map
                 drawSvgWrapper() {
                   //Construct Body
                   var body = d3.select("body");
                   var divGlobal = body
                     .append("div")
                     .attr("id", "map")
                     .attr("style", "border-style:dashed");
                   //Construct SVG
                   var svg = divGlobal
                     .append("svg")
                     .attr("id", "content")
                     .attr("width", this.width)
                     .attr("height", this.height)
                     .attr("viewBox", this.viewBox)
                     .attr(
                       "transform",
                       "translate(" +
                         this.width / 2 +
                         "," +
                         this.height / 2 +
                         ")"
                     );
                   //Draw G for map
                   return svg;
                 }

                 //Draw the world Map
                 drawMap = (node, worldData) => {
                   if (!this.state.isMapLoaded) {
                     var g = node
                       .append("g")
                       .attr("id", "worldMap")
                       .attr("className", "countries");
                     g.selectAll("path")
                       .data(worldData)
                       .enter()
                       .append("path")
                       .attr("key", i => `path-${i}`)
                       .attr("d", d => this.calculatePath(d))
                       .attr("className", "country")
                       //.attr("fill", (d, i) => this.color(worldData, d, i))
                       .attr("fill", (d, i) => `rgba(38,50,56,${(1 / worldData.length) * i})`)
                       .attr("stroke", this.borderColor)
                       .attr("stroke-width", 0.05);
                     return g;
                   }
                 };

                 //Draw Map 2
                 mergeMoroccoAndSahara = (g, jsonData) => {
                   //Merge Morrocan sahara with morocco
                   //Moroccan Sahar id = 732
                   //Morocco id = 504
                   var selected = d3.set([732, 504]);
                   g.append("path")
                     .datum(
                       merge(
                         jsonData,
                         jsonData.objects.countries.geometries.filter(d => {
                           return selected.has(d.id);
                         })
                       )
                     )
                     .attr("className", "country")
                     .attr("d", d => this.calculatePath(d))
                     .attr("stroke", this.borderColor)
                     .attr("stroke-width", 0.05)
                     .attr("fill", "gray");
                   return g;
                 };

                 //Add Markers Function
                 drawMediaPosition = (node, medias_francais) => {
                   const { relations_medias_francais } = this.props;
                   var markers = node.append("g").attr("class", "markers");
                   var media_francais_filtre = medias_francais.filter(
                     d => this.isNotEmpty(d.x) && this.isNotEmpty(d.y)
                   );
                   markers
                     .selectAll("circle")
                     .data(media_francais_filtre)
                     .enter()
                     .append("circle")
                     .attr("key", d => `marker-${d.id}`)
                     .attr("cx", d => {
                       var coordinate = [d.x, d.y];
                       return this.projection()(coordinate)[0];
                     })
                     .attr("cy", d => {
                       var coordinate = [d.x, d.y];
                       return this.projection()(coordinate)[1];
                     })
                     .attr("r", d => {
                       return 1.5 * this.getChildCount(
                         d.nom,
                         relations_medias_francais
                       );
                     })
                     .attr("fill", d => {
                       return this.getNodeColor(
                         d.id,
                         relations_medias_francais
                       );
                     })
                     .attr("stroke", "#FFFFFF")
                     .attr("class", "marker")
                     .append("title")
                     .text(e => this.circleOnHover(e));
                   return markers;
                 };

                 //get node color
                 getNodeColor = (id, media) => {
                   var childsCount = media.filter(d => d.id === id).length;
                   if (childsCount == 0) {
                     return "rgba(65, 131, 215, 1)";
                   } else {
                     return "rgba(214, 69, 65, 1)";
                   }
                 };

                 //get child
                 getChildCount = (nom, media) => {
                   var childsCount = media.filter(d => d.origine == nom).length;
                   if (childsCount === 0) {
                     return 1;
                   }
                   return childsCount;
                 };

                 drawCnx = (g, relations, media) => {
                   //build links
                   var links = this.buildLinks(relations, media);
                   this.addLinks(g, links);
                 };

                 //build links [{},{}]
                 buildLinks = (relations, media) => {
                   var links = [];
                   relations.forEach(d => {
                     //var taille = ;
                     var link = {
                       origine: {
                         value: d.origine,
                         coordinate: this.getCoordinateByEntity(
                           media,
                           d.origine
                         )
                       },
                       cible: {
                         value: d.cible,
                         coordinate: this.getCoordinateByEntity(media, d.cible)
                       },
                       lien: d.valeur,
                       etat: d.etat
                     };
                     //add new link object
                     if (this.validateLink(link)) {
                       links.push(link);
                     }
                   });
                   return links;
                 };

                 validateLink = link => {
                   var linkOrigineCoordinate = link.origine.coordinate;
                   var linkCibleCoordinate = link.cible.coordinate;
                   if (
                     linkOrigineCoordinate != null &&
                     linkOrigineCoordinate.x != "" &&
                     linkOrigineCoordinate.y != "" &&
                     linkCibleCoordinate != null &&
                     linkCibleCoordinate.x != "" &&
                     linkCibleCoordinate.y != ""
                   ) {
                     return true;
                   }
                   return false;
                 };

                 getCoordinateByEntity = (media, entityName) => {
                   var entity = media.filter(d => d.nom == entityName)[0];
                   if (
                     entity != null &&
                     this.isNotEmpty(entity.x) &&
                     this.isNotEmpty(entity.y)
                   ) {
                     return [entity.x, entity.y];
                   }
                 };

                 //creation de connection entre deux pays
                 addLinks = (node, links) => {
                   var path = d3.geoPath().projection(this.projection());
                   node
                     .append("g")
                     .attr("class", "paths")
                     .selectAll("path")
                     .data(links)
                     .enter()
                     .append("path")
                     .attr("d", d => path(this.calculateLineString(d)))
                     .style("fill", "none")
                     .style("stroke", d => this.colorPath(d))
                     .style("stroke-width", 0.5)
                     .append("title")
                     .text(d => d.lien);
                 };

                 calculateLineString = link => {
                   var coordinateEntityOrigine = link.origine.coordinate;
                   var coordinateEntityCible = link.cible.coordinate;

                   var linkAsLineString = {
                     type: "LineString",
                     coordinates: [
                       coordinateEntityOrigine,
                       coordinateEntityCible
                     ]
                   };
                   return linkAsLineString;
                 };

                 colorPath = link => {
                   switch (link.etat) {
                     case "P":
                       //Orange
                       return "rgba(242, 120, 75, 1)";
                     case "N":
                       return "rgba(231, 76, 60, 1)";
                     default:
                       return "rgba(65, 131, 215, 1)";
                   }
                 };
                 //Add zoom
                 addZoom = svg => {
                   svg.call(d3.zoom().on("zoom", () => this.zoomed(svg)));
                 };

                 zoomed = svg => {
                   var transform = d3.event.transform;

                   svg.attr("transform", transform);
                 };
                 //Events handlers
                 circleOnHover = event => {
                   return event.nom + " [" + event.x + "," + event.y + "]";
                 };

                 circleOnClick = event => {
                   console.log("event", event);
                 };

                 //Projection and path calculator
                 projection() {
                   var geoMercator = d3
                     .geoMercator()
                     .scale(150)
                     .translate([800 / 2, 450 / 2]);

                   var projection2 = d3
                     .geoOrthographic()
                     .scale(300)
                     .precision(0.1);
                   return geoMercator;
                 }

                 calculatePath = d => {
                   return d3.geoPath().projection(this.projection())(d);
                 };

                 isNotEmpty = entity => {
                   return entity != "" && entity != "" && entity != null;
                 };
               }

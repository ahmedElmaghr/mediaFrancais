import React, { Component } from "react";
import { feature } from "topojson-client";
import * as d3 from "d3";
import countries from "./data/countries.tsv";
import medias_francais_mock from "./data/medias_francais_mock.tsv";
import relations_medias_francais_mock from "./data/relations_medias_francais.tsv";
import MediaFrancaisView from "./MediaFrancaisView";

class MediaFrancaisContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //media file
      medias_francais: [],
      //relation media
      relations_medias_francais: [],
      //Data for map creations
      worldData: [],
      jsonData: [],
      countries: []
    };
  }

  componentDidMount() {
    this.loadDataForMediaFrancais();
  }

  render() {
    const {
      worldData,
      jsonData,
      medias_francais,
      relations_medias_francais,
      countries
    } = this.state;
    if (worldData.length != 0 && medias_francais.length != 0) {
      return (
        <div>
          <MediaFrancaisView
            worldData={worldData}
            medias_francais={medias_francais}
            relations_medias_francais={relations_medias_francais}
            jsonData={jsonData}
            countries={countries}
          ></MediaFrancaisView>
        </div>
      );
    }
    return <div></div>;
  }

  loadDataForMediaFrancais() {
    this.readMediaFile();
    this.readRelationFile();
    this.readCountries();
    this.updateWordMap();
  }

  readMediaFile = () => {
    d3.tsv(medias_francais_mock).then(response => {
      this.setState({
        medias_francais: response
      });
    });
  };

  readRelationFile = () => {
    d3.tsv(relations_medias_francais_mock).then(response => {
      this.setState({
        relations_medias_francais: response
      });
    });
  };

  readCountries = () => {
    d3.tsv(countries).then(response => {
      console.log("countries response", response);
      this.setState({
        countries: response
      });
    });
  };

  updateWordMap() {
    fetch(
      "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-10m.json"
    ).then(response => {
      if (response.status !== 200) {
        console.log(`There was a problem: ${response.status}`);
        return;
      }
      response.json().then(worldData => {
        this.setState({
          worldData: feature(worldData, worldData.objects.countries).features,
          jsonData: worldData
        });
      });
    });
  }
}

export default MediaFrancaisContainer;

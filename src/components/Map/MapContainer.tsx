import React, { createRef, useState, useEffect } from 'react';
import { Map, TileLayer, Marker, Circle, withLeaflet } from 'react-leaflet';
import { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import { FeatureCollection, Feature } from 'geojson';
import { MapSidebar } from './MapSidebar';
import {
  FrcsInputs,
  TechnoeconomicModels,
  YearlyResult,
  RequestParams,
  RequestParamsYear
} from '../../models/Types';
import {
  InputModGPO,
  InputModCHP,
  InputModGP
} from '@ucdavis/tea/out/models/input.model';
import { InputModGPOClass } from '../../models/GPOClasses';
import { InputModCHPClass } from '../../models/CHPClasses';
import { InputModGPClass } from '../../models/GPClasses';
import { ResultsContainer } from '../Results/ResultsContainer';
import { convertGeoJSON } from '../Shared/util';
import { HexLayers } from './HexLayers';
import { HeatmapLayers } from './HeatmapLayers';
import ReactLeafletKml from 'react-leaflet-kml';

export const MapContainer = () => {
  const [loading, toggleLoading] = useState<boolean>(false);
  const [results, setResults] = useState<YearlyResult[]>([]);
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>(0);
  const [geoJsonResults, setGeoJsonResults] = useState<FeatureCollection[]>([]);
  const [mapOverlayType, setMapOverlayType] = useState<string>('heatmap');

  const frcsInputsExample: FrcsInputs = {
    system: 'Ground-Based Mech WT',
    treatmentid: 1,
    dieselFuelPrice: 3.882
  };
  const [frcsInputs, setFrcsInputs] = useState<FrcsInputs>(frcsInputsExample);
  const years = [2016, 2017, 2018, 2019, 2020, 2021];

  const [teaInputs, setTeaInputs] = useState<
    InputModGPO | InputModCHP | InputModGP
  >(new InputModGPOClass());
  const [teaModel, setTeaModel] = useState(
    TechnoeconomicModels.genericPowerOnly
  );
  useEffect(() => {
    // when teaModel changes, change default values
    if (teaModel === TechnoeconomicModels.genericPowerOnly) {
      setTeaInputs(new InputModGPOClass());
    }
    if (teaModel === TechnoeconomicModels.genericCombinedHeatAndPower) {
      setTeaInputs(new InputModCHPClass());
    }
    if (teaModel === TechnoeconomicModels.gasificationPower) {
      setTeaInputs(new InputModGPClass());
    }
  }, [teaModel]);

  const [mapState, setMapState] = useState({
    lat: 39.644308,
    lng: -121.553971
  });
  let mapRef: any = createRef<Map>();

  const bounds: LatLngBoundsExpression = [
    [40.1, -122.5],
    [39.2, -120]
  ];

  const submitInputs = async (lat: number, lng: number) => {
    toggleLoading(true);
    let radius = 0;
    let clusterIds: number[] = [];
    let errorIds: number[] = [];
    for (let index = 0; index < years.length; index++) {
      console.log(
        `year: ${years[index]}, # of clusters: ${clusterIds.length}, # of error clusters: ${errorIds.length}`
      );
      const reqBody: RequestParamsYear = {
        lat,
        lng,
        radius,
        clusterIds,
        errorIds,
        year: years[index],
        system: frcsInputs.system,
        treatmentid: frcsInputs.treatmentid,
        dieselFuelPrice: frcsInputs.dieselFuelPrice,
        teaModel: teaModel,
        teaInputs: teaInputs
      };
      console.log(JSON.stringify(reqBody));
      const yearResult: YearlyResult = await fetch(
        'http://localhost:3000/process',
        // 'https://cecdss-backend.azurewebsites.net/process',
        {
          mode: 'cors',
          method: 'POST',
          body: JSON.stringify(reqBody),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then(res => res.json());
      radius = yearResult.radius;
      clusterIds.push(...yearResult.clusterNumbers);
      errorIds.push(...yearResult.errorClusterNumbers);
      console.log(`setting results of year: ${years[index]}`);
      const geoJsonClusters: Feature[] = convertGeoJSON(yearResult.clusters);
      setGeoJsonResults(results => [
        ...results,
        {
          type: 'FeatureCollection',
          features: geoJsonClusters
        }
      ]);

      setResults(results => [...results, yearResult]);
      toggleLoading(false);
    }
  };

  const accessToken =
    'pk.eyJ1IjoibGF1cmFob2xzdGVnZSIsImEiOiJjazZnc3U3c3gybWw5M25xamc2M2RnNTl2In0.Zcg_-cmP110dT_JzIN3QdA';
  const mapboxTiles =
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' +
    accessToken;
  const attribution =
    '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const style = {
    height: window.innerHeight
  };
  const position: LatLngExpression = mapState;

  const [kml, setKml] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('data/butte_kml.kml')
      .then(res => res.text())
      .then(kmlText => {
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmlText, 'text/xml');
        setKml(kml);
      });
  }, []);

  return (
    <div style={style}>
      {results.length === 0 && (
        <MapSidebar
          frcsInputs={frcsInputs}
          setFrcsInputs={setFrcsInputs}
          teaInputs={teaInputs}
          setTeaInputs={setTeaInputs}
          teaModel={teaModel}
          setTeaModel={setTeaModel}
          submitInputs={() => submitInputs(mapState.lat, mapState.lng)}
          loading={loading}
        />
      )}
      {results.length > 0 && (
        <ResultsContainer
          selectedYearIndex={selectedYearIndex}
          setSelectedYearIndex={setSelectedYearIndex}
          years={years}
          teaInputs={teaInputs}
          teaModel={teaModel}
          results={results}
          mapOverlayType={mapOverlayType}
          setMapOverlayType={setMapOverlayType}
        />
      )}
      <Map
        ref={mapRef}
        onClick={(e: any) => {
          results.length === 0 && setMapState(e.latlng);
        }}
        bounds={bounds}
      >
        <TileLayer attribution={attribution} url={mapboxTiles} />
        {/* {kml && <ReactLeafletKml kml={kml} />} */}
        {geoJsonResults.length > 0 && mapOverlayType === 'hexbin' && (
          <HexLayers
            yearlyGeoJson={geoJsonResults}
            selectedYearIndex={selectedYearIndex}
          />
        )}
        {geoJsonResults.length > 0 && mapOverlayType === 'heatmap' && (
          <HeatmapLayers
            yearlyGeoJson={geoJsonResults}
            selectedYearIndex={selectedYearIndex}
          />
        )}
        <Marker position={position} />
      </Map>
    </div>
  );
};

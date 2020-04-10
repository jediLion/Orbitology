/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 *  Illustrates how to show the starfield layer above the globe.
 */
requirejs([
        './WorldWindShim',
        './LayerManager'
    ],
    function (WorldWind,
        LayerManager) {
        'use strict';

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow('canvasOne');

        // Create imagery layers.
        var BMNGLayer = new WorldWind.BMNGLayer();
        var starFieldLayer = new WorldWind.StarFieldLayer();
        var atmosphereLayer = new WorldWind.AtmosphereLayer();

        // Add previously created layers to the WorldWindow.
        wwd.addLayer(BMNGLayer);
        wwd.addLayer(starFieldLayer); //IMPORTANT: add the starFieldLayer before the atmosphereLayer
        wwd.addLayer(atmosphereLayer);

        wwd.addLayer(new WorldWind.BMNGOneImageLayer());
        wwd.addLayer(new WorldWind.CompassLayer());
        wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
        wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

        var date = new Date();
        starFieldLayer.time = date;
        atmosphereLayer.time = date;

        wwd.redraw();

        wwd.redrawCallbacks.push(runSunSimulation);

        var sunSimulationCheckBox = document.getElementById('stars-simulation');
        var doRunSimulation = false;
        var timeStamp = Date.now();
        var factor = 1;

        sunSimulationCheckBox.addEventListener('change', onSunCheckBoxClick, false);

        function onSunCheckBoxClick() {
            doRunSimulation = this.checked;
            if (!doRunSimulation) {
                var date = new Date();
                starFieldLayer.time = date;
                atmosphereLayer.time = date;
            }
            wwd.redraw();
        }

        function runSunSimulation(wwd, stage) {
            if (stage === WorldWind.AFTER_REDRAW && doRunSimulation) {
                timeStamp += (factor * 60 * 100);
                var date = new Date(timeStamp);
                starFieldLayer.time = date;
                atmosphereLayer.time = date;
                wwd.redraw();
            }
        }

        // Add a placemark
        var placemarkLayer = new WorldWind.RenderableLayer();
        wwd.addLayer(placemarkLayer);

        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

        placemarkAttributes.imageOffset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.3,
            WorldWind.OFFSET_FRACTION, 0.0);

        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.0);

        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";

        var position = new WorldWind.Position(36.0, -79.0, 10.0);
        var placemark = new WorldWind.Placemark(position, true, placemarkAttributes);

        placemark.label = "Placemark\n" +
            "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
            "Lon " + placemark.position.longitude.toPrecision(5).toString();
        placemark.alwaysOnTop = true;

        placemarkLayer.addRenderable(placemark);


        /*
                // Add a COLLADA model
                var modelLayer = new WorldWind.RenderableLayer();
                wwd.addLayer(modelLayer);

                var satPosition = new WorldWind.Position(10.0, -100.0, 100000.0);
                var config = {
                    dirPath: WorldWind.configuration.baseUrl + 'images/17-death-star-ii-v2/'
                };

                var colladaLoader = new WorldWind.ColladaLoader(satPosition, config);
                colladaLoader.load("death-star-II-v2.DAE", function (colladaModel) {
                    colladaModel.scale = 8000;
                    modelLayer.addRenderable(colladaModel);
                });
        */


        // Add a polygon
        var polygonLayer = new WorldWind.RenderableLayer();
        wwd.addLayer(polygonLayer);

        var polygonAttributes = new WorldWind.ShapeAttributes(null);
        polygonAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.75);
        polygonAttributes.outlineColor = WorldWind.Color.BLUE;
        polygonAttributes.drawOutline = true;
        polygonAttributes.applyLighting = true;

        var boundaries = [];
        boundaries.push(new WorldWind.Position(20.0, -75.0, 700000.0));
        boundaries.push(new WorldWind.Position(25.0, -85.0, 700000.0));
        boundaries.push(new WorldWind.Position(20.0, -95.0, 700000.0));

        var polygon = new WorldWind.Polygon(boundaries, polygonAttributes);
        polygon.extrude = true;
        polygonLayer.addRenderable(polygon); 

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);

    });

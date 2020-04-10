// Create a WorldWindow for the canvas.


var wwd = new WorldWind.WorldWindow("canvasOne");

wwd.addLayer(new WorldWind.BMNGOneImageLayer());
wwd.addLayer(new WorldWind.BMNGLandsatLayer());

wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

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

var position = new WorldWind.Position(36.0, -79.0, 100.0);
var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

placemark.label = "Placemark\n" +
    "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
    "Lon " + placemark.position.longitude.toPrecision(5).toString();
placemark.alwaysOnTop = true;

placemarkLayer.addRenderable(placemark);

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

// Add a COLLADA model
var modelLayer = new WorldWind.RenderableLayer();
wwd.addLayer(modelLayer);

var position = new WorldWind.Position(10.0, -100.0, 1000000.0);
var config = {
    dirPath: WorldWind.configuration.baseUrl + 'examples/collada_models/duck/'
};

var colladaLoader = new WorldWind.ColladaLoader(position, config);
colladaLoader.load("duck.dae", function (colladaModel) {
    colladaModel.scale = 8000;
    modelLayer.addRenderable(colladaModel);
});

// Add WMS imagery
var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
var layerName = "MOD_LSTD_CLIM_M";

var createLayer = function (xmlDom) {
    var wms = new WorldWind.WmsCapabilities(xmlDom);
    var wmsLayerCapabilities = wms.getNamedLayer(layerName);
    var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
    var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
    wwd.addLayer(wmsLayer);
};

var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " +
        text +
        " exception: " + exception);
};

$.get(serviceAddress).done(createLayer).fail(logError);

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

        var position = new WorldWind.Position(36.0, -79.0, 100.0);
        var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

        placemark.label = "Placemark\n" +
            "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
            "Lon " + placemark.position.longitude.toPrecision(5).toString();
        placemark.alwaysOnTop = true;

        placemarkLayer.addRenderable(placemark);

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
                timeStamp += (factor * 60 * 1000);
                var date = new Date(timeStamp);
                starFieldLayer.time = date;
                atmosphereLayer.time = date;
                wwd.redraw();
            }
        }

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
    });

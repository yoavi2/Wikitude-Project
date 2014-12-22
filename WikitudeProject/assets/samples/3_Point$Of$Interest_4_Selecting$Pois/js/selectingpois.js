// implementation of AR-Experience (aka "World")
var World = {
	// you may request new data from server periodically, however: in this sample data is only requested once
	isRequestingData: false,

	// true once data was fetched
	initiallyLoadedData: false,

	// different POI-Marker assets
	markerDrawable_idle: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,

	// list of AR.GeoObjects that are currently shown in the scene / World
	markerList: [],

	// The last selected marker
	currentMarker: null,

	// called to inject new POI data
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
		// empty list of visible markers
		World.markerList = [];

		// Start loading marker assets:
		// Create an AR.ImageResource for the marker idle-image
		World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
		// Create an AR.ImageResource for the marker selected-image
		World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
		// Create an AR.ImageResource referencing the image that should be displayed for a direction indicator. 
		World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

		// loop through POI-information and create an AR.GeoObject (=Marker) per POI
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
			var singlePoi = {
				"id": poiData[currentPlaceNr].id,
				"latitude": parseFloat(poiData[currentPlaceNr].latitude),
				"longitude": parseFloat(poiData[currentPlaceNr].longitude),
				"altitude": parseFloat(poiData[currentPlaceNr].altitude),
				"title": poiData[currentPlaceNr].name,
				"description": poiData[currentPlaceNr].description
			};

			/*
				To be able to deselect a marker while the user taps on the empty screen, 
				the World object holds an array that contains each marker.
			*/
			World.markerList.push(new Marker(singlePoi));
		}

		World.updateStatusMessage(currentPlaceNr + ' places loaded');
	},

	// updates status message shon in small "i"-button aligned bottom center
	updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

		var themeToUse = isWarning ? "e" : "c";
		var iconToUse = isWarning ? "alert" : "info";

		$("#status-message").html(message);
		$("#popupInfoButton").buttonMarkup({
			theme: themeToUse
		});
		$("#popupInfoButton").buttonMarkup({
			icon: iconToUse
		});
	},

	// location updates, fired every time you call architectView.setLocation() in native environment
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {

		/*
			The custom function World.onLocationChanged checks with the flag World.initiallyLoadedData if the function was already called. With the first call of World.onLocationChanged an object that contains geo information will be created which will be later used to create a marker using the World.loadPoisFromJsonData function.
		*/
		if (!World.initiallyLoadedData) {
			/* 
				requestDataFromLocal with the geo information as parameters (latitude, longitude) creates different poi data to a random location in the user's vicinity.
			*/
			//alert("lat:" + lat + " lon:" + lon + " alt:" + alt + " acc:" + acc);
			World.requestDataFromLocal(lat, lon);
			World.initiallyLoadedData = true;
		}
	},

	// fired when user pressed maker in cam
	onMarkerSelected: function onMarkerSelectedFn(marker) {

		// deselect previous marker
		if (World.currentMarker) {
			if (World.currentMarker.poiData.id == marker.poiData.id) {
				return;
			}
			World.currentMarker.setDeselected(World.currentMarker);
		}

		// highlight current one
		marker.setSelected(marker);
		World.currentMarker = marker;
	},

	// screen was clicked but no geo-object was hit
	onScreenClick: function onScreenClickFn() {
		if (World.currentMarker) {
			World.currentMarker.setDeselected(World.currentMarker);
		}
	},

	// request POI data
	requestDataFromLocal: function requestDataFromLocalFn(centerPointLatitude, centerPointLongitude) {
		var poisToCreate = 10;
		var poiData = [];

		// for (var i = 1; i <= poisToCreate; i++) {
		// 	poiData.push({
		// 		"id": (i),
		// 		"longitude": (centerPointLongitude + (Math.random() / 50 - 0.1)),
		// 		"latitude": (centerPointLatitude + (Math.random() / 50 - 0.1)),
		// 		"description": ("POI#" + (i)),
		// 		// use this value to ignore altitude information in general - marker will always be on user-level
		// 		"altitude": AR.CONST.UNKNOWN_ALTITUDE,
		// 		"name": ("POI#" + (i))
		// 	});
		// }


			poiData.push({
				"id": (1),
				"longitude": 32.086156,
				"latitude": 34.822173,
				"description": ("POI#" + (1)),
				// use this value to ignore altitude information in general - marker will always be on user-level
				"altitude": AR.CONST.UNKNOWN_ALTITUDE,
				"name": ("POI#" + (1))
			});

			poiData.push({
				"id": (2),
				"longitude": 32.086310,
				"latitude": 34.821239,
				"description": ("POI#" + (2)),
				// use this value to ignore altitude information in general - marker will always be on user-level
				"altitude": AR.CONST.UNKNOWN_ALTITUDE,
				"name": ("POI#" + (2))
			});

			poiData.push({
				"id": (3),
				"longitude": 32.086310,
				"latitude": 34.821261,
				"description": ("POI#" + (3)),
				// use this value to ignore altitude information in general - marker will always be on user-level
				"altitude": AR.CONST.UNKNOWN_ALTITUDE,
				"name": ("POI#" + (3))
			});

			poiData.push({
				"id": (4),
				"longitude": 32.086301,
				"latitude": 34.821256,
				"description": ("POI#" + (4)),
				// use this value to ignore altitude information in general - marker will always be on user-level
				"altitude": AR.CONST.UNKNOWN_ALTITUDE,
				"name": ("POI#" + (4))
			});

			poiData.push({
				"id": (5),
				"longitude": 32.086264,
				"latitude": 34.821304,
				"description": ("POI#" + (5)),
				// use this value to ignore altitude information in general - marker will always be on user-level
				"altitude": AR.CONST.UNKNOWN_ALTITUDE,
				"name": ("POI#" + (5))
			});
			
		World.loadPoisFromJsonData(poiData);
	}

};

/* 
	Set a custom function where location changes are forwarded to. There is also a possibility to set AR.context.onLocationChanged to null. In this case the function will not be called anymore and no further location updates will be received. 
*/
AR.context.onLocationChanged = World.locationChanged;

/*
	To detect clicks where no drawable was hit set a custom function on AR.context.onScreenClick where the currently selected marker is deselected.
*/
AR.context.onScreenClick = World.onScreenClick;
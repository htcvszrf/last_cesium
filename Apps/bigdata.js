var myobj = {
		  geocoder:true,
		  homeButton:false,
		  sceneModePicker:true,
		  baseLayerPicker:false,
		  navigationHelpButton:false,
		  automaticallyTrackDataSourceClocks:true,
		  animation:true,
		  timeline:false,
		  vrButton:false,
		  infoBox : true,//弹出面板
		  selectionIndicator : false,//正方形选择框
		  /* terrainProvider : new Cesium.CesiumTerrainProvider({
		        url : Cesium.IonResource.fromAssetId(3956),
		        requestVertexNormals : true
		    }) */
		  /* imageryProvider:new Cesium.SingleTileImageryProvider({
			  url : 'world.jpg',
			  rectangle : Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
		  }) */
		  /* terrainProvider : new Cesium.CesiumTerrainProvider({
		  //加载本地地形图成功
		  url : 'terrainCache'
			  //requestVertexNormals : true
		  })
 */
		 /*  imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
		     // 加载天地图WMTS 成功
			  url: "http://{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
			  layer: "tdtBasicLayer",
			  style: "default",
			  format: "image/jpeg",
			  maximumLevel: 17,
			  tileMatrixSetID: "GoogleMapsCompatible",
			  subdomains:['t0','t1','t2','t3','t4','t5','t6','t7']
		  }) */
//		  imageryProvider: new Cesium.WebMapServiceImageryProvider({
//		  url: "http://localhost:8080/geoserver/CESIUM_TEST/wms?",
//		  layers: 'CESIUM_TEST:shengjie',
//		  crs : 'EPSG:4326',
//		  style :'default',
//		  parameters: {
//			  service : 'WMS',
//			  format: 'image/png',
//			  transparent: true
//		  }
//	      })
//arcgis服务
		  imageryProvider:new Cesium.ArcGisMapServerImageryProvider({
			  url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
		  })
//		  imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
//			  //加载gwc WMTS失败
//			  url: "http://localhost:8080/geoserver/gwc/service/wmts?service=WMTS&version=1.1.1&request=GetTile&styles=&format=image/jpeg&layer=xichanganjie:BYQ&width=256&height=256&srs=default028mm&tileMatrixSet=default028mm&TileRow={TileRow}&TileCol={TileCol}",
//			  layer: "BYQ",
//			  style: "default",
//			  format: "image/jpeg",
//			  maximumLevel: 17,
//			  tileMatrixSetID: "default028mm",
//			  tileMatrix : ['default028mm:0', 'default028mm:1', 'default028mm:2','default028mm:3','default028mm:4','default028mm:5','default028mm:6','default028mm:7','default028mm:8','default028mm:9','default028mm:10','default028mm:11',
//				  'default028mm:12','default028mm:13','default028mm:14','default028mm:15','default028mm:16','default028mm:17','default028mm:18','default028mm:19']
//		  })




	  };
 var viewer = new Cesium.Viewer('cesiumContainer',myobj);
	 // viewer._cesiumWidget._creditContainer.style.display="none";  //页面版权信息

//添加图片
// imageryProvider:new Cesium.SingleTileImageryProvider({
//	 url : 'world.jpg',
//	 rectangle : Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
// })

	  //加载夜间灯火图 待测试
//var layers = viewer.scene.imageryLayers;
//var blackMarble = layers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
//  url : 'https://cesiumjs.org/tilesets/imagery/blackmarble',
//  maximumLevel : 8,
//  flipXY : true,
//  credit : 'Black Marble imagery courtesy NASA Earth Observatory'
//}));
//不看地面以下
//viewer.scene.globe.depthTestAgainstTerrain = true;

//放置镜头进入地下视角
/**
 * 
//限制视角范围，避免进入地下
 var canvas = viewer.canvas;
 var camera = viewer.camera;

 scene.screenSpaceCameraController.minimumZoomDistance = 2;
 scene.screenSpaceCameraController.maximumZoomDistance=500000;

 viewer.clock.onTick.addEventListener(function() {
     setMinCamera()
 })
 var setMinCamera = function() {
     if (camera.pitch > 0) {
         scene.screenSpaceCameraController.enableTilt = false;
     }
 }

 var startMousePosition;
 var mousePosition;

 var handler = new Cesium.ScreenSpaceEventHandler(canvas);
 handler.setInputAction(function(movement) {

     mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
     handler.setInputAction(function(movement) {
         mousePosition = movement.endPosition;
         var y = mousePosition.y - startMousePosition.y;
         if (y > 0) {
             scene.screenSpaceCameraController.enableTilt = true;
         }
     }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

 }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

 handler.setInputAction(function(movement) {
     handler.setInputAction(function(movement) {

     }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
 }, Cesium.ScreenSpaceEventType.MIDDLE_UP);
 
 ***/

//使用指南 运行computerThatLonLat(已知点经度,已知点纬度,ab方位角（135为利）,两点距离（也是我们相机的高度，当然前提条件是相机俯视角维45度时高度即两点距离）)
//例子computerThatLonLat(116.3740139345,39.9276302166,135,42671)
/*
 * 大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
 */
/** 长半径a=6378137 */

var a = 6378137;
/** 短半径b=6356752.3142 */
var b = 6356752.3142;
/** 扁率f=1/298.2572236 */
var f = 1 / 298.2572236;

/**
 * 计算另一点经纬度
 *
 * @param lon_inner
 *            经度
 * @param lat_inner
 *            维度
 * @param lon_innerlat_inner
 *            已知点经纬度
 * @param angel_inner
 *            方位角
 * @param height_inner
 *            距离（米）
 */
function computerThatLonLat(lon_inner,lat_inner,angel_inner,height_inner) {

	var alpha1 = rad(angel_inner);
	var sinAlpha1 = Math.sin(alpha1);
	var cosAlpha1 = Math.cos(alpha1);

	var tanU1 = (1 - f) * Math.tan(rad(lat_inner));
	var cosU1 = 1 / Math.sqrt((1 + tanU1 * tanU1));
	var sinU1 = tanU1 * cosU1;
	var sigma1 = Math.atan2(tanU1, cosAlpha1);
	var sinAlpha = cosU1 * sinAlpha1;
	var cosSqAlpha = 1 - sinAlpha * sinAlpha;
	var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
	var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
	var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

	var cos2SigmaM=0;
	var sinSigma=0;
	var cosSigma=0;
	var sigma = height_inner / (b * A), sigmaP = 2 * Math.PI;
	while (Math.abs(sigma - sigmaP) > 1e-12) {
		cos2SigmaM = Math.cos(2 * sigma1 + sigma);
		sinSigma = Math.sin(sigma);
		cosSigma = Math.cos(sigma);
		var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)
			- B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
		sigmaP = sigma;
		sigma = height_inner / (b * A) + deltaSigma;
	}

	var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
	var lat_inner2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
		(1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp));
	var lambda = Math.atan2(sinSigma * sinAlpha1, cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1);
	var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
	var L = lambda - (1 - C) * f * sinAlpha
		* (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));

	var revAz = Math.atan2(sinAlpha, -tmp); // final bearing

	console.log(revAz);
	var lon_aa = lon_inner+deg(L);
	var lat_bb = deg(lat_inner2);
	console.log(lon_inner+deg(L)+","+deg(lat_inner2));
	var info ={"lon":lon_inner+deg(L),"lat":deg(lat_inner2)}
	return info;
}

/**
 * 度换成弧度
 *
 * @param d
 *            度
 * @return 弧度
 */
function rad(d) {
	return d * Math.PI / 180.0;
}

/**
 * 弧度换成度
 *
 * @param x
 *            弧度
 * @return 度
 */
function deg(x) {
	return x * 180 / Math.PI;
}





/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */

//定义一些常量
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;


function gcj02towgs84(lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    }
    else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat]
    }
}

function transformlat(lng, lat) {
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret
}

function transformlng(lng, lat) {
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function out_of_china(lng, lat) {
    return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
}

//添加tileset
 // var tileset = new Cesium.Cesium3DTileset({ url: 'aaa/tileset.json'});
 // viewer.scene.primitives.add(tileset);

 // 添加本地全球图片
	// imageryProvider:new Cesium.SingleTileImageryProvider({
                          // url : 'world.jpg',
                          // rectangle : Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
						  // }),
                          // baseLayerPicker : false


var entities = viewer.entities;

var scene = viewer.scene;
Cesium.Entity.supportsMaterialsforEntitiesOnTerrain(scene)
var i;
var height;
var positions;
var stripeMaterial = new Cesium.StripeMaterialProperty({
    evenColor : Cesium.Color.WHITE.withAlpha(0.5),
    oddColor : Cesium.Color.BLUE.withAlpha(0.5),
    repeat : 5.0
});

/*var BJ = viewer.entities.add({
	id: 'nake',
	name : 'beijing',
  position : Cesium.Cartesian3.fromDegrees(116.3765432498,39.9087525639),
  point : {
    pixelSize : 5,
    color : Cesium.Color.RED,
    outlineColor : Cesium.Color.WHITE,
    outlineWidth : 2
  },
  label : {
    text : '北京',
    font : '14pt monospace',
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    outlineWidth : 2,
    //垂直位置
    verticalOrigin : Cesium.VerticalOrigin.BUTTON,
    //中心位置
    pixelOffset : new Cesium.Cartesian2(0, 20)
  }
});*/
//classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
var longitude3 = 116.07373566585602;
var latitude3 = 39.90653472534493;
var height3 = 0;

var heading3 = 0;
var tileset3= new Cesium.Cesium3DTileset({
	url: '14/tileset.json'

});
tileset3.style = new Cesium.Cesium3DTileStyle({
	color: 'rgba(255, 0, 0, 0.5)'

});
viewer.scene.primitives.add(tileset3);
tileset3.readyPromise.then(function(argument) {
	var position = Cesium.Cartesian3.fromDegrees(longitude3, latitude3, height3);
	var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
	var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading3)));
	Cesium.Matrix4.multiply(mat, rotationX, mat);
	tileset3._root.transform = mat;
	//viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 1000)});
});


//var longitude1 = 116.37373566585602;
//var latitude1 = 39.90653472534493;
//var height1 = 23;
//var heading1 = 0;
//var tileset1 = new Cesium.Cesium3DTileset({
//	url: 'http://localhost:9002/api/folder/e18cf10462ac4dec88d2760214f532af/tileset.json'
//});
//
//tileset1.style = new Cesium.Cesium3DTileStyle({
//	color: 'rgba(255, 0, 0, 0.5)'
//
//});
//viewer.scene.primitives.add(tileset1);
//tileset1.readyPromise.then(function(argument) {
//	var position = Cesium.Cartesian3.fromDegrees(longitude1, latitude1, height1);
//	var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
//	var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading1)));
//	Cesium.Matrix4.multiply(mat, rotationX, mat);
//	tileset1._root.transform = mat;
//	//viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(longitude1, latitude1, height1 + 1000)});
//});

//
//var longitude11 = 116.37373566585602;
//var latitude11 = 39.90653472534493;
//var height11 = 20;
//var heading11 = 0;
//var tileset11 = new Cesium.Cesium3DTileset({
//	url: 'http://localhost:9002/api/folder/489b6b40ebad475e831594c34fd553de/tileset.json'
//});
//
//viewer.scene.primitives.add(tileset11);
//tileset11.readyPromise.then(function(argument) {
//	var position = Cesium.Cartesian3.fromDegrees(longitude11, latitude11, height11);
//	var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
//	var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading11)));
//	Cesium.Matrix4.multiply(mat, rotationX, mat);
//	tileset11._root.transform = mat;
//	//viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(longitude1, latitude1, height1 + 1000)});
//});
//xcaj3dtile
var longitude = 116.3681248960;
var latitude = 39.9061131244;
var height = 40.896615260699996;

var heading = 0;
var tileset = new Cesium.Cesium3DTileset({
	show:true,
    url: 'xcaj3dtile/tileset.json',
	/* maximumScreenSpaceError : 512,
	maximumMemoryUsage : 1024, */
	skipLevelOfDetail : true,
     baseScreenSpaceError : 1024,
     skipScreenSpaceErrorFactor : 16,
     skipLevels : 1,
     immediatelyLoadDesiredLevelOfDetail : false,
     loadSiblings : false,
     cullWithChildrenBounds : true
});
function showModel(){
	if(tileset.show==true){
		tileset.show=false;
	}else {
		tileset.show=true;
	}
}


/* tileset.style = new Cesium.Cesium3DTileStyle({
    color :Cesium.Color.fromAlpha(Cesium.Color.RED, parseFloat(0.5))
}); */
viewer.scene.primitives.add(tileset);
tileset.readyPromise.then(function(argument) {
    var position = Cesium.Cartesian3.fromDegrees(116.3732262772,39.9077973173, 20);
    var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading)));
    Cesium.Matrix4.multiply(mat, rotationX, mat);
    tileset._root.transform = mat;
    //viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 5000)});
});
//viewer.trackedEntity = tileset;
 

//viewer.zoomTo(viewer.entities);
//viewer.flyTo(viewer.entities,{duration:3});
/*
viewer.camera.flyTo({
	destination :  Cesium.Cartesian3.fromDegrees(116.383,39.903, 5500),
	orientation: {
            heading : Cesium.Math.toRadians(0), // default value is 0.0 (north)
            pitch : Cesium.Math.toRadians(300),// default value (looking down)
            roll : 0//
        },
		duration:3,
	
	});
	*/
//定义镜头位置
// camera.setView( {
    // positionCartographic : new Cesium.Cartographic( longitude, latitude, height ),
    // heading : headingAngle,
    // pitch : pitchAngle,
    // roll : rollAngle
// })






// Information about the currently selected feature
var selected = {
    feature: undefined,
    originalColor: new Cesium.Color()
};

// Information about the currently highlighted feature
var highlighted = {
    feature: undefined,
    originalColor: new Cesium.Color()
};

// An entity object which will hold info about the currently selected feature for infobox display
var selectedEntity = new Cesium.Entity();

var drawstatus = 0;
//var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
/*最初的点击事件
viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
    // If a feature was previously selected, undo the highlight
	if (drawstatus == 0){
		if (Cesium.defined(selected.feature)) {
	        selected.feature.color = selected.originalColor;
	        selected.feature = undefined;
	    }
	}
		

	    // Pick a new feature
	    var pickedFeature = viewer.scene.pick(movement.position);
	    if (!Cesium.defined(pickedFeature) && drawstatus ==0) {
	        clickHandler(movement);
	        return;
	    }

	    // Select the feature if it's not already selected
	    if (selected.feature === pickedFeature  && drawstatus ==0) {
	        return;
	    }
	    selected.feature = pickedFeature;

	    // Save the selected feature's original color
	    if (pickedFeature === highlighted.feature && drawstatus ==0) {
	        Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
	        highlighted.feature = undefined;
	    } else {
	        Cesium.Color.clone(pickedFeature.color, selected.originalColor);
	    }
       //alert('lalalall')
	    // Highlight newly selected feature
	    pickedFeature.color = Cesium.Color.LIME;
	   //function clickonme(){}
		
		// Set feature infobox description
	    var featureName = pickedFeature.getProperty('name');
	    selectedEntity.name = featureName;
	    selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
	    viewer.selectedEntity = selectedEntity;
	    selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
	                                 '<tr><th>BIN</th><td>' + pickedFeature.getProperty('BIN') + '</td></tr>' +
	                                 '<tr><th>DOITT ID</th><td>' + pickedFeature.getProperty('DOITT_ID') + '</td></tr>' +
	                                 '<tr><th>SOURCE ID</th><td>' + pickedFeature.getProperty('SOURCE_ID') + '</td></tr>' +
	                                 '<tr><th>Longitude</th><td>' + pickedFeature.getProperty('longitude') + '</td></tr>' +
	                                 '<tr><th>Latitude</th><td>' + pickedFeature.getProperty('latitude') + '</td></tr>' +
	                                 '<tr><th>Height</th><td>' + pickedFeature.getProperty('height') + '</td></tr>' +
	                                 '<tr><th>Terrain Height (Ellipsoid)</th><td>' + pickedFeature.getProperty('TerrainHeight') + '</td></tr>' +
	                                 '</tbody></table>';

	
    
    
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
*/
function random(m, n) {
		var diff = n - m;
		var num = m + Math.floor(diff*Math.random())
		if(Math.abs(num-m)<0.0004){
			num = num + 0.0004
		}
		return num;
		}
var aaa;

var a = 0;
var b = -90;
var c = 0;
var d = 0;


function c1(){ 
	d = document.getElementById("demo3").value;
	var a = document.getElementById("demo1").value;
	var b = document.getElementById("demo2").value;
	viewer.camera.setView({	
		destination :  Cesium.Cartesian3.fromDegrees(116.383,39.903, d),
		orientation: {
            heading : Cesium.Math.toRadians(a), // default value is 0.0 (north)
            pitch : Cesium.Math.toRadians(b),// default value (looking down)
            roll : c//
        }	
	});
	
	viewer.camera.zoomOut(5000);
	// setTimeout(function() {
		// debugger;
		// console.log(typeof viewer.camera.zoomOut);
		// viewer.camera.zoomOut(5000)
	// },3000);
	
	//return d;
} 

function d1(){ 
viewer.camera.setView({
	destination :  Cesium.Cartesian3.fromDegrees(116.383,39.903, d),
	orientation: {
            heading : Cesium.Math.toRadians(a), // default value is 0.0 (north)
            pitch : Cesium.Math.toRadians(b),// default value (looking down)
            roll : c//
        }
	
	});

}

function showDrawBox(){
	var a1= document.getElementById("draw-btn-a");
	if(a1.style.display == 'block'){
		a1.style.display = 'none';
	}else{
		a1.style.display = 'block';
	}
	
	
}

function drawPoint(){
	//$('#draw-btn-a').css('display','none');
	
	drawstatus = 1;
	/*scene.globe.depthTestAgainstTerrain = true;
	handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    var positions = [];
    var poly = null;
    var tooltip = document.getElementById("toolTip");
    var distance = 0;
    var aaaa = null;
	var cartesian = null;
	var floatingPoint;
    //tooltip.style.display = "block";
    
 
   
 
    handler.setInputAction(function (movement) {
       // tooltip.style.display = "none";
		// cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
		cartesian = scene.pickPosition(movement.position); 
        
        positions.push(cartesian);
        
        var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
  		var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
  		var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
  		
        
//  		var billboards = viewer.entities.add({
//  			position : Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 0.5),
//  			billboard : new Cesium.BillboardGraphics({
//  				show : true ,
//  				image : 'Sandcastle/images/point.png',
//  				//pixelOffset: new Cesium.Cartesian2(0, 0),
//  				//eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
//  				horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
//  				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
//  				scale: 1.0
//
//  			})
//  		});
  		
  		var point = viewer.entities.add({
			position : Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 1), //  worldPosition, Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 10), 
			point : {
				color : Cesium.Color.RED,
				pixelSize : 5,
				outlineColor : Cesium.Color.WHITE,
				outlineWidth : 2,
				heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
			}
		});
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);*/
	handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
	handler.setInputAction(function (movement) {
		var point = viewer.entities.add({
			position : Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 1), //  worldPosition, Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 10), 
			point : {
				color : Cesium.Color.RED,
				pixelSize : 5,
				outlineColor : Cesium.Color.WHITE,
				outlineWidth : 2,
				heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
			}
		});
		/*var billboards = viewer.entities.add({
			position : Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 0.5),
			billboard : new Cesium.BillboardGraphics({
				show : true ,
				image : 'Sandcastle/images/point.png',
				//pixelOffset: new Cesium.Cartesian2(0, 0),
				//eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
				horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				scale: 1.0

			})
		});*/
		
		//handler.destroy();
		//$('#cesium-infoBox').css('display','block');
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	
	
	handler.setInputAction(function (movement) {
    entity.label.show = true;//控制鼠标上是否显示经纬度
		entity.label.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
		entity.label.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
		entity.label.font = '15px sans-serif';
		//entity.disableDepthTestDistance = true;
		entity.label.text = '右击关闭绘制功能' ;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	
	handler.setInputAction(function (movement) {
		handler.destroy();//关闭事件句柄
		positions.pop();//最后一个点无效
		//viewer.entities.remove(floatingPoint);  这句不注释的话 右击线上的最后一哥点就看不到
       // tooltip.style.display = "none";
		handler.destroy();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

	
	//terminateShape();
	//drawShape(activeShapePoints)//测试代码
	//drawingMode = 'line';
	/******************************************* */
	//测量空间直线距离 
	/******************************************* */
	var drawPlyline = function () {
		drawstatus = 1
		scene.globe.depthTestAgainstTerrain = true;
		handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
	    var positions = [];
	    var poly = null;
	    var tooltip = document.getElementById("toolTip");
	    var distance = 0;
	    var aaaa = null;
		var cartesian = null;
		var floatingPoint;
	    //tooltip.style.display = "block";
	    
	 
	    handler.setInputAction(function (movement) {
//	        tooltip.style.left = movement.endPosition.x + 3 + "px";
//	        tooltip.style.top = movement.endPosition.y - 25 + "px";
//	        tooltip.innerHTML = '<p>单击开始，右击结束</p>';
	 
			///////=================================
	 
			cartesian = scene.pickPosition(movement.endPosition); 
			
			/////==================================
	        //cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
	        if (positions.length >= 2) {
	            if (!Cesium.defined(poly)) {
	                poly = new PolyLinePrimitive(positions);
	            } else {
	                positions.pop();
	                // cartesian.y += (1 + Math.random());
	                positions.push(cartesian);
	            }
	            distance = getSpaceDistance(positions);
	            // console.log("distance: " + distance);
	            // tooltip.innerHTML='<p>'+distance+'米</p>';
	        }
	        
	        entity.label.show = true;//控制鼠标上是否显示经纬度
			entity.label.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
			entity.label.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
			entity.label.font = '15px sans-serif';
			//entity.disableDepthTestDistance = true;
			entity.label.text = '右击关闭绘制功能' ;
	    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	 
	    handler.setInputAction(function (movement) {
	       // tooltip.style.display = "none";
			// cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
			cartesian = scene.pickPosition(movement.position); 
	        if (positions.length == 0) {
	            positions.push(cartesian.clone());
	        }
	        positions.push(cartesian);
	        //在三维场景中添加Label
	       // var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
	        var textDisance = distance + "米";
	        // console.log(textDisance + ",lng:" + cartographic.longitude/Math.PI*180.0);
	        var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
	  		var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
	  		var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
	  		
	        if(positions.length > 2){
	        	floatingPoint = viewer.entities.add({
		            name: '空间直线距离',
					// position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
					position:Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 0.5),
		            point: {
		                pixelSize: 5,
		                color: Cesium.Color.RED,
		                outlineColor: Cesium.Color.WHITE,
						outlineWidth: 2,
						heightReference:Cesium.HeightReference.NONE
		            },
		            label: {
		                text: textDisance,
		                font: '18px sans-serif',
		                fillColor: Cesium.Color.GOLD,
		                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
		                outlineWidth: 2,
		                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
						pixelOffset: new Cesium.Cartesian2(20, -20),
						heightReference:Cesium.HeightReference.NONE
		            }
		        });
	        }else{
	        	floatingPoint = viewer.entities.add({
	        		name: '空间直线距离',
					// position: Cesium.Cartesian3.fromDegrees(cartographic.longitude / Math.PI * 180, cartographic.latitude / Math.PI * 180,cartographic.height),
					position:Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 0.5),
		            point: {
		                pixelSize: 5,
		                color: Cesium.Color.RED,
		                outlineColor: Cesium.Color.WHITE,
						outlineWidth: 2,
						heightReference:Cesium.HeightReference.NONE
		            }
	        	})
	        	
	        }
			
			drawstatus = 1
	    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	 
	    handler.setInputAction(function (movement) {
			handler.destroy();//关闭事件句柄
			positions.pop();//最后一个点无效
			//viewer.entities.remove(floatingPoint);  这句不注释的话 右击线上的最后一哥点就看不到
	       // tooltip.style.display = "none";
			entity.label.show = false;
	    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	 
	    var PolyLinePrimitive = (function () {
	        function _(positions) {
	            this.options = {
	                name: '直线',
	                polyline: {
	                    show: true,
	                    positions: [],
	                    clampToGround : true,
	                    material: Cesium.Color.CHARTREUSE  ,
						width: 2,
						zIndex:5
						
						
	                }
	            };
	            this.positions = positions;
	            this._init();
	        }
	 
	        _.prototype._init = function () {
	            var _self = this;
	            var _update = function () {
	                return _self.positions;
	            };
	            //实时更新polyline.positions
	            this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
	            viewer.entities.add(this.options);
	        };
	 
	        return _;
	    })();	
	    
	  
	  };
	 
	  //空间两点距离计算函数
	  function getSpaceDistance(positions) {
		var distance = 0;
		for (var i = 0; i < positions.length - 1; i++) { 
			
		var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
		var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i+1]);
		/**根据经纬度计算出距离**/
		var geodesic = new Cesium.EllipsoidGeodesic();
		geodesic.setEndPoints(point1cartographic, point2cartographic);
		var s = geodesic.surfaceDistance;
	    //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
	    //返回两点之间的距离
		s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));	
		distance = distance + s;
		aaaa= { 'dis': distance.toFixed(2),
				'sss': s
				}
		}
		return distance.toFixed(2);    
	  }


	//****************************测量空间面积************************************************//
	  var drawPolygon = function (viewer, handler){	
		  drawstatus = 1
		scene.globe.depthTestAgainstTerrain = true;
		handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
	  	var positions = [];
	  	var tempPoints = [];
	  	var polygon = null;
	  	var tooltip = document.getElementById("toolTip");
	  	var cartesian = null;
	  	var floatingPoint;//浮动点
	  	//tooltip.style.display = "block";
	  	
	  	handler.setInputAction(function(movement){
	  		/*tooltip.style.left = movement.endPosition.x + 3 + "px";
	  		tooltip.style.top = movement.endPosition.y - 25 + "px";
	          tooltip.innerHTML ='<p>单击开始，右击结束</p>';*/
	  		cartesian = scene.pickPosition(movement.endPosition); 
	  		//cartesian = viewer.scene.camera.pickEllipsoid(movement.endPosition, viewer.scene.globe.ellipsoid);
	  		if(positions.length >= 2){
	  			if (!Cesium.defined(polygon)) {
	  				polygon = new PolygonPrimitive(positions);
	  			}else{
	  				positions.pop();
	  				// cartesian.y += (1 + Math.random());
	  				positions.push(cartesian);
	  			}
	  			// tooltip.innerHTML='<p>'+distance+'米</p>';
	  		}
	  		entity.label.show = true;//控制鼠标上是否显示经纬度
			entity.label.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
			entity.label.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
			entity.label.font = '15px sans-serif';
			//entity.disableDepthTestDistance = true;
			entity.label.text = '右击关闭绘制功能' ;
	  	},Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	  	
	  	handler.setInputAction(function(movement){
	  		//tooltip.style.display = "none";
	  		cartesian = scene.pickPosition(movement.position); 
	  		// cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
	  		if(positions.length == 0) {
	  			positions.push(cartesian.clone());
	  		}
	  		//positions.pop();
	  		positions.push(cartesian);
	  		//在三维场景中添加点
	  		
	  		
	  		var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
	  		var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
	  		var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
	  		var heightString = 10;//cartographic.height;
	  		Cesium.Cartesian3.fromDegrees(116.3732262772,39.9077973173, 20);
	  		tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});
	  		floatingPoint = entities.add({
	  			name : '多边形面积',
	  			position : Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 0.5),//positions[positions.length - 1],			
	  			point : {
	  				pixelSize : 5,
	  				color : Cesium.Color.RED,
	  				outlineColor : Cesium.Color.WHITE,
	  				outlineWidth : 2
	  			}
	  		});	
	  		//drawstatus = 0
	  	},Cesium.ScreenSpaceEventType.LEFT_CLICK);
	  	 
	  	handler.setInputAction(function(movement){
	  		/*cartesian = scene.pickPosition(movement.position); 
	  		// cartesian = viewer.scene.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
	  		if(positions.length == 0) {
	  			positions.push(cartesian.clone());
	  		}
	  		//positions.pop();
	  		positions.push(cartesian);
	  		//在三维场景中添加点
	  		
	  		
	  		var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
	  		var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
	  		var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
	  		var heightString = 10;//cartographic.height;
	  		Cesium.Cartesian3.fromDegrees(116.3732262772,39.9077973173, 20);
	  		tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});*/
	  		
	  			
	  		handler.destroy();
	  		positions.pop();
	  		//tempPoints.pop();
	  		
	  		//viewer.entities.remove(floatingPoint);
	  		
	  		//tooltip.style.display = "none";
	  		//在三维场景中添加点
	  		// var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
	  		// var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
	  		// var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
	  		// var heightString = cartographic.height;
	  		// tempPoints.push({ lon: longitudeString, lat: latitudeString ,hei:heightString});
	  		var cartographic = Cesium.Cartographic.fromCartesian(positions[positions.length - 1]);
	  		var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
	  		var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
	   
	  		var textArea = getArea(tempPoints) + "平方公里";
	  		entities.add({
	  			name : '多边形面积',
	  			position : Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString,0),
	  			// point : {
	  			// 	pixelSize : 5,
	  			// 	color : Cesium.Color.RED,
	  			// 	outlineColor : Cesium.Color.WHITE,
	  			// 	outlineWidth : 2,
	  			// 	heightReference:Cesium.HeightReference.CLAMP_TO_GROUND 
	  			// },
	  			label : {
	  				text : textArea,
	  				font : '18px sans-serif',
	  				fillColor : Cesium.Color.GOLD,
	  				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
	  				outlineWidth : 2,
	  				verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
	  				pixelOffset : new Cesium.Cartesian2(0, -10)
	  			}
	  		});
	  		entity.label.show = false;
	  		
	      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK );	
	   
	  	var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad) 
	  	var degreesPerRadian = 180.0 / Math.PI;//弧度转化为角度
	  	
	  	//计算多边形面积
	  	function getArea(points) {
	  		
	  		var res = 0;
	  		//拆分三角曲面
	   
	  		for (var i = 0; i < points.length - 2; i++) {
	  			var j = (i + 1) % points.length;
	  			var k = (i + 2) % points.length;
	  			var totalAngle = Angle(points[i], points[j], points[k]);
	   
	  			
	  			var dis_temp1 = distance(positions[i], positions[j]);
	  			var dis_temp2 = distance(positions[j], positions[k]);
	  			res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle)) ;
	  			console.log(res);
	  		}
	  		
	  		
	  		return (res/1000000.0).toFixed(4);
	  	}
	   
	  	/*角度*/
	      function Angle(p1, p2, p3) {
	          var bearing21 = Bearing(p2, p1);
	          var bearing23 = Bearing(p2, p3);
	          var angle = bearing21 - bearing23;
	          if (angle < 0) {
	              angle += 360;
	          }
	          return angle;
	      }
	      /*方向*/
	      function Bearing(from, to) {
	          var lat1 = from.lat * radiansPerDegree;
	          var lon1 = from.lon * radiansPerDegree;
	          var lat2 = to.lat * radiansPerDegree;
	          var lon2 = to.lon * radiansPerDegree;
	          var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
	          if (angle < 0) {
	              angle += Math.PI * 2.0;
	          }
	          angle = angle * degreesPerRadian;//角度
	          return angle;
	      } 
	   
	  	var PolygonPrimitive = (function(){
	  		function _(positions){
	  			this.options = {
	  				name:'多边形',
	  				polygon : {
	  					hierarchy : [],
	  					perPositionHeight : true,
	  					extrudedHeight:0.5,
	  					material : Cesium.Color.GREEN.withAlpha(0.5)
	  				}
	  			};
	  			
	  			this.hierarchy = positions;
	  			this._init();
	  		}
	  	
	  		_.prototype._init = function(){
	  			var _self = this;
	  			var _update = function(){
	  				return _self.hierarchy;
	  			};
	  			//实时更新polygon.hierarchy
	  			this.options.polygon.hierarchy = new Cesium.CallbackProperty(_update,false);
	  			entities.add(this.options);
	  		};
	  	
	  		return _;
	  	})();
	   
	  	function distance(point1,point2){
	  		var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
	  		var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
	  		/**根据经纬度计算出距离**/
	  		var geodesic = new Cesium.EllipsoidGeodesic();
	  		geodesic.setEndPoints(point1cartographic, point2cartographic);
	  		var s = geodesic.surfaceDistance;
	  		//console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
	  		//返回两点之间的距离
	  		s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));	
	  		return s;
	  	}
	  	
	  };


//重复执行某个方法 
// var t1 = window.setInterval(hello,5000); 
// var t2 = window.setInterval("hello()",1000); 
//去掉定时器的方法 
//window.clearInterval(t1);
//初始界面
(function() {
	/*viewer.camera.flyTo({	
		//destination :  Cesium.Cartesian3.fromDegrees(116.383,39.903, 8000),  116.3833502774,39.9033814225    
		destination :  Cesium.Cartesian3.fromDegrees(116.38994911475129,39.89509257618663,2079),//初始化地图  109.5105236675,40.6619303652,22294721 //模型位置对应的中心点116.39430992605826,39.89520870191362,2079      //116.38505582077272lat:39.90437803870873屏幕中心点      (116.42485470892576,39.87143379776744,5000)  (116.44963152553781,39.85231682653562,8000)
		orientation: {
            heading : Cesium.Math.toRadians(-45), // default value is 0.0 (north) //放模型时-45
            pitch : Cesium.Math.toRadians(-45),// default value (looking down)   //放模型时 -45
            roll : 0//
        },
		duration : 3
	});*/
	var dy_shp =Cesium.Cartesian3.fromDegrees(109.5105236675,40.6619303652,22294721);
	viewer.camera.flyTo({
		destination :  dy_shp,
		orientation: {
			heading : Cesium.Math.toRadians(0), // default value is 0.0 (north)
			pitch : Cesium.Math.toRadians(-90),// default value (looking down)
			roll : 0//
		},
		duration : 5
	});
	var one_map = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
		url : 'world.jpg',
		rectangle : Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
	}));
	
	layer = new Cesium.WebMapServiceImageryProvider({
		url: "http://192.168.0.80:8080/geoserver/CESIUM_TEST/wms?",
		layers: 'CESIUM_TEST:shengjie',
		crs : 'EPSG:4326',
		style :'default',
		parameters: {
			service : 'WMS',
			format: 'image/png',
			transparent: true
		}

		//CESIUM_TEST:daolu_Project
	});
	viewer.imageryLayers.addImageryProvider(layer);
	
	
	
//初始化加载全国shp
//	layer = new Cesium.WebMapServiceImageryProvider({
//		url: "http://localhost:8080/geoserver/CESIUM_TEST/wms?",
//		layers: 'CESIUM_TEST:shengjie',
//		crs : 'EPSG:4326',
//		style :'default',
//		parameters: {
//			service : 'WMS',
//			format: 'image/png',
//			transparent: true
//		}
//
//		//CESIUM_TEST:daolu_Project
//	});
//	viewer.imageryLayers.addImageryProvider(layer);
	// setTimeout(function(){
		// viewer.camera.zoomOut(5000)
	// },3500)
	
	// complete: function () {
					//到达位置后执行的回调函数
					// viewer.camera.zoomOut(5000);
				// }
	
})();

viewer._cesiumWidget._creditContainer.style.display="none";  //页面版权信息

//echarts
var option = {
		/*title: {
			text: '堆叠区域图'
		},
		tooltip : {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},*/
		color: ['#7FFF00', '#8A2BE2', '#0000FF', '#7FFFD4',],
		legend: {
			data:['邮件营销','联盟广告','视频广告','直接访问',]
		},
		/*toolbox: {
			feature: {
				saveAsImage: {}
			}
		},*/
		grid: {
			left: '2%',
			right: '5%',
			bottom: '3%',
			containLabel: true
		},
		xAxis : [
			{
				type : 'category',
				boundaryGap : false,
				data : ['周一','周二','周三','周四','周五','周六','周日']
			}
		],
		yAxis : [
			{
				type : 'value'
			}
		],
		series : [
			{
				name:'邮件营销',
				type:'line',
				stack: '总量',
				areaStyle: {normal: {}},
				data:[120, 132, 101, 134, 90, 230, 210]
			},
			{
				name:'联盟广告',
				type:'line',
				stack: '总量',
				areaStyle: {normal: {}},
				data:[220, 182, 191, 234, 290, 330, 310]
			},
			{
				name:'视频广告',
				type:'line',
				stack: '总量',
				areaStyle: {normal: {}},
				data:[150, 232, 201, 154, 190, 330, 410]
			},
			{
				name:'直接访问',
				type:'line',
				stack: '总量',
				areaStyle: {normal: {}},
				data:[320, 332, 301, 334, 390, 330, 320]
			}
		]
	};
	var myChart = document.getElementsByClassName('container')[0];
	myChart = echarts.init(myChart);
	myChart.setOption(option);
	myChart.on('click', function(params) {
		function model_focus(){
			viewer.camera.flyTo({
				destination :  Cesium.Cartesian3.fromDegrees(116.72559100281,39.655342678370005,42671),//初始化地图  109.5105236675,40.6619303652,22294721  这个点是转换而来
				orientation: {
					heading : Cesium.Math.toRadians(-45), // default value is 0.0 (north) //放模型时-45
					pitch : Cesium.Math.toRadians(-45),// default value (looking down)   //放模型时 -45
					roll : 0//
				},
				duration : 3
			});
		};

		var number = params.seriesName;
		
		
		console.log(number)
		 
		switch (number)
		{
			case "邮件营销":
			//aaa.entityCollection.removeAll();
			
			  for (var i=0;i<=9;i++){	
					for(var j=0;j<=9;j++){
						var lat = random(116270000,116480000)*0.000001;
						var lon = random(39860000,39960000)*0.000001;
						 aaa = entities.add({							 
							rectangle : {
								name : '汽车生产量',
								coordinates : Cesium.Rectangle.fromDegrees(lat, lon, lat+0.0004,lon+0.0004), //  116.386, 39.912, 116.395, 39.920
								extrudedHeight : random(300, 5000),
								outline : false,
								outlineColor : Cesium.Color.WHITE,
								outlineWidth : 4,
								stRotation : Cesium.Math.toRadians(45),
								//material : Cesium.Color.fromRandom({alpha : 1.0})  CHARTREUSE
								material : Cesium.Color.CHARTREUSE   //Cesium.Color.fromAlpha(Cesium.Color.RED, parseFloat(0.5))  设置透明
							}
						});
					}
				};
				model_focus()
				//viewer.flyTo(viewer.entities,{duration:3});
			  break;
			case "联盟广告":
			//aaa.entityCollection.removeAll();
			  for (var i=0;i<=9;i++){	
					for(var j=0;j<=9;j++){
						var lat = random(116270000,116480000)*0.000001;
						var lon = random(39860000,39960000)*0.000001
						aaa = entities.add({
							rectangle : {
								name : '汽车生产量',
								coordinates : Cesium.Rectangle.fromDegrees(lat, lon, lat+0.0004,lon+0.0004), //  116.386, 39.912, 116.395, 39.920
								extrudedHeight : random(300, 5000),
								outline : false,
								outlineColor : Cesium.Color.WHITE,
								outlineWidth : 4,
								stRotation : Cesium.Math.toRadians(45),
								//material : Cesium.Color.fromRandom({alpha : 1.0})
								material : Cesium.Color.BLUEVIOLET
							}
						});
					}
				};
				model_focus()
				//viewer.flyTo(viewer.entities,{duration:3});
			  break;
			case "视频广告":
			//aaa.entityCollection.removeAll();
			  for (var i=0;i<=9;i++){	
					for(var j=0;j<=9;j++){
						var lat = random(116270000,116480000)*0.000001;
						var lon = random(39860000,39960000)*0.000001
						aaa = entities.add({
							rectangle : {
								name : '汽车生产量',
								coordinates : Cesium.Rectangle.fromDegrees(lat, lon, lat+0.0004,lon+0.0004), //  116.386, 39.912, 116.395, 39.920
								extrudedHeight : random(300, 5000),
								outline : false,
								outlineColor : Cesium.Color.WHITE,
								outlineWidth : 4,
								stRotation : Cesium.Math.toRadians(45),
								//material : Cesium.Color.fromRandom({alpha : 1.0})
								material : Cesium.Color.BLUE
							}
						});
					}
				};
				model_focus()
				//viewer.flyTo(viewer.entities,{duration:3});
			  break;
			case "直接访问":
			//aaa.entityCollection.removeAll();
			  for (var i=0;i<=9;i++){	
					for(var j=0;j<=9;j++){
						var lat = random(116270000,116480000)*0.000001;
						var lon = random(39860000,39960000)*0.000001
						aaa = entities.add({
							rectangle : {
								name : '汽车生产量',
								coordinates : Cesium.Rectangle.fromDegrees(lat, lon, lat+0.0004,lon+0.0004), //  116.386, 39.912, 116.395, 39.920
								extrudedHeight : random(300, 5000),
								outline : false,
								outlineColor : Cesium.Color.WHITE,
								outlineWidth : 4,
								stRotation : Cesium.Math.toRadians(45),
								//material : Cesium.Color.fromRandom({alpha : 1.0})
								material : Cesium.Color.AQUAMARINE
							}
						});
					}
				};
				model_focus()
				//viewer.flyTo(viewer.entities,{duration:3});
			  break;
			case "搜索引擎":
			//aaa.entityCollection.removeAll();
			  for (var i=0;i<=9;i++){	
					for(var j=0;j<=9;j++){
						var lat = random(116270000,116480000)*0.000001;
						var lon = random(39860000,39960000)*0.000001;

						aaa =	entities.add({
							            name : '汽车生产量',
										
										rectangle : {											
											coordinates : Cesium.Rectangle.fromDegrees(lat, lon, lat+0.0004,lon+0.0004), //  116.386, 39.912, 116.395, 39.920
											extrudedHeight : random(300, 5000),
											outline : false,
											outlineColor : Cesium.Color.WHITE,
											outlineWidth : 4,
											stRotation : Cesium.Math.toRadians(45),
											//material : Cesium.Color.fromRandom({alpha : 1.0})
											material : Cesium.Color.AQUA
										}
									});
									
									console.log(model.name);
									//model.entityCollection.removeAll();									
									
						
					}
				};
				model_focus()
				//viewer.flyTo(viewer.entities,{duration:3});
				
							
			  break;
			 
		}
			

		
	})

function home(){	
	viewer.camera.flyTo({	
		destination :  Cesium.Cartesian3.fromDegrees(116.38994911475129,39.89509257618663,2079), //home主页
		orientation: {
            heading : Cesium.Math.toRadians(-45), // default value is 0.0 (north)
            pitch : Cesium.Math.toRadians(-45),// default value (looking down)
            roll : 0//
        },
		duration : 3
		
	});
	// ,
		// complete: function () {
							//到达位置后执行的回调函数
							// viewer.camera.zoomOut(5000);
						// }
}
function model_clear(){
	debugger;
	if(!aaa){
		
	}else{
		aaa.entityCollection.removeAll();

	}
	myobj.imageryProvider=new Cesium.ArcGisMapServerImageryProvider({
		url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
	})
	viewer.entities.removeAll();//清除初始化点DJ
	/*handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);//
	handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
*/


	//平移
	// viewer.camera.setView({
    // destination : Cesium.Cartesian3.fromDegrees(116.386, 39.903, 8000.0),
	// orientation : {
        // direction : new Cesium.Cartesian3(-0.04231243104240401, -0.20123236049443421, -0.97862924300734),
        // up : new Cesium.Cartesian3(-0.47934589305293746, -0.8553216253114552, 0.1966022179118339)
    // }
// });

	//viewer.camera.zoomIn(1000);
	//viewer.camera.zoomOut(1000);
}
function abc(){
	
	var center = Cesium.Cartesian3.fromDegrees(116.383,39.909);
	var heading = -Cesium.Math.PI_OVER_TWO;
	var pitch = Cesium.Math.PI_OVER_FOUR;
	var roll = 0.0;
	var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
	var quaternion = Cesium.Transforms.headingPitchRollQuaternion(center, hpr);
}

var ellipsoid = scene.globe.ellipsoid;
var entity = viewer.entities.add({
    label : {
        show : false
    }
});
var longitudeString = null;
var latitudeString = null;
var height = null;
var cartesian = null;
// 定义当前场景的画布元素的事件处理
var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
//设置鼠标移动事件的处理函数，这里负责监听x,y坐标值变化
handler.setInputAction(function(movement) {
    //通过指定的椭球或者地图对应的坐标系，将鼠标的二维坐标转换为对应椭球体三维坐标
	
	
    cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);

    if (cartesian) {
        //将笛卡尔坐标转换为地理坐标
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        //将弧度转为度的十进制度表示
        longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        //获取相机高度
        height = Math.ceil(viewer.camera.positionCartographic.height);
        entity.position = cartesian;
		
        entity.label.show = false;//控制鼠标上是否显示经纬度
        entity.label.text = '(' + longitudeString.toFixed(3) + ', ' + latitudeString.toFixed(3) + "," + height + ')' ;
    }else {
        entity.label.show = false;
    }
	
	//div 获取坐标值
	//document.getElementById("lonlat").innerHTML="经度:"+"  "+longitudeString.toFixed(3)+"&nbsp&nbsp"+"  纬度:  "+latitudeString.toFixed(3)+"&nbsp&nbsp"+"   高度: "+height+"m";
	//longitudeString = longitudeString.substring(0,longitudeString.indexOf(".")+1);
    
    //打印坐标值
    console.log(longitudeString.toFixed(10) +',' +latitudeString.toFixed(10) + ","+ height)//左击事件
	console.log(cartesian.x+','+cartesian.y+','+cartesian.z);
	viewer.scene.pickPosition(event.position)
},Cesium.ScreenSpaceEventType.LEFT_CLICK );//鼠标滑动获取坐标值  Cesium.ScreenSpaceEventType.MOUSE_MOVE

//左击获取坐标值


//设置鼠标滚动事件的处理函数，这里负责监听高度值变化
// handler.setInputAction(function(wheelment) {
    // height = Math.ceil(viewer.camera.positionCartographic.height);
    // entity.position = cartesian;
    // entity.label.show = false; //控制鼠标上是否显示经纬度
    // entity.label.text = '(' + longitudeString + ', ' + latitudeString + "," + height + ')' ;
	// alert("缩放啦")
// }, Cesium.ScreenSpaceEventType.WHEEL);
// handler.setInputAction(function(wheelment) {
    
	// alert("平移啦")
// }, Cesium.CameraEventType.LEFT_DRAG);

//左击获取坐标
/*handler.setInputAction(function(wheelment) {            
	console.log(longitudeString.toFixed(10) +',' +latitudeString.toFixed(10) + ","+ height)//左击事件
	console.log(cartesian.x+','+cartesian.y+','+cartesian.z);
	viewer.scene.pickPosition(event.position)
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);*/

var gy_wms =Cesium.Cartesian3.fromDegrees(106.6371905002,26.6854640131,30000);
var dy_shp =Cesium.Cartesian3.fromDegrees(109.5105236675,40.6619303652,22294721);

function changeMap(drawingMode){
	debugger;
	if (drawingMode === 'GY_IMG_WMS') {
		layer = new Cesium.WebMapServiceImageryProvider({
			url: 'http://192.168.0.80:8080/geoserver/gwc/service/wms?SERVICE=WMS&amp',
			layers: 'xichanganjie:BYQ',
			crs : 'EPSG:4326',
			style :'default',
			parameters: {
				service : 'WMS',
				format: 'image/png',
				transparent: true
			}
		});
		
		/*var one_map = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
			url : 'BYQ.tif',
			rectangle : Cesium.Rectangle.fromDegrees(106.589564439876, 26.658124786356545, 106.68509248494313, 26.711669168305)
		}));*/
		
		

		//viewer.imageryLayers.addImageryProvider(shadedRelief2);
		//layer1 = new Cesium.WebMapServiceImageryProvider({
		//	url: 'http://192.168.0.80:8080/geoserver/gwc/service/wms?SERVICE=WMS&amp',
		//	layers: 'guiyang:D_BUILDING',
		//	crs : 'EPSG:4326',
		//	style :'default',
		//	parameters: {
		//		service : 'WMS',
		//		format: 'image/png',
		//		transparent: true
		//	}
		//});
		layer1 = new Cesium.WebMapServiceImageryProvider({
			url: 'http://localhost:8090/geoserver/gwc/service/wms?SERVICE=WMS&amp',
			layers: 'guiyang:D_BUILDING',
			crs : 'EPSG:4326',
			style :'default',
			parameters: {
				service : 'WMS',
				format: 'image/png',
				transparent: true
			}
		});
		//layer.alpha = 0.1;
		viewer.imageryLayers.addImageryProvider(layer);
		viewer.imageryLayers.addImageryProvider(layer1);
		viewer.camera.flyTo({
			destination :  gy_wms,
			orientation: {
				heading : Cesium.Math.toRadians(0), // default value is 0.0 (north)
				pitch : Cesium.Math.toRadians(-90),// default value (looking down)
				roll : 0//
			},
			duration : 4
		});
	}
	else if (drawingMode === 'China_Shp') {
		viewer.imageryLayers.removeAll()
		viewer.camera.flyTo({
			destination :  dy_shp,
			orientation: {
				heading : Cesium.Math.toRadians(0), // default value is 0.0 (north)
				pitch : Cesium.Math.toRadians(-90),// default value (looking down)
				roll : 0//
			},
			duration : 5
		});
		var one_map = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
			url : 'world.jpg',
			rectangle : Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
		}));
		
		layer = new Cesium.WebMapServiceImageryProvider({
			url: "http://192.168.0.80:8080/geoserver/CESIUM_TEST/wms?",
			layers: 'CESIUM_TEST:shengjie',
			crs : 'EPSG:4326',
			style :'default',
			parameters: {
				service : 'WMS',
				format: 'image/png',
				transparent: true
			}

			//CESIUM_TEST:daolu_Project
		});
		
		
		
		viewer.imageryLayers.addImageryProvider(layer);
	}else if(drawingMode === 'Single_IMG_WMS'){
		var one_map = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
							url : 'world.jpg',
							rectangle : Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
						}));
		//one_map.alpha = 0.1;//调整透明度

	}else if(drawingMode === 'Delete allLayer'){
		viewer.imageryLayers.removeAll()
	}else if(drawingMode === 'tdtLUWANG'){
		var TDTLW = new Cesium.WebMapTileServiceImageryProvider({
			url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg",
			layer: "tdtAnnoLayer",
			style: "default",
			format: "image/jpeg",
			tileMatrixSetID: "GoogleMapsCompatible",
			show: false
		});
		//openstreet.alpha = 0.5;
		//esri.brightness = 2.0
		viewer.imageryLayers.addImageryProvider(TDTLW);
		
//		viewer.camera.flyTo({	
//			destination :  Cesium.Cartesian3.fromDegrees(116.38994911475129,39.89509257618663,2079), //home主页
//			orientation: {
//	            heading : Cesium.Math.toRadians(-45), // default value is 0.0 (north)
//	            pitch : Cesium.Math.toRadians(-45),// default value (looking down)
//	            roll : 0//
//	        },
//			duration : 3
//			
//		});
	}else if(drawingMode === 'arcgis'){
		var ArcGIS = new Cesium.ArcGisMapServerImageryProvider({
			url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
		});
		viewer.imageryLayers.addImageryProvider(ArcGIS);





	}else if(drawingMode === 'tdtWMTS'){
		var TDTWMTS =new Cesium.WebMapTileServiceImageryProvider({
		     // 加载天地图WMTS 成功
			  url: "http://{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
			  layer: "tdtBasicLayer",
			  style: "default",
			  format: "image/jpeg",
			  maximumLevel: 17,
			  tileMatrixSetID: "GoogleMapsCompatible",
			  subdomains:['t0','t1','t2','t3','t4','t5','t6','t7']
		  })
		viewer.imageryLayers.addImageryProvider(TDTWMTS);



	}
}

//加载arcgis streetmap
//var esri = new Cesium.ArcGisMapServerImageryProvider({
//	url : 'https://services.arcgisonline.com/arcgis/rest/services/ESRI_StreetMap_World_2D/MapServer'
//});
//esri.alpha = 0.5;
////esri.brightness = 2.0
//viewer.imageryLayers.addImageryProvider(esri);
function  go(){
	viewer.camera.rotateLeft(18/180*Math.PI);
	setTimeout(go,2000)
}
var options = [
	{
		text : 'Change Map'
	},
	{
		text : '天地图',
		onselect : function() {
			debugger;
			drawingMode = 'tdtWMTS';
			changeMap(drawingMode);
		}
	},
	{
	text : '贵阳地图',
	onselect : function() {
		
		drawingMode = 'GY_IMG_WMS';
		changeMap(drawingMode);
	}
},{
		text : '路网地图',
		onselect : function() {
			drawingMode = 'tdtLUWANG';
			changeMap(drawingMode)
		}
	},
	{
		text : '全国地图',
		onselect : function() {
			drawingMode = 'China_Shp';
			changeMap(drawingMode)
		}
	},
	{
		text : '透明地图',
		onselect : function() {
			transpatenBuilding();
		}
	},
	{
		text : '删除所有图层',
		onselect : function() {
			drawingMode = 'Delete allLayer';
			changeMap(drawingMode)
		}
	}
];


Sandcastle.addToolbarMenu(options);

//绘制点线面
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
/*
function createPoint(worldPosition) {
	var point = viewer.entities.add({
		position : worldPosition,
		point : {
			color : Cesium.Color.WHITE,
			pixelSize : 5,
			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
		}
	});
	return point;
}*/



var options1 = [{
	text : 'Draw Geometric'
}, {
	text : '点',
	onselect : function() {
		terminateShape();//这句不添加会使第一个点绘制不成功
		//drawShape(activeShapePoints)//测试代码
		drawingMode = 'Point';
		drawstatus =1;
		
		var url=__ctx + "/Comp/Stereoscopic_Point/getByType.ht";
        //绘制后台点数据
		$.ajax({
            url: url,
            type: "post",
            dataType: "json",
            success: function(data){
                debugger;
                for(var i=0;i<data.length;i++){
                	/*var point = viewer.entities.add({
                		position : Cesium.Cartesian3.fromDegrees(Number(data[i].x),Number(data[i].y),10), //  worldPosition, Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 10), 
                		point : {
                			color : Cesium.Color.RED,
                			pixelSize : 5,
                			outlineColor : Cesium.Color.WHITE,
                			outlineWidth : 2,
                			heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                		},
                		label : {
                		    text : 'LALAL',
                		    font : '14pt monospace',
                		    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                		    outlineWidth : 2,
                		    //垂直位置
                		    verticalOrigin : Cesium.VerticalOrigin.BUTTON,
                		    //中心位置
                		    pixelOffset : new Cesium.Cartesian2(0, 20)
                		  }
                	});*/
                	
                	
                	  
                	var billboards = viewer.entities.add({
            			position : Cesium.Cartesian3.fromDegrees(Number(data[i].x),Number(data[i].y)),
            			billboard : new Cesium.BillboardGraphics({
            				show : true ,
            				image : 'Sandcastle/images/point.png',
            				//pixelOffset: new Cesium.Cartesian2(0, 0),
            				//eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
            				horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            				scale: 1.0

            			})
            		});
                	//handler.destroy();
                }
                
                
                 
            },
            error: function(msg){
                alert("未查询到数据");
            }
        });
		
		
        
        

	}
},{
	text : '线',
	onselect : function() {
		terminateShape();
		//drawShape(activeShapePoints)//测试代码
		drawingMode = 'line';
		drawstatus =1;
	}
},{
	text : '面',
	onselect : function() {
		terminateShape();
		drawingMode = 'polygon';
		drawstatus =1;
	}
}

];



//worldPosition
function createPoint(worldPosition) {
	scene.globe.depthTestAgainstTerrain = true;
	
	
	
	if(drawingMode === 'Point'){
		var billboards = viewer.entities.add({
			position : worldPosition,
			billboard : new Cesium.BillboardGraphics({
				show : true ,
				image : 'Sandcastle/images/point.png',
				//pixelOffset: new Cesium.Cartesian2(0, 0),
				//eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
				horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
				scale: 1.0

			})
		});
		
		
		$('#cesium-infoBox').css('display','block');
		handler.destroy();
	}else {
		
		/*var cartographic = Cesium.Cartographic.fromCartesian(worldPosition);
  		var longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
  		var latitudeString = Cesium.Math.toDegrees(cartographic.latitude);*/
		var point = viewer.entities.add({
			position : worldPosition, //  worldPosition, Cesium.Cartesian3.fromDegrees(longitudeString,latitudeString, 10), 
			point : {
				color : Cesium.Color.RED,
				pixelSize : 5,
				outlineColor : Cesium.Color.WHITE,
				outlineWidth : 2,
				heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
			}
		});
	}


	
	return point;
}
var drawingMode = 'line';//这个drawingMode不申明 drawShape这函数会报错，而且它不定义成line 绘制功能就不好使
function drawShape(positionData) {
	
	scene.globe.depthTestAgainstTerrain = true;
	//在不添加地形图时 该句可以保证画的点位置定死 不偏移，但是这句触发后会使点的title被遮挡而且点也被遮住了一半
	
	myobj.infoBox = false
	var shape;
	if (drawingMode === 'line') {
		handler.setInputAction(function(event) {
			//var pick1 = scene.globe.pick(viewer.camera.getPickRay(event.position),scene); 屏幕坐标转世界坐标（笛卡尔三维坐标）
			// We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
			// we get the correct point when mousing over terrain.
			var earthPosition = viewer.scene.pickPosition(event.position);
			// `earthPosition` will be undefined if our mouse is not over the globe.
			if (Cesium.defined(earthPosition)) {
				scene.globe.depthTestAgainstTerrain = true;
				if (activeShapePoints.length === 0) {
					floatingPoint = createPoint(earthPosition);
					activeShapePoints.push(earthPosition);
					var dynamicPositions = new Cesium.CallbackProperty(function () {
						return activeShapePoints;
					}, false);
					activeShape = drawShape(dynamicPositions);
				}
				activeShapePoints.push(earthPosition);
				createPoint(earthPosition);
			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		handler.setInputAction(function(event) {

			terminateShape();
			//handler.destroy();
			//handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //移除监听事件
			//viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //移除监听事件

		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		shape = viewer.entities.add({
			polyline : {
				positions : positionData,
				clampToGround : true,
				width : 3,
				zIndex:999
			}
		});
	}
	else if (drawingMode === 'polygon') {
		shape = viewer.entities.add({
			polygon: {
				hierarchy: positionData,
				material: new Cesium.ColorMaterialProperty(Cesium.Color.WHITE.withAlpha(0.7))
			}
		});
	}
	
	return shape;
}
var activeShapePoints = [];
var activeShape;
var floatingPoint;
var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
var pick1;
//handler.setInputAction(function(event) {
//	//var pick1 = scene.globe.pick(viewer.camera.getPickRay(event.position),scene); 屏幕坐标转世界坐标（笛卡尔三维坐标）
//	// We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
//	// we get the correct point when mousing over terrain.
//	var earthPosition = viewer.scene.pickPosition(event.position);
//	// `earthPosition` will be undefined if our mouse is not over the globe.
//	if (Cesium.defined(earthPosition)) {
//		scene.globe.depthTestAgainstTerrain = true;
//		if (activeShapePoints.length === 0) {
//			floatingPoint = createPoint(earthPosition);
//			activeShapePoints.push(earthPosition);
//			var dynamicPositions = new Cesium.CallbackProperty(function () {
//				return activeShapePoints;
//			}, false);
//			activeShape = drawShape(dynamicPositions);
//		}
//		activeShapePoints.push(earthPosition);
//		createPoint(earthPosition);
//	}
//}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
handler.setInputAction(function(event) {
	scene.globe.depthTestAgainstTerrain = false//这句使得滚轮缩放的时候 点的billboard可以一直呈现，但是随着缩放级别的变大 billboard位置和点有偏差
	//下面的监听事件保证滚动事件结束后，地图上打的点不会飘
	viewer.scene.camera.moveEnd.addEventListener(function(){
		//获取当前相机高度
		//height = Math.ceil(earth.camera.positionCartographic.height);
		scene.globe.depthTestAgainstTerrain =true
	})
},Cesium.ScreenSpaceEventType.WHEEL);
handler.setInputAction(function(event) {
	//scene.globe.depthTestAgainstTerrain = true;//这个鼠标时间里添加这句会使点的title描述被遮挡
	if (Cesium.defined(floatingPoint)) {
		var newPosition = viewer.scene.pickPosition(event.endPosition);
		if (Cesium.defined(newPosition)) {
			floatingPoint.position.setValue(newPosition);
			activeShapePoints.pop();
			activeShapePoints.push(newPosition);

			//var describe = viewer.entities.add({
			//	show : false,
			//	horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
			//	verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            //
			//});
			if(drawingMode == 'Point'){

			}else {
				entity.label.show = true;//控制鼠标上是否显示经纬度
				entity.label.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
				entity.label.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
				entity.label.font = '15px sans-serif';
				//entity.disableDepthTestDistance = true;
				entity.label.text = '右击结束绘制' ;
			}

		}
	}
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
// Redraw the shape so it's not dynamic and remove the dynamic shape.
function terminateShape() {
	activeShapePoints.pop();
	drawShape(activeShapePoints);
	viewer.entities.remove(floatingPoint);
	viewer.entities.remove(activeShape);	
	floatingPoint = undefined;
	activeShape = undefined;
	activeShapePoints = [];
	//handler.destroy();
	scene.globe.depthTestAgainstTerrain = true;
}




Sandcastle.addToolbarMenu(options1);



//纯三维联动
/**在此js文件中引入新的js文件**/
new_element=document.createElement("script");
　　new_element.setAttribute("type","text/javascript");
　　new_element.setAttribute("src","gcj02ToWGS84.js");// 在这里引入了gcj02ToWGS84.js
　　document.body.appendChild(new_element);

new_element=document.createElement("script");
new_element.setAttribute("type","text/javascript");
new_element.setAttribute("src","wgs84(gps)Togcj02.js");// 在这里引入了wgs84(gps)Togcj02.js
document.body.appendChild(new_element);


//new_element=document.createElement("script");
//new_element.setAttribute("type","text/javascript");
//new_element.setAttribute("src","VitoGISFramework.js");// 在这里引入了wgs84(gps)Togcj02.js
//document.body.appendChild(new_element);
//屏幕中心点
function getscreenpoint(){
	var result = viewer.camera.pickEllipsoid(new Cesium.Cartesian2 (
			viewer.canvas.clientWidth /2 , viewer.canvas.clientHeight / 2));
			var curPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(result);
			var lon_screen = curPosition.longitude*180/Math.PI;
			var lat_screen = curPosition.latitude*180/Math.PI;
			var point={"lon":lon_screen,"lat":lat_screen};
			return point;
}
var WhoisCtroler = '3D';
viewer.scene.camera.moveEnd.addEventListener(function(){
	var height = Math.ceil(viewer.camera.positionCartographic.height);
	console.log('当前镜头高度：'+ height);
	if(height<5000 && WhoisCtroler === '3D' ){		
		var cameraCurrentHeight=0;
		SEND = WS_phone();//此处的SEND 要大写！！！
		var ABC = GPS.gcj_encrypt(getscreenpoint().lat,getscreenpoint().lon)
		var lat_gcj02 = ABC.lat;
		var lon_gcj02 = ABC.lon;
		
		SEND('ZXD', {
			point: [lat_gcj02,lon_gcj02],
			zoom2:height
		});
		if(height<250 && height>200 && cameraCurrentHeight ==0 ){
			cameraCurrentHeight =1;
			//alert("现在相机高度小于250M,如果继续放大,默认地图将不做缩放。")
		}else if(height>3550 && cameraCurrentHeight ==0 ){
			cameraCurrentHeight =1;
			//alert("现在相机高度大于3550M,如果继续缩小,默认地图将不做缩放。")
		}
	}
	
});
$("#cesiumContainer").hover(function(){
	SEND = WS_phone();
	WhoisCtroler = '3D'
	console.log("主动")
	



},function(){
	console.log("被动")
	send = null;
	WhoisCtroler = '25D'
	WS_pc(function(name, json) {
		switch(name) {
			case 'ZOOM':
				var cameraHeight = 0;
				if(json.zoom==13){
					cameraHeight = 3550;
				}else if(json.zoom == 14){
					cameraHeight = 2080;
				}else if(json.zoom == 15){
					cameraHeight = 1000;
				}else if(json.zoom == 16){
					cameraHeight = 500;
				}else if(json.zoom == 17){
					cameraHeight = 200;
				}else {
					cameraHeight = 100;
				}
				var wgs84A = gcj02towgs84(json.point[1], json.point[0]);
				var lonWGS84 = computerThatLonLat(wgs84A[0],wgs84A[1],135,cameraHeight).lon;
				var latWGS84 = computerThatLonLat(wgs84A[0],wgs84A[1],135,cameraHeight).lat;
				viewer.camera.flyTo({
					destination :  Cesium.Cartesian3.fromDegrees(lonWGS84,latWGS84,cameraHeight),//  这个点是转换而来
					orientation: {
						heading : Cesium.Math.toRadians(-45), // default value is 0.0 (north) //放模型时-45
						pitch : Cesium.Math.toRadians(-45),// default value (looking down)   //放模型时 -45
						roll : 0//
					},
					duration : 3
				});
				//if(gis.mapManager.configManager.getCurrentBaseLayerConf().title == '默认地图'){
				//	gis.mapManager.map.setZoom(json.zoom-2);
				//	console.log("默认地图被动，缩放级别为 :"+json.zoom-2)
				//}else{
				//	gis.mapManager.map.setZoom(json.zoom+2);
				//	console.log("高德地图被动，缩放级别为 :"+json.zoom+2)
				//}

				break;
			case 'DRAG':
				var cameraHeight = 0;
				if(json.zoom==13){
					cameraHeight = 3550;
				}else if(json.zoom == 14){
					cameraHeight = 2080;
				}else if(json.zoom == 15){
					cameraHeight = 1000;
				}else if(json.zoom == 16){
					cameraHeight = 500;
				}else if(json.zoom == 17){
					cameraHeight = 200;
				}else {
					cameraHeight = 100;
				}
				var wgs84A = gcj02towgs84(json.point[1], json.point[0]);
				var lonWGS84 = computerThatLonLat(wgs84A[0],wgs84A[1],135,cameraHeight).lon;
				var latWGS84 = computerThatLonLat(wgs84A[0],wgs84A[1],135,cameraHeight).lat;
				viewer.camera.flyTo({
					destination :  Cesium.Cartesian3.fromDegrees(lonWGS84,latWGS84,cameraHeight),//  这个点是转换而来
					orientation: {
						heading : Cesium.Math.toRadians(-45), // default value is 0.0 (north) //放模型时-45
						pitch : Cesium.Math.toRadians(-45),// default value (looking down)   //放模型时 -45
						roll : 0//
					},
					duration : 3
				});
				//if(gis.mapManager.configManager.getCurrentBaseLayerConf().title == '默认地图'){
				//	gis.mapManager.map.setView(json.point, json.zoom-2);
				//	console.log("默认地图被动，缩放级别为 :"+json.zoom-2)
				//}else{
				//	gis.mapManager.map.setView(json.point, json.zoom+2);
				//	console.log("高德地图被动，缩放级别为 :"+json.zoom+2)
				//}
				break;
			case 'MATCH':
				//gis.layerManager._getMatchFeature(json.layername, json.layerid, json.layertype, "over");
				break;
			case 'OUT':
				//gis.layerManager._getMatchFeature(json.layername, json.layerid, json.layertype, "out");
				break;
		}
	})

})
//加载czml
/*Sandcastle.addToolbarButton('Vehicle', function() {
    viewer.dataSources.add(Cesium.CzmlDataSource.load('Vehicle1.czml'));    
});*/
var showdata =1;
function trail() {
	
	var manModel =Cesium.CzmlDataSource.load('Vehicle1.czml');
	if(showdata===1){
		viewer.dataSources.add(manModel);
		showdata=2;
	}else{
		viewer.dataSources.removeAll();
		showdata =1;
	}
	
}
/*function gotrail(){
	var dataSource = new Cesium.CzmlDataSource();
	var czmlPath = 'Vehicle1.czml';
	dataSource.process(czmlPath).then(function() {
        part.loaded = true;
        updateStatusDisplay();
        viewer.trackedEntity = vehicleEntity = dataSource.entities.getById('Vehicle');

        // Follow the vehicle with the camera.
        if (!viewer.trackedEntity) {
            viewer.trackedEntity = vehicleEntity = dataSource.entities.getById('Vehicle');
        }
    });
}*/

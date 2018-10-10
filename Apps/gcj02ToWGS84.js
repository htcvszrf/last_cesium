/**
*已知一个点A的经纬度坐标和点B、A点的距离d、AB的方位角，求B点的经纬度（WGS84坐标系）
*
*
**/
   
 
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
	
	
	//高德转wgs84

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
	    	var a = 6378245.0;
	        var dlat = transformlat(lng - 105.0, lat - 35.0);
	        var dlng = transformlng(lng - 105.0, lat - 35.0);
	        var radlat = lat / 180.0 * PI;
	        var magic = Math.sin(radlat);
	        magic = 1 - ee * magic * magic;
	        var sqrtmagic = Math.sqrt(magic);
	        dlat = (dlat * 180.0) / ((a*(1 - ee)) / (magic * sqrtmagic) * PI);
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
	
	
	
	
	
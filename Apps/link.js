/**
 * Created by Mr_Chai on 2018/12/7.
 */

var longitude11 = 116.37374666585602;
var latitude11 = 39.90654482534493;
//url: 'http://localhost:9002/api/folder/489b6b40ebad475e831594c34fd553de/tileset.json'
//dantihua/report/tileset.json
var height11 = 0;
var heading11 = 0;
var tileset11= new Cesium.Cesium3DTileset({
    url: 'dantihua/report/tileset.json',
    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
});
//      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
tileset11.style = new Cesium.Cesium3DTileStyle({
    color: 'rgba(255, 0, 0, 0.01)'
});


viewer.scene.primitives.add(tileset11);
tileset11.readyPromise.then(function(argument) {
    var position = Cesium.Cartesian3.fromDegrees(longitude11, latitude11, height11);
    var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading11)));
    Cesium.Matrix4.multiply(mat, rotationX, mat);
    tileset11._root.transform = mat;
    //viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(longitude1, latitude1, height1 + 1000)});
});

/*图书大厦 坐标信息
//url: 'dantihua/book/tileset.json',
var longitude12 = 116.3708092339;
var latitude12 = 39.9066932213;
*/
var longitude12 = 116.37374666585602;
var latitude12 = 39.90654482534493;
var height12 = 0;
var heading12 = 0;
var tileset12= new Cesium.Cesium3DTileset({
    url: 'singleFeature/wholeReportB/tileset.json',
    classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
});
//      classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
tileset12.style = new Cesium.Cesium3DTileStyle({
    color: 'rgba(255, 0, 0, 0.01)'
});


viewer.scene.primitives.add(tileset12);
tileset12.readyPromise.then(function(argument) {
    var position = Cesium.Cartesian3.fromDegrees(longitude12, latitude12, height12);
    var mat = Cesium.Transforms.eastNorthUpToFixedFrame(position);
    var rotationX = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(heading12)));
    Cesium.Matrix4.multiply(mat, rotationX, mat);
    tileset12._root.transform = mat;
    //viewer.camera.flyTo({destination: Cesium.Cartesian3.fromDegrees(longitude1, latitude1, height1 + 1000)});
});








//
//    // Information about the currently selected feature
//    var selected = {
//        feature: undefined,
//        originalColor: new Cesium.Color()
//    };
//
//    // Information about the currently highlighted feature
//    var highlighted = {
//        feature: undefined,
//        originalColor: new Cesium.Color()
//    };
//
//    // An entity object which will hold info about the currently selected feature for infobox display
//    var selectedEntity = new Cesium.Entity();
//    var drawstatus = 0;
//    var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
//    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
//        // If a feature was previously selected, undo the highlight
//        if (drawstatus == 0){
//            if (Cesium.defined(selected.feature)) {
//                selected.feature.color = selected.originalColor;
//                selected.feature = undefined;
//            }
//        }
//
//
//        // Pick a new feature
//        var pickedFeature = viewer.scene.pick(movement.position);
//        if (!Cesium.defined(pickedFeature) && drawstatus ==0) {
//            clickHandler(movement);
//            return;
//        }
//
//        // Select the feature if it's not already selected
//        if (selected.feature === pickedFeature  && drawstatus ==0) {
//            return;
//        }
//        selected.feature = pickedFeature;
//
//
//        // Save the selected feature's original color
//        if (pickedFeature === highlighted.feature && drawstatus ==0) {
//            Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
//            highlighted.feature = undefined;
//        } else {
//            Cesium.Color.clone(pickedFeature.color, selected.originalColor);
//        }
//        //alert('lalalall')
//        // Highlight newly selected feature
//        pickedFeature.color = Cesium.Color.LIME;
//        //function clickonme(){}
//
//        // Set feature infobox description
//        var featureName = pickedFeature.getProperty('name');
//        selectedEntity.name = featureName;
//        selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
//        viewer.selectedEntity = selectedEntity;
//        selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
//                '<tr><th>名称</th><td>' + pickedFeature.getProperty('name') + '</td></tr>' +
//                '<tr><th>描述</th><td>' + pickedFeature.getProperty('describe') + '</td></tr>' +
//                '<tr><th>楼高</th><td>' + pickedFeature.getProperty('floorheigh') + '</td></tr>'  +
//                '</tbody></table>';
//
//
//
//
//    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);



function getBimHtml(pickedFeature) {
    if (!pickedFeature.tileset.properties || !pickedFeature.tileset.properties.length)
        return false;


    var fileParams;

    //如果有文件名，那么依据文件名
    if (pickedFeature.hasProperty("file")) {
        var file = pickedFeature.getProperty("file");

        for (var i = 0; i < pickedFeature.tileset.properties.length; i++) {
            var params = pickedFeature.tileset.properties[i];
            if (params.file == file) {
                fileParams = params.params;
            }
        }
    }
    //直接取第一个
    else {
        fileParams = pickedFeature.tileset.properties[0].params;
    }

    if (!fileParams)
        return false;

    // 名称和 id
    var html = '<table class="cesium-infoBox-defaultTable"><tbody>';
    html += '<tr><th>名称(name)</th><td>' + pickedFeature.getProperty("name") + '</td></tr>';

    html += '<tr><th>楼层(LevelName)</th><td>' + pickedFeature.getProperty("LevelName") + '</td></tr>';

    html += '<tr><th>分类(CategoryName)</th><td>' + pickedFeature.getProperty("CategoryName") + '</td></tr>';

    html += '<tr><th>族(FamilyName)</th><td>' + pickedFeature.getProperty("FamilyName") + '</td></tr>';

    html += '<tr><th>族类型(FamilySymbolName)</th><td>' + pickedFeature.getProperty("FamilySymbolName") + '</td></tr>';


    html += '<tr><th>ID(id)</th><td>' + pickedFeature.getProperty("id") + '</td></tr>'

    //依据group分类
    var groups = {

    };

    function getValue(value, defp) {
        if (defp.type == "YesNo")
            return value == 1 ? '是' : '否';
        if (defp.type == "Length")
            return (value * 0.3048).toFixed(2) + 'm';
        if (defp.type == "Area")
            return (value * 0.3048 * 0.3048).toFixed(2) + '㎡';
        if (defp.type == "Volume")
            return (value * 0.3048 * 0.3048 * 0.3048).toFixed(2) + 'm³';

        return value;
    }

    function addGroup(name, value) {


        var defp;

        for (var i = 0; i < fileParams.length; i++) {
            var fp = fileParams[i];
            if (name == fp.name) {
                defp = fp;
                break;
            }
        }
        if (!defp)
            return;

        var rows = groups[defp.group];

        if (!rows) {
            rows = [];
        }
        var row = '<tr><th>' + defp.name + '</th><td>' + getValue(value, defp) + '</td></tr>';
        rows.push(row);
        groups[defp.group] = rows;
    }

    function groupName(group) {
        if (group == "PG_IDENTITY_DATA")
            return "标识数据";
        if (group == "PG_GEOMETRY")
            return "尺寸标注";
        if (group == "PG_PHASING")
            return "阶段化";
        if (group == "PG_CONSTRAINTS")
            return "约束";
        if (group == "INVALID")
            return '其他';
        if (group == "PG_MATERIALS")
            return '材质和装饰';
        if (group == "PG_CONSTRUCTION")
            return '构造';

        return group;
    }

    var names = pickedFeature._content.batchTable.getPropertyNames(pickedFeature._batchId);
    for (var i = 0; i < names.length; i++) {
        var n = names[i];

        addGroup(n, pickedFeature.getProperty(n));
    }

    for (group in groups) {

        html += '<tr><th colspan="2">' + groupName(group) + '</th></tr>';;

        var rows = groups[group];
        for (var i = 0; i < rows.length; i++) {
            html += rows[i];
        }


    }

    return html;

}

var featureViewer = {
    colorHighlight: Cesium.Color.YELLOW.withAlpha(0.5),
    colorSelected: Cesium.Color.LIME.withAlpha(0.5),
    setMouseOver: function(v) {

        if (v) {
            this.viewer.screenSpaceEventHandler.setInputAction(this.onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        } else {

            this.restoreHighlight();

            this.nameOverlay.style.display = 'none';
            this.viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    },
    setMouseClick: function(v) {

        if (v) {
            this.orginClickHandler = this.viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            this.viewer.screenSpaceEventHandler.setInputAction(this.onLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        } else {

            //设置为原来的
            this.viewer.screenSpaceEventHandler.setInputAction(this.orginClickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
    },
    install: function(viewer) {


        var nameOverlay = document.createElement('div');
        viewer.container.appendChild(nameOverlay);
        nameOverlay.className = 'backdrop';
        nameOverlay.style.display = 'none';
        nameOverlay.style.position = 'absolute';
        nameOverlay.style.bottom = '0';
        nameOverlay.style.left = '0';
        nameOverlay.style['pointer-events'] = 'none';
        nameOverlay.style.padding = '4px';
        nameOverlay.style.backgroundColor = 'black';
        nameOverlay.style.color = "red";
        this.nameOverlay = nameOverlay;

        var selected = {
            feature: undefined,
            originalColor: new Cesium.Color()
        };


        var highlighted = {
            feature: undefined,
            originalColor: new Cesium.Color()
        };


        selectedEntity = new Cesium.Entity();

        this.viewer = viewer;

        var leftDown = false;
        var middleDown = false;

        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
            leftDown = true;
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
            leftDown = false;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
            middleDown = true;
        }, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);

        viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
            middleDown = false;
        }, Cesium.ScreenSpaceEventType.MIDDLE_UP);

        this.restoreHighlight = function() {
            // If a feature was previously highlighted, undo the highlight
            if (Cesium.defined(highlighted.feature)) {

                try {
                    highlighted.feature.color = highlighted.originalColor;

                } catch (ex) {

                }
                highlighted.feature = undefined;
            }
        }

        this.onMouseMove = function(movement) {
            self.restoreHighlight();

            if (middleDown || leftDown) {
                nameOverlay.style.display = 'none';
                return;
            }

            // Pick a new feature
            var pickedFeature = viewer.scene.pick(movement.endPosition);
            if (!Cesium.defined(pickedFeature)) {
                nameOverlay.style.display = 'none';
                return;
            }

            if (!Cesium.defined(pickedFeature.getProperty)) {
                nameOverlay.style.display = 'none';
                return;
            }
            // A feature was picked, so show it's overlay content

            var name = pickedFeature.getProperty('name');
            if (!Cesium.defined(name)) {
                name = pickedFeature.getProperty('id');
            }
            if (!Cesium.defined(name)) {
                name = pickedFeature.getProperty('ID');
            }
            if (name == '') {
                nameOverlay.style.display = 'none';
                return;
            }

            nameOverlay.style.display = 'block';
            nameOverlay.style.bottom = viewer.canvas.clientHeight - movement.endPosition.y + 'px';
            nameOverlay.style.left = movement.endPosition.x + 'px';

            nameOverlay.textContent = name;

            // Highlight the feature if it's not already selected.
            if (pickedFeature !== selected.feature) {
                highlighted.feature = pickedFeature;
                Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
                pickedFeature.color = self.colorHighlight;
            }
        };

        var self = this;
        this.onLeftClick = function(movement) {
            // If a feature was previously selected, undo the highlight

            //alert('点击事件触发');
            if (Cesium.defined(selected.feature)) {

                try {
                    selected.feature.color = selected.originalColor;

                } catch (ex) {

                }
                selected.feature = undefined;
            }

            // Pick a new feature
            var pickedFeature = viewer.scene.pick(movement.position);
            if (!Cesium.defined(pickedFeature)) {
                self.orginClickHandler(movement);
                return;
            }

            // Select the feature if it's not already selected
            if (selected.feature === pickedFeature) {
                return;
            }

            if (!Cesium.defined(pickedFeature.getProperty))
                return;

            selected.feature = pickedFeature;

            // Save the selected feature's original color
            if (pickedFeature === highlighted.feature) {
                Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
                highlighted.feature = undefined;
            } else {
                Cesium.Color.clone(pickedFeature.color, selected.originalColor);
            }

            // Highlight newly selected feature
            pickedFeature.color = self.colorSelected;
            
            //点击事件获取数据库数据
            var aaa = String(pickedFeature._content._batchTable._properties.name);
            if(aaa === '电报大厦'){
            	$('.cesium-infoBox')[0].style.display= 'block';
            	$('#savebtn').text('电报大厦');
            	//$('.cancel-btn').remove();
            	window.frames['innerhtml'].contentWindow.dele();
            	$('#cesium-infoBox').height('152px');
            	var fathertable = $('<table></table>');
            	fathertable.attr('class','cesium-infoBox-defaultTable');
            	fathertable.css('height','100px');
                //fathertable.addclass('cesium-infoBox-defaultTable');
                var sontbody = $('<tbody></tbody>');
                
                fathertable.append(sontbody);
                $('body',window.frames['innerhtml'].contentDocument).append(fathertable);
                
            	
            	

                //var names = pickedFeature._content.batchTable.getPropertyNames(pickedFeature._batchId);
                var featureId = 10000006290201;
                debugger
                var url=__ctx + "/portal/D_PanelManagement/getByPanel.ht?id=" + featureId ;
                //获取后台数据
                $.ajax({
                    url: url,
                    type: "post",
                    dataType: "json",
                    success: function(data){
                        debugger
                        
                        var arrayName=['名称','所属网格','地址','楼高'];
                        var arrayData=[data.name,data.orgname,data.address,data.height];
                        
                        for(var i=0;i<4;i++){
                        	var sontr =$('<tr></tr>');
                            var sonth =$('<th></th>');
                            var sontd =$('<td></td>');
                        	sontbody.append(sontr);
                        	sontr.append(sonth);
                        	sontr.append(sontd);
                        	$('tbody',window.frames['innerhtml'].contentDocument).find('tr').eq(i).find('th').text(arrayName[i]);
                        	$('tbody',window.frames['innerhtml'].contentDocument).find('tr').eq(i).find('td').text(arrayData[i]);
                        } 
                    },
                    error: function(msg){
                        alert("ajax连接异常");
                    }
                });
            	
            }
            

            // Set feature infobox description


//            var featureName = pickedFeature.getProperty('name');
//            selectedEntity.name = featureName;
//            selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
//            viewer.selectedEntity = selectedEntity;
//
//            var names = pickedFeature._content.batchTable.getPropertyNames(pickedFeature._batchId);
//            var featureId = 10000006290201;
//            var url=__ctx + "/portal/D_PanelManagement/getByPanel.ht?id=" + featureId ;
            //获取后台数据
            /*$.ajax({
                url: url,
                type: "post",
                //headers: {
                //    "Access-Control-Allow-Origin":"*",
                //    "ccess-Control-Allow-Methods": "POST,GET,OPTIONS,DELETE",
                //    "Access-Control-Allow-Headers":"X-Requested-With"
                //},
                dataType: "json",
                //jsonCallback:"jsonHandler",
                success: function(data){
                    debugger
                    //data[0].
                    var featureName = pickedFeature.getProperty('name');
                    selectedEntity.name = featureName;
                    selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
                    viewer.selectedEntity = selectedEntity;
                    selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
                        '<tr><th>名称</th><td>' + data.name + '</td></tr>' +
                        '<tr><th>所属网格</th><td>' + data.orgname+ '</td></tr>' +
                        '<tr><th>地址</th><td>' +data.address + '</td></tr>'  +
                        '<tr><th>楼高</th><td>' +data.height + '层'+ '</td></tr>'  +
                        '</tbody></table>';
                },
                error: function(msg){
                    alert("ajax连接异常");
                }
            });*/

            /*属性
             // 普通3dtiles 获取属性表格
             var html = getBimHtml(pickedFeature);

             if (!html) {
             html = '<table class="cesium-infoBox-defaultTable"><tbody>';

             for (var i = 0; i < names.length; i++) {
             var n = names[i];
             html += '<tr><th>' + n + '</th><td>' + pickedFeature.getProperty(n) + '</td></tr>'
             }
             html += '</tbody></table>';
             }



             selectedEntity.description = html;
             */
        }

        this.setMouseOver(true);
        this.setMouseClick(true);
    }


};


featureViewer.install(viewer);
Sandcastle.addToggleButton('show classification', false, function(checked) {
   if(checked){
       tileset11.show = true;
       tileset12.show = false;
   }else{
       tileset11.show = false;
       tileset12.show = true;
   }

});
function transpatenBuilding(){
    var transpatent = 0;

    if(transpatent == 0){
        viewer.imageryLayers.removeAll()
        var one_map = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
            url : 'world.jpg',
            rectangle : Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0)
        }));
        viewer.imageryLayers.addImageryProvider(one_map);
        tileset.style = new Cesium.Cesium3DTileStyle({
            color: 'rgba(46, 255, 238, 0.5)'
        });
        transpatent = 0;
    }else{


    }}

var datajson={}

$('.cesium-infoBox-title').click(function(){
    
    	if(window.frames['innerhtml'].contentWindow.geoval !== undefined && window.frames['innerhtml'].contentWindow.feaval !==undefined){
            $('.cesium-infoBox')[0].style.display= 'none';
            datajson.geometrytype = window.frames['innerhtml'].contentWindow.geoval;
            datajson.featuretype = window.frames['innerhtml'].contentWindow.feaval;
            datajson.x=longitudeString.toFixed(10);
            datajson.y=latitudeString.toFixed(10);
            datajson.discription=$('textarea',window.frames['innerhtml'].contentDocument).text();
            //alert('保存成功')
//            /Comp/Stereoscopic_Point/list.ht
            $.ajax({
                url: __ctx+"/Comp/Stereoscopic_Point/save.ht",
                type: "post",
                data: datajson,
                dataType: "json",
                success: function(json){
                    alert("成功");
                    
                },
                error: function(msg){
                    alert("ajax连接异常");
                }
            });
        }else{
            alert( '请完善表单信息!')
        }
	
});

function closeInfoBox(){
	$('.cesium-infoBox')[0].style.display= 'none';
}

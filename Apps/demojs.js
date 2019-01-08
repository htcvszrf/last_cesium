/**
 * Created by Mr_Chai on 2018/11/21.
 */
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
        nameOverlay.style.color = "white";
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

            // Set feature infobox description


            var featureName = pickedFeature.getProperty('name');
            selectedEntity.name = featureName;
            selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
            viewer.selectedEntity = selectedEntity;

            var names = pickedFeature._content.batchTable.getPropertyNames(pickedFeature._batchId);


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
        }

        this.setMouseOver(true);
        this.setMouseClick(true);
    }


};
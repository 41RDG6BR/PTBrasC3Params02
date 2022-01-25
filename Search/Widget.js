define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/text!./Widget.html",
  "esri/dijit/Search",
  'dojo/Deferred',
  'dgrid/OnDemandList',
  'dgrid/Selection',
  "dojo/store/Memory",
  "esri/layers/FeatureLayer", 
  "dojo/on", 
  "dojo/_base/lang",
  "jimu/Utils",
  'dojo/_base/html',
  "esri/Color",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/graphic", 
], function(
  declare,
  _WidgetBase,
  _TemplatedMixin,
  template,
  Search,
  Deferred,
  OnDemandList, 
  Selection, 
  Memory,
  FeatureLayer,
  on,
  lang,
  utils,
  html,
  Color,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  Graphic
){
  return declare([_WidgetBase, _TemplatedMixin], {
    templateString: template,

    // params
    // required
    wabWidget: null,
    serviceUrl: null,
    codFieldInst: null,
    codFieldSeq: null,
    outFields: [],
    map: null,
    searchSources: null,

    startup: function() {
      this.inherited(arguments)
      this.wabWidget = this.params.wabWidget
      this.searchDijit = new Search({
        enableButtonMode: false, 
        showInfoWindowOnSelect: false,
        theme: 'arcgisSearch',
        sources: []
      });
      html.place(this.searchDijit.domNode, this.searchNode);
      this.searchDijit.startup();

      var sources = this.searchDijit.get("sources");

      sources.push({
        featureLayer: new FeatureLayer(this.serviceUrl),
        searchFields: [this.codFieldInst],
        displayField: this.codFieldInst,
        exactMatch: false,
        outFields: [this.outFields],
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 1,
      });

      sources.push({
        featureLayer: new FeatureLayer(this.serviceUrl),
        searchFields: [this.codFieldSeq],
        displayField: this.codFieldSeq,
        exactMatch: false,
        outFields: [this.outFields],
        maxResults: 6,
        maxSuggestions: 6,
        enableSuggestions: true,
        minCharacters: 1,
      });

      this.searchDijit.set("sources", sources);

      this.own(
        on(this.searchDijit, 'search-results', lang.hitch(this, function(e) {
          this._getDataStore(e)
        }))
      );

    },
    
    _onSelectResult: function(e) {
      var result = e;
      var dataSourceIndex = e.activeSourceIndex;
      var sourceResults = this.searchResults[dataSourceIndex];
      var dataIndex = 0;
      var resultFeature = e.results[0];
      var sourceLayerId = e.source._featureLayerId;

      console.log(dataSourceIndex)
      console.log(result)
    },

    _getDataStore: function(e) {
      var featureSetRemapped = [];
      var def = new Deferred();
      var features = e.results[0][0].feature

      var featureSet = utils.toFeatureSet(features)
      
      utils.zoomToFeatureSet(this.map, featureSet)
      .then(
        lang.hitch(this, function () {
          this._addGeometryToMapGraphics(featureSet)
        })
      );

        def.resolve(new Memory({
          data: featureSetRemapped
        })
      );
      return def;
    },
    
    _addGeometryToMapGraphics: function (geometry) {
      var geometry = geometry.features[0].geometry
      var lineSymbol = new SimpleLineSymbol();
      lineSymbol.setWidth(3);
      lineSymbol.setColor(new Color("#ffeb3b"));

      var graphic = new Graphic(geometry, lineSymbol);
      this.map.graphics.add(graphic);
      this._graphics[graphicType] = graphic;
    },
  })
})
define([
  'dojo/_base/declare', 
  'jimu/BaseWidget',
  "esri/dijit/Search",
  'dojo/Deferred',
  'dgrid/OnDemandList',
  'dgrid/Selection',
  "dojo/store/Memory",
  "dojo/on", 
  "dojo/_base/lang",
  "esri/layers/FeatureLayer",
  "jimu/Utils",
  "jimu/dijit/TabContainer3",
  "dijit/layout/ContentPane",
  "dojo/_base/array",
  "esri/Color",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/graphic", 
  "esri/geometry/Point",
  'jimu/LayerInfos/LayerInfos',
  "./Search/Widget",
],
function(
  declare, 
  BaseWidget,
  Search,
  Deferred,
  OnDemandList,
  Selection,
  Memory,
  on,
  lang,
  FeatureLayer,
  utils,
  TabContainer3,
  ContentPane,
  array,
  Color,
  SimpleMarkerSymbol, 
  SimpleLineSymbol, 
  SimpleFillSymbol,
  Graphic,
  Point,
  LayerInfos,
  Search,
) {
  return declare([BaseWidget], {

    baseClass: 'p-t-bras',

    postCreate: function() {
      this.inherited(arguments);
      this._initTabs()
    },
    
    _initTabs: function() {
      var tabs = [];

      this.aeo = new Search({
        wabWidget: this,
        map: this.map,
        serviceUrl: this.config.aeo.serviceUrl,
        codFieldInst: this.config.aeo.codFieldInst,
        codFieldSeq: this.config.aeo.codFieldSeq,   
        searchResults: this.config.aeo.sources[0]
      })
      // console.log(this.aeo.wabWidget, 'wabaeo')
      // console.log(this.aeo.params, 'params')
      tabs.push({
        title: this.nls.configTitles[0],
        content: this.aeo
      })

      this.prop = new Search({
        wabWidget: this,
        map: this.map,
        serviceUrl: this.config.propriedades.serviceUrl,
        codFieldInst: this.config.propriedades.codFieldSeq,
        codFieldSeq: this.config.propriedades.codFieldDen,  
      })
      tabs.push({
        title: this.nls.configTitles[1],
        content: this.prop
      })

      this.pocos = new Search({
        wabWidget: this,
        map: this.map,
        serviceUrl: this.config.pocos.serviceUrl,
        codFieldInst: this.config.pocos.codFieldNameCamp,
        codFieldSeq: this.config.pocos.codFieldNamePoco,  
        outFields: this.config.pocos.outFields
      })
      tabs.push({
        title: this.nls.configTitles[2],
        content: this.pocos
      })

      this._tcConfig = new TabContainer3({        
        tabs: tabs,
        style: 'width:100%; height:100%;'
      }, this.tabContainer)

    },

  });

});

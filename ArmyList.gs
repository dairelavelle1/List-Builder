var ArmyList = Object.create (null, {
  build: {
    value: function(sourceSheet, army) {
      this._armyName=army;
      this._source = sourceSheet;
      this._roster = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Roster");
      this._values = this._source.getDataRange().getValues();
      this._layout=[];
      var range=this._source.getDataRange();
      var backgrounds=range.getBackgrounds();
      var rangeValues=range.getValues();
      for(var i=0;i<rangeValues[0].length; i++) {
        for(var j=0;j<rangeValues[i].length; j++) {
          if (backgrounds[i][j]=="#fff2cc" & rangeValues[i][j]!="") {
            this._layout.push(rangeValues[i][j]);
          }
        }
      }
      var i=0;
      this._army="";
      this._units=[]
      while(this._army=="" & i<this._source.getMaxRows()) {
        if (this._values[i][0]==this._armyName) {
          this._army=this._values[i][1];
        }
        i++;
      }
      var start=0;
      var end=0
      var armyRange;
      var armyValues=[[]];
      for (var i=0; i<this._values.length; i++) {
        if (this._values[i][0] == this._army & start == 0) {
          start=i+1;
        }
        if (this._values[i][0] == this._army & start != 0) {
          end=i+1;
        }
      }
      if (SpreadsheetApp.getActiveSpreadsheet().getRangeByName("armyRange")!=null) {
        SpreadsheetApp.getActiveSpreadsheet().removeNamedRange("armyRange");
      }
      armyRange=this._source.getRange(start,2,end-start,this._source.getMaxColumns());
      armyValues=armyRange.getValues();
      for (var i=0; i<armyValues.length; i++) {
        if (armyValues[i][0]=="UNIT") {
          this._units.push(new Unit(armyValues, armyValues[i][1], this._layout));
        }
      }
      SpreadsheetApp.getActiveSpreadsheet().setNamedRange("armyRange", armyRange);
      return this;
    }
  },
  units: {
    get: function() {
      return this._units;
    }
  },
  unitField: {
    value: function(attribute) {
      var output=[];
      for (var i=0; i<this._units.length; i++) {
        output.push(this._units[i]._attributes[attribute]);
      }
      return output;
    }
  },
  armyName: {
    get: function() {
      return this._armyName;
    }
  },
  layout: {
    get: function() {
      return this._layout;
    }
  },
  game: {
    get: function() {
      return this._source;
    }
  }
})
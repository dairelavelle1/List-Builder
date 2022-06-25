var Unit = class Unit {

  constructor(armyValues, unitName, fields) {
    this._attributes={};
    this._equipment=[];
    this._attributes[fields[1]]=unitName;
    var container=[];
    for (var i=2; i<fields.length; i++) {
      for (var j=0; j<armyValues.length; j++) {
        if (armyValues[j][0]==fields[i] & armyValues[j][1]==unitName) {
          container.push(armyValues[j][2]);
        }
      }
      if (container.length==1) {
        this._attributes[fields[i]]=container[0];
      } else {
        this._attributes[fields[i]]=container;
      }
      container=[];
    }
    for (var i=0; i<this._attributes["EQUIPMENT"].length; i++) {
      for (var j=0; j<this._attributes["SIZE"]; j++) {
        this._equipment.push(this._attributes["EQUIPMENT"][i])
      }
    }
  }
}
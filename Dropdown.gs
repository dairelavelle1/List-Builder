var ss = SpreadsheetApp.getActiveSpreadsheet();
var mainSheet = ss.getSheetByName("Editor");
var games = [];
var roster;


function clickButton() {
  roster = ss.insertSheet("Roster");
  armyList = Object.create(ArmyList).build(ss.getSheetByName(mainSheet.getRange("B1").getValue()), mainSheet.getRange("D1").getValue());
  ss.setActiveSheet(roster);
  roster.getRange("A1").setValue(armyList.armyName);
  roster.appendRow(armyList.layout);
  listItem(roster, armyList.unitField("NAME"), ss.getActiveSheet().getLastRow()+1);
}

function unitButtonTest() {
  armyList1 = Object.create(ArmyList).build(ss.getSheetByName(mainSheet.getRange("B1").getValue()), mainSheet.getRange("D1").getValue());
  row=[];
  for(var i=0; i<armyList1.layout.length; i++) {
    row.push(armyList1.units[0]._attributes[armyList1.layout[i]]);
  }
  ss.getActiveSheet().appendRow(row);
}

function listItem(sheet, options, row) {
  range=sheet.getRange(row,1);
  rule=SpreadsheetApp.newDataValidation().requireValueInList(options).build();
  range.setValue("+");
  range.setDataValidation(rule);
}

function addCosts(costColumn) {
  costColumnValues=costColumn.getValues();
  start=false;
  sum=0;
  for (var i=0; i<costColumnValues.length; i++) {
    if (start) {
      sum+=costColumnValues[i][0];
    }
    if (costColumnValues[i].indexOf("COST")+1) {
      start=true;
    }
  }
  return sum;
}

function onOpen(e) {
  SpreadsheetApp.getUi().createMenu("Reset").addItem("initialise", "editorInit").addToUi();

}

function onEdit(e) {

  var range = e.range;
  var spreadSheet = e.source;
  var sheetName = spreadSheet.getActiveSheet().getName();
  var column = range.getColumn();
  var row = range.getRow();
  var cellValue = e.value;
  var returnValues = [];

  if (sheetName == 'Editor' && column == 2 && row == 1) {
    mainSheet.getRange("C1:Z1").clearContent();
    mainSheet.getRange("C1:Z1").setDataValidation(null);

    mainSheet.getRange("C1").setValue("Army:");
    returnValues = gameInit(ss.getSheetByName(cellValue));
    
    var armiesDropdown = SpreadsheetApp.getActive().getRange('D1');
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(returnValues).build();
    armiesDropdown.setDataValidation(rule);
  }

  if (sheetName == 'Roster' && column ==1) {
    armyListOnEdit = Object.create(ArmyList).build(ss.getSheetByName(mainSheet.getRange("B1").getValue()), mainSheet.getRange("D1").getValue());
    layout=armyListOnEdit.layout;
    rowUnit=new Unit(SpreadsheetApp.getActiveSpreadsheet().getRangeByName("armyRange").getValues(), cellValue, layout);
    range.clearContent();
    range.setDataValidation(null);
    rowContents=[];
    for(var i=0; i<layout.length; i++) {
      if (Array.isArray(rowUnit._attributes[layout[i]])) {
        listAttributes="";
        for(var j=0; j<rowUnit._attributes[layout[i]].length; j++) {
          listAttributes+=rowUnit._attributes[layout[i]][j];
          if (j!=rowUnit._attributes[layout[i]].length-1) {
            listAttributes+="\n";
          }
        }
        rowContents.push(listAttributes);
      } else {
        rowContents.push(rowUnit._attributes[layout[i]]);
      }
    }
    ss.getActiveSheet().getRange(row,1,1,armyListOnEdit.layout.length).setValues([rowContents]);
    listItem(ss.getActiveSheet(), armyListOnEdit.unitField("NAME"), row+1);
    ss.getActiveSheet().getRange(row+1,armyListOnEdit.layout.length,1,1).setValue(addCosts(ss.getActiveSheet().getRange(1, layout.length, row)));
  }
}

// clears the first row and creates a dropdown menu of all the games
function editorInit() {
  armyList = null;
  mainSheet = ss.getActiveSheet();
  var gamesSheets = ss.getSheets();
  mainSheet.getRange("B1:Z1").clearContent();
  mainSheet.getRange("B1:Z1").setDataValidation(null);
  games = [];
  for (i = 0; i < gamesSheets.length; i++) {
    if (gamesSheets[i].getName() != "Editor" && gamesSheets[i].getName() != "Roster") {
      games.push(gamesSheets[i].getName());
    }
  }
  if (ss.getSheetByName("Roster")!=null) {
    ss.deleteSheet(ss.getSheetByName("Roster"));
  }

  var gamesDropdown = ss.getActiveSheet().getRange('B1');
  var gamesList = SpreadsheetApp.newDataValidation().requireValueInList(games).build();
  gamesDropdown.setDataValidation(gamesList);
}


function gameInit(game) {
  var gameRange = game.getDataRange();
  var backgrounds = gameRange.getBackgrounds();
  var gameValues = gameRange.getValues();
  var armies = [];
  for (var i in backgrounds) {
    if (backgrounds[i][0] == "#d9ead3") {
      armies.push(gameValues[i][0]);
    }
  }
  return armies;
}
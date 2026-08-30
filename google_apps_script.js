/**
 * COMPONENTS STOCK MANAGEMENT - GOOGLE APPS SCRIPT BACKEND
 * 
 * INSTRUCTIONS FOR GOOGLE SHEETS:
 * 1. Open your Google Sheet (https://docs.google.com/spreadsheets/d/1F1p3C_SsCSBVne1soX-cJzfdO4M7jVIA/edit)
 * 2. Click "Extensions" -> "Apps Script" from the top menu.
 * 3. Delete any existing code in Code.gs and paste THIS COMPLETE CODE.
 * 4. Click "Deploy" -> "New deployment" at the top right.
 * 5. Select type: "Web app".
 * 6. Set "Execute as": "Me"
 * 7. Set "Who has access": "Anyone"
 * 8. Click "Deploy", authorize permissions, and copy the Web App URL!
 * 9. Paste the copied Web App URL in your Components Stock Management Web Dashboard!
 */

function getTargetSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets()[0];
}

function doGet(e) {
  try {
    const sheet = getTargetSheet();
    const data = sheet.getDataRange().getValues();

    // Handle action passed via GET query parameters for bulletproof CORS-free execution
    if (e && e.parameter && e.parameter.action) {
      const action = e.parameter.action;
      let result = { status: "success", action: action };

      if (action === "UPDATE_QTY") {
        const updated = updateItemQuantity(sheet, data, e.parameter.name, e.parameter.qty, e.parameter.box, e.parameter.category);
        result.updated = updated;
      } else if (action === "ADD_ITEM") {
        const added = addItemToSheet(sheet, data, e.parameter.name, e.parameter.category, e.parameter.box, e.parameter.qty);
        result.added = added;
      } else if (action === "EDIT_ITEM") {
        const edited = editItemInSheet(sheet, data, e.parameter.oldName || e.parameter.name, e.parameter.name, e.parameter.category, e.parameter.box, e.parameter.qty);
        result.edited = edited;
      } else if (action === "DELETE_ITEM") {
        const deleted = deleteItemFromSheet(sheet, data, e.parameter.name);
        result.deleted = deleted;
      }

      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Default GET: Return parsed items JSON
    const items = parseSheetData(data);
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: items.length,
      items: items
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (errJson) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const action = payload.action || "UPDATE_QTY";
    const sheet = getTargetSheet();
    const data = sheet.getDataRange().getValues();
    let result = { status: "success", action: action };

    if (action === "UPDATE_QTY") {
      const updated = updateItemQuantity(sheet, data, payload.name, payload.qty, payload.box, payload.category);
      result.updated = updated;
    } else if (action === "ADD_ITEM") {
      const added = addItemToSheet(sheet, data, payload.name, payload.category, payload.box, payload.qty);
      result.added = added;
    } else if (action === "EDIT_ITEM") {
      const edited = editItemInSheet(sheet, data, payload.oldName || payload.name, payload.name, payload.category, payload.box, payload.qty);
      result.edited = edited;
    } else if (action === "DELETE_ITEM") {
      const deleted = deleteItemFromSheet(sheet, data, payload.name);
      result.deleted = deleted;
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Parse sheet cells into structured item array (handles both single-column & multi-column layouts)
function parseSheetData(data) {
  const items = [];
  let counter = 1;
  const colSets = [
    { boxCol: 0, catCol: 1, nameCol: 2, qtyCol: 3, currentBox: "", currentCat: "" },
    { boxCol: 5, catCol: 6, nameCol: 7, qtyCol: 8, currentBox: "", currentCat: "" },
    { boxCol: 10, catCol: 11, nameCol: 12, qtyCol: 13, currentBox: "", currentCat: "" }
  ];

  for (let r = 0; r < data.length; r++) {
    const row = data[r];
    if (!row || row.length === 0) continue;

    for (const set of colSets) {
      if (set.boxCol >= row.length) continue;

      const rawBox = String(row[set.boxCol] || "").trim();
      const rawCat = String(row[set.catCol] || "").trim();
      const rawName = String(row[set.nameCol] || "").trim();
      const rawQty = String(row[set.qtyCol] || "").trim();

      if (rawBox && rawBox.toLowerCase().startsWith("box")) {
        set.currentBox = rawBox;
      } else if (rawBox && !set.currentBox) {
        set.currentBox = rawBox;
      }

      if (rawCat && !rawCat.toLowerCase().includes("category")) {
        set.currentCat = rawCat;
      }

      if (rawName && !isHeader(rawName)) {
        const qtyNum = parseInt(rawQty, 10);
        const finalQty = isNaN(qtyNum) ? 0 : Math.max(0, qtyNum);

        items.push({
          id: "item_" + (counter++),
          name: rawName,
          category: rawCat || set.currentCat || "General",
          box: set.currentBox || "General Box",
          qty: finalQty
        });
      }
    }
  }
  return items;
}

function isHeader(text) {
  const lower = String(text).toLowerCase();
  return lower.includes("component name") || lower.includes("kl ;lkjhgf") || lower.includes("quantity");
}

// Find item row and update stock quantity
function updateItemQuantity(sheet, data, targetName, newQty, boxName, catName) {
  if (!targetName) return false;
  const targetLower = String(targetName).trim().toLowerCase();
  const colSets = [
    { nameCol: 2, qtyCol: 3 },
    { nameCol: 7, qtyCol: 8 },
    { nameCol: 12, qtyCol: 13 }
  ];

  for (let r = 0; r < data.length; r++) {
    const row = data[r];
    for (const set of colSets) {
      if (set.nameCol < row.length) {
        const nameInCell = String(row[set.nameCol] || "").trim();
        if (nameInCell.toLowerCase() === targetLower) {
          // Update quantity cell (1-indexed for Sheet range)
          sheet.getRange(r + 1, set.qtyCol + 1).setValue(newQty);
          return true;
        }
      }
    }
  }

  // If item not found in sheet, add it as a new entry
  addItemToSheet(sheet, data, targetName, catName || "General", boxName || "BOX_A1", newQty);
  return true;
}

// Append new item to the sheet
function addItemToSheet(sheet, data, name, category, box, qty) {
  if (!name) return false;

  // Append new row at the bottom [Box, Category, Component Name, Quantity]
  sheet.appendRow([box || "BOX_NEW", category || "General", name, qty || 0]);
  return true;
}

// Edit existing item in sheet
function editItemInSheet(sheet, data, oldName, newName, category, box, qty) {
  const targetLower = String(oldName || newName).trim().toLowerCase();
  const colSets = [
    { boxCol: 0, catCol: 1, nameCol: 2, qtyCol: 3 },
    { boxCol: 5, catCol: 6, nameCol: 7, qtyCol: 8 },
    { boxCol: 10, catCol: 11, nameCol: 12, qtyCol: 13 }
  ];

  for (let r = 0; r < data.length; r++) {
    const row = data[r];
    for (const set of colSets) {
      if (set.nameCol < row.length) {
        const nameInCell = String(row[set.nameCol] || "").trim();
        if (nameInCell.toLowerCase() === targetLower) {
          if (newName) sheet.getRange(r + 1, set.nameCol + 1).setValue(newName);
          if (category) sheet.getRange(r + 1, set.catCol + 1).setValue(category);
          if (box) sheet.getRange(r + 1, set.boxCol + 1).setValue(box);
          if (qty !== undefined && qty !== null) sheet.getRange(r + 1, set.qtyCol + 1).setValue(qty);
          return true;
        }
      }
    }
  }

  // If not found, add it
  addItemToSheet(sheet, data, newName || oldName, category, box, qty);
  return true;
}

// Delete item by clearing cells
function deleteItemFromSheet(sheet, data, targetName) {
  if (!targetName) return false;
  const targetLower = String(targetName).trim().toLowerCase();
  const colSets = [
    { nameCol: 2, qtyCol: 3 },
    { nameCol: 7, qtyCol: 8 },
    { nameCol: 12, qtyCol: 13 }
  ];

  for (let r = 0; r < data.length; r++) {
    const row = data[r];
    for (const set of colSets) {
      if (set.nameCol < row.length) {
        const nameInCell = String(row[set.nameCol] || "").trim();
        if (nameInCell.toLowerCase() === targetLower) {
          sheet.getRange(r + 1, set.nameCol + 1).setValue("");
          sheet.getRange(r + 1, set.qtyCol + 1).setValue("");
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * OPTIONAL: 1-CLICK POPULATE INITIAL DATASET (167 Components)
 * Run this function inside Google Apps Script editor to instantly populate your new blank sheet!
 */
function populateInitialData() {
  const sheet = getTargetSheet();
  sheet.clear(); // Clear existing content
  
  // Set header row
  sheet.appendRow(["Storage Box", "Category", "Component Name", "Quantity"]);
  
  // Format header row (Bold blue background)
  const headerRange = sheet.getRange(1, 1, 1, 4);
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#00f2fe");
  headerRange.setFontColor("#000000");

  const initialItems = [
    ["BOX_A-57 (Lira) ESP", "IC Base", "8 Pin IC Base", 24],
    ["BOX_A-57 (Lira) ESP", "IC Base", "40 Pin IC Base", 165],
    ["BOX_A-57 (Lira) ESP", "ESP", "ESP32", 2],
    ["BOX_A-57 (Lira) ESP", "ESP", "ESP8266", 2],
    ["BOX_A-57 (Lira) ESP", "Microcontroller", "STM32 (blue pill)", 1],
    ["BOX_A2", "Connector", "U-Lugs (Copper cable) Red", 26],
    ["BOX_A2", "Connector", "U-Lugs (Copper cable) Yellow", 25],
    ["BOX_A2", "Connector", "U-Lugs (Copper cable) Blue", 60],
    ["BOX_A2", "Connector", "U-Lugs (Copper cable) Black", 16],
    ["BOX_A2", "Clip", "Battery Clip (Red)", 70],
    ["BOX_A2", "Clip", "Battery Clip (Blue)", 70],
    ["BOX_A2", "Cooling", "Heatsink", 5],
    ["BOX_A-58 (Lira) Switch", "Switch", "Toggle Switch", 2],
    ["BOX_A-58 (Lira) Switch", "Switch", "Push Switch", 2],
    ["BOX_A-58 (Lira) Switch", "Switch", "AC Switch", 2],
    ["BOX_A-58 (Lira) Switch", "Connector", "Male Female 5 Pin Connector", 1],
    ["BOX_A-59 (Lira) SS Screw", "Screw", "SS Screw 3mm", 2],
    ["BOX_A-59 (Lira) SS Screw", "Screw", "SS Screw 4mm", 2],
    ["BOX_A3", "Diode", "4 bridge diode (round type)", 5],
    ["BOX_A3", "Diode", "4 bridge diode (square vertical type)", 2],
    ["BOX_A3", "Inductor", "46uH (Inductor)", 10],
    ["BOX_A3", "Diode", "UF4007 diode", 110],
    ["BOX_A3", "Diode", "Zener diode (5V)", 300],
    ["BOX_A3", "Diode", "1N4744 Zener diode (15V)", 10],
    ["BOX_A3", "Diode", "Zener diode (12V)", 8],
    ["BOX_A-60 (Lira) SS Screw", "Connector", "RJ45 Connector", 4],
    ["BOX_A-60 (Lira) SS Screw", "Connector", "Type C Cannector", 10],
    ["BOX_A-60 (Lira) SS Screw", "Connector", "USB Typ C Male", 3],
    ["BOX_A-60 (Lira) SS Screw", "Connector", "USB Male Female", 5],
    ["BOX_A6", "Socket", "3Pin AC Socket", 3],
    ["BOX_A6", "Connector", "BNC Connector (Male + Female)", 4],
    ["BOX_A6", "Fuse", "Fuse 10A", 5],
    ["BOX_A6", "Fuse", "Fuse 1A", 25],
    ["BOX_A-61 (RFL) MODULE", "Module", "3.3v Level converter", 4],
    ["BOX_A-61 (RFL) MODULE", "Module", "LM358 Module", 10],
    ["BOX_A-61 (RFL) MODULE", "Module", "555 Function Generator Mod", 5],
    ["BOX_A-61 (RFL) MODULE", "Module", "555 Hi cut module battery", 1],
    ["BOX_A-61 (RFL) MODULE", "Sensor", "mini pir motion sensor", 1],
    ["BOX_A7", "Fuse Holder", "Fuse Holder (Mini)", 6],
    ["BOX_A7", "Fuse Holder", "Fuse Holder (Long)", 1],
    ["BOX_A7", "Switch", "AC Indicator Type Switch (SPDT)", 7],
    ["BOX_A7", "Fuse", "Mini Fuse 2A Remote Fan", 7],
    ["BOX_A-62 (Lira) Components", "IC", "Winbond 25Q32FVSIG SPI Flash Memory", 3],
    ["BOX_A-62 (Lira) Components", "Sensor", "10K NTC Metal square type", 10],
    ["BOX_A-62 (Lira) Components", "Module", "Load cell CKT HX711", 5],
    ["BOX_A-62 (Lira) Components", "LED", "led ws2812b", 2],
    ["BOX_A-62 (Lira) Components", "Programmer", "PIC Kit 2 ( USB )", 2],
    ["BOX_A-62 (Lira) Components", "Fuse", "PTC Fuse (XF075, 8A)", 5],
    ["BOX_A-62 (Lira) Components", "Fuse", "PTC Fuse (425, 1.5A)", 5],
    ["BOX_A-62 (Lira) Components", "Inductor", "PIC Kit 2 ( inductor 820uh )", 10],
    ["BOX_A-62 (Lira) Components", "Optocoupler", "TLP250", 1],
    ["BOX_A-62 (Lira) Components", "IC", "HX711", 2],
    ["BOX_A-62 (Lira) Components", "IC", "DK124", 10],
    ["BOX-A8", "Buzzer", "12V Buzzer", 2],
    ["BOX-A8", "IC Regulator", "LM2576", 21],
    ["BOX-A8", "Resistor Variable", "Potentiometer (1K)", 2],
    ["BOX-A8", "Resistor Variable", "Potentiometer (10K)", 8],
    ["BOX-A8", "Resistor Variable", "Potentiometer (100K)", 4],
    ["BOX_A9", "Board", "Veroboard", 7],
    ["BOX_A9", "Hardware", "Volume Knob", 30],
    ["BOX_A10", "MOSFET", "IRFP250N", 3],
    ["BOX_A10", "IGBT", "FGH40N60", 5],
    ["BOX_A10", "MOSFET", "IRFP254N", 1],
    ["BOX_A10", "SCR", "tyn612m SCR", 3],
    ["BOX_A10", "MOSFET", "irf451", 4],
    ["BOX_A10", "MOSFET", "IRFP260N", 5],
    ["BOX_A10", "Transistor", "TIP107", 5],
    ["BOX_A10", "Transistor", "TIP122", 8],
    ["BOX_A10", "MOSFET", "MOSFET Z44", 2],
    ["BOX_A10", "MOSFET", "F9Z34N", 5],
    ["BOX_A10", "Triac", "TRIAC/ BTA41", 2],
    ["BOX_A10", "IGBT", "IGBT MBQ60T65PES", 9],
    ["BOX_A10", "MOSFET", "IRF3205", 2],
    ["BOX_A11", "Sensor", "18b20", 3],
    ["BOX_A11", "Sensor", "LM35", 11],
    ["BOX_A11", "Sensor", "LDR Module", 1],
    ["BOX_A11", "Sensor", "LDR", 5],
    ["BOX_A11", "Opto", "Laser Light", 8],
    ["BOX_A11", "Sensor", "IR Sensor Module", 1],
    ["BOX_A11", "Sensor", "IR Sensor 3PIN", 10],
    ["BOX_A11", "Switch", "reed switch (Reed rid)", 5],
    ["BOX_A11", "Sensor", "Infrared temperature Sensor", 2],
    ["BOX_A12 SMD", "IC Socket", "Pin Out Circuit (8,16 Pin)", 20],
    ["BOX_A12 SMD", "Diode", "DB1075 (4 Bridge Diode)", 9],
    ["BOX_A12 SMD", "IC", "HEF 4100383T", 10],
    ["BOX_A12 SMD", "Socket", "Programming Socket", 1],
    ["BOX_A12 SMD", "Regulator", "LM7805", 30],
    ["BOX_A12 SMD", "Regulator", "Voltage Regulator 3.3v", 9],
    ["BOX_A12 SMD", "Microcontroller", "ATMEGA328P", 10],
    ["BOX_A12 SMD", "IC", "CD4052BM", 1],
    ["BOX_A12 SMD", "Microcontroller", "PIC12F675", 10],
    ["BOX_A13", "Hardware", "12mm Metal Nozzle", 12],
    ["BOX_A13", "Hardware", "PVC Spacer", 6],
    ["BOX_A13", "Hardware", "Linear Bearing", 6],
    ["BOX_A14", "IC ADC", "MCP3008", 2],
    ["BOX_A14", "Microcontroller", "PIC 16F76", 7],
    ["BOX_A14", "IC Potentiometer", "MCP41010", 5],
    ["BOX_A14", "RTC IC", "DS1307", 4],
    ["BOX_A14", "Microcontroller", "ATMEGA 8A", 7],
    ["BOX_A14", "Microcontroller", "ATMEGA 32A", 2],
    ["BOX_A14", "Driver IC", "IR2110", 3],
    ["BOX_15", "Arduino", "Arduino Uno R3", 4],
    ["BOX_15", "Arduino", "Arduino Mega", 1],
    ["BOX_15", "Relay", "Relay Module (SPDT)", 3],
    ["BOX_15", "Arduino", "Arduino Nano", 7],
    ["BOX_15", "Motor Driver", "L293D Module", 5],
    ["BOX_15", "Module", "USB Module for arduino", 1],
    ["BOX_15", "Connector", "12V DC jack Converter", 2],
    ["BOX_15", "ESP", "ESP 8266", 2],
    ["Box_A-16", "Sensor", "Finger Print Sensor", 1],
    ["Box_A-16", "Programmer", "USB ASP AVR Burner Module", 1],
    ["Box_A-16", "Module", "Micro SD Card Reader Module", 2],
    ["Box_A-16", "Module", "MP3 TF Module", 3],
    ["Box_A-16", "GSM/GPS", "SIM808", 1],
    ["Box_A-16", "GSM", "SIM800L", 2],
    ["Box_A-16", "GPS", "GPRS/GPS Module", 1],
    ["Box_A-16", "Module", "USB TTL Module", 1],
    ["Box_A-16", "Tool", "Logic Analyzer", 1],
    ["Box_A-16", "Sensor", "Soil Sensor Module", 1],
    ["Box_A-16", "Sensor", "Rain Sensor Module", 1],
    ["Box_A-16", "Module", "Weigh Scale Module HX711", 1],
    ["BOX_A-17", "Power", "Solar Panel", 2],
    ["BOX_A-17", "RFID", "RFID Module", 1],
    ["BOX_A-17", "RFID", "RFID card", 7],
    ["BOX_A-18", "Single Board Computer", "Raspberry Pi zero", 2],
    ["BOX_A-18", "Camera", "Raspberry Pi camera", 2],
    ["BOX_A-18", "Adapter", "HDMI Converter", 2],
    ["BOX_A-18", "Camera", "M5CAM", 1],
    ["BOX_A-19", "Display", "LCD Display 20x4", 7],
    ["BOX_A-19", "Display", "LCD Display 16x2", 6],
    ["BOX_A-19", "Display", "LCD Display 16x1", 3],
    ["BOX_A-20", "Switch", "Limit Switch", 15],
    ["BOX_A-20", "Switch", "Toggle Switch", 16],
    ["BOX_A-21", "Battery", "3V Battery", 10],
    ["BOX_A-21", "GSM", "SIM900A GSM", 1],
    ["BOX_A-21", "GSM", "SIM800C GSM", 4],
    ["BOX_A-21", "Antenna", "Antenna", 3],
    ["BOX_A-21", "Module", "MicroSD Card Adapter", 2],
    ["BOX_A-21", "Module", "RTC Module", 2],
    ["BOX_A-22", "Sensor", "DHT22 Humidity Sensor", 2],
    ["BOX_A-22", "Sensor", "DHT11 Humidity Sensor", 1],
    ["BOX_A-23", "RF Module", "NRF24L01 Module", 3],
    ["BOX_A-23", "Bluetooth", "HC05 Bluetooth", 8],
    ["BOX_A-23", "IC Logic", "74HC595 Shift Register", 20],
    ["BOX_A-25", "Optocoupler", "Optocoupler (PC817)", 40],
    ["BOX_A-25", "Transistor", "BC547 Transistor", 100],
    ["BOX_A-25", "Display", "7 Segment Display (4 Digit)", 5],
    ["BOX_A-25", "Display", "7 Segment Display (1 Digit) CA+", 20],
    ["BOX_A-25", "Display", "7 Segment Display (1 Digit) CC-", 10],
    ["BOX_A-27", "Regulator", "LM317 Regulator", 9],
    ["BOX_A-27", "IC Base", "IC Base 16pin", 40],
    ["BOX_A-27", "IC Base", "IC Base 28pin", 20],
    ["BOX_A-32", "LED", "LED Small Green", 100],
    ["BOX_A-32", "LED", "LED Small Yellow", 100],
    ["BOX_A-32", "LED", "LED Small Red", 20],
    ["BOX_A-41", "MOSFET", "IRFZ44 MOSFET", 100],
    ["BOX_A-42", "Motor", "SERVO MOTOR", 100],
    ["BOX_A-53 (RFL) Big Box", "Arduino", "Arduino Nano", 7],
    ["BOX_A-53 (RFL) Big Box", "Sensor", "Gas Sensor MQ2", 4],
    ["BOX_A-53 (RFL) Big Box", "BMS", "3S BMS 40A", 1],
    ["BOX_A-53 (RFL) Big Box", "ESP", "ESP32 Dev Kit Module V1", 2],
    ["BOX_A-53 (RFL) Big Box", "Motor Driver", "L298N Motor Driver Module", 5],
    ["BOX_A-53 (RFL) Big Box", "RFID", "RFID-RC522 Module", 2],
    ["BOX_A-53 (RFL) Big Box", "Sensor", "ACS-712 Current Sensor Module", 5],
    ["BOX_A-54 (RFL) SMD_BOX", "IC", "NE555 SMD", 4],
    ["BOX_A-55 (Lira) GPS/GSM", "EEPROM", "M24256 EEPROM", 2],
    ["BOX_A-55 (Lira) GPS/GSM", "GPS", "GPS NEO 6M", 0]
  ];

  sheet.getRange(2, 1, initialItems.length, 4).setValues(initialItems);
  SpreadsheetApp.flush();
  Logger.log("Successfully inserted " + initialItems.length + " items!");
}


/**
 * COMPONENTS STOCK MANAGEMENT DASHBOARD - APPLICATION ENGINE
 * Connected to Google Sheets Live Endpoint
 */

// Default Spreadsheet URL and ID
const DEFAULT_SHEET_URL = "https://docs.google.com/spreadsheets/d/1LZhjZ9Fozly7Nnn6G9zXuByWBQUQ2vNRNyJVHaSW7Rc/edit?usp=sharing";
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyhUn0IYGxF6i2YnZ-dOZhHN7EgWj0vZdMVwPNGvCvJAgWTlTpZIlEyOE8Q1nq_KLH/exec";
const STORAGE_KEY_URL = "stock_mgmt_sheet_url";
const STORAGE_KEY_SCRIPT_URL = "stock_mgmt_script_url";
const STORAGE_KEY_DATA = "stock_mgmt_items_cache";
const STORAGE_KEY_CUSTOM_EDITS = "stock_mgmt_custom_edits";
const STORAGE_KEY_AUTH = "stock_mgmt_auth_status";
const APP_PASSWORD = "Mohiuddin";

// Initial Pre-loaded Dataset Extracted from Google Sheet for Immediate Standalone Loading
const INITIAL_CACHED_ITEMS = [
  { id: '1', name: '8 Pin IC Base', category: 'IC Base', box: 'BOX_A-57 (Lira) ESP', qty: 24 },
  { id: '2', name: '40 Pin IC Base', category: 'IC Base', box: 'BOX_A-57 (Lira) ESP', qty: 165 },
  { id: '3', name: 'ESP32', category: 'ESP', box: 'BOX_A-57 (Lira) ESP', qty: 2 },
  { id: '4', name: 'ESP8266', category: 'ESP', box: 'BOX_A-57 (Lira) ESP', qty: 2 },
  { id: '5', name: 'STM32 (blue pill)', category: 'Microcontroller', box: 'BOX_A-57 (Lira) ESP', qty: 1 },
  { id: '6', name: 'U-Lugs (Copper cable) Red', category: 'Connector', box: 'BOX_A2', qty: 26 },
  { id: '7', name: 'U-Lugs (Copper cable) Yellow', category: 'Connector', box: 'BOX_A2', qty: 25 },
  { id: '8', name: 'U-Lugs (Copper cable) Blue', category: 'Connector', box: 'BOX_A2', qty: 60 },
  { id: '9', name: 'U-Lugs (Copper cable) Black', category: 'Connector', box: 'BOX_A2', qty: 16 },
  { id: '10', name: 'Battery Clip (Red)', category: 'Clip', box: 'BOX_A2', qty: 70 },
  { id: '11', name: 'Battery Clip (Blue)', category: 'Clip', box: 'BOX_A2', qty: 70 },
  { id: '12', name: 'Heatsink', category: 'Cooling', box: 'BOX_A2', qty: 5 },
  { id: '13', name: 'Toggle Switch', category: 'Switch', box: 'BOX_A-58 (Lira) Switch', qty: 2 },
  { id: '14', name: 'Push Switch', category: 'Switch', box: 'BOX_A-58 (Lira) Switch', qty: 2 },
  { id: '15', name: 'AC Switch', category: 'Switch', box: 'BOX_A-58 (Lira) Switch', qty: 2 },
  { id: '16', name: 'Male Female 5 Pin Connector', category: 'Connector', box: 'BOX_A-58 (Lira) Switch', qty: 1 },
  { id: '17', name: 'SS Screw 3mm', category: 'Screw', box: 'BOX_A-59 (Lira) SS Screw', qty: 2 },
  { id: '18', name: 'SS Screw 4mm', category: 'Screw', box: 'BOX_A-59 (Lira) SS Screw', qty: 2 },
  { id: '19', name: '4 bridge diode (round type)', category: 'Diode', box: 'BOX_A3', qty: 5 },
  { id: '20', name: '4 bridge diode (square vertical type)', category: 'Diode', box: 'BOX_A3', qty: 2 },
  { id: '21', name: '46uH (Inductor)', category: 'Inductor', box: 'BOX_A3', qty: 10 },
  { id: '22', name: 'UF4007 diode', category: 'Diode', box: 'BOX_A3', qty: 110 },
  { id: '23', name: 'Zener diode (5V)', category: 'Diode', box: 'BOX_A3', qty: 300 },
  { id: '24', name: '1N4744 Zener diode (15V)', category: 'Diode', box: 'BOX_A3', qty: 10 },
  { id: '25', name: 'Zener diode (12V)', category: 'Diode', box: 'BOX_A3', qty: 8 },
  { id: '26', name: 'RJ45 Connector', category: 'Connector', box: 'BOX_A-60 (Lira) SS Screw', qty: 4 },
  { id: '27', name: 'Type C Cannector', category: 'Connector', box: 'BOX_A-60 (Lira) SS Screw', qty: 10 },
  { id: '28', name: 'USB Typ C Male', category: 'Connector', box: 'BOX_A-60 (Lira) SS Screw', qty: 3 },
  { id: '29', name: 'USB Male Female', category: 'Connector', box: 'BOX_A-60 (Lira) SS Screw', qty: 5 },
  { id: '30', name: '3Pin AC Socket', category: 'Socket', box: 'BOX_A6', qty: 3 },
  { id: '31', name: 'BNC Connector (Male + Female)', category: 'Connector', box: 'BOX_A6', qty: 4 },
  { id: '32', name: 'Fuse 10A', category: 'Fuse', box: 'BOX_A6', qty: 5 },
  { id: '33', name: 'Fuse 1A', category: 'Fuse', box: 'BOX_A6', qty: 25 },
  { id: '34', name: '3.3v Level converter', category: 'Module', box: 'BOX_A-61 (RFL) MODULE', qty: 4 },
  { id: '35', name: 'LM358 Module', category: 'Module', box: 'BOX_A-61 (RFL) MODULE', qty: 10 },
  { id: '36', name: '555 Function Generator Mod', category: 'Module', box: 'BOX_A-61 (RFL) MODULE', qty: 5 },
  { id: '37', name: '555 Hi cut module battery', category: 'Module', box: 'BOX_A-61 (RFL) MODULE', qty: 1 },
  { id: '38', name: 'mini pir motion sensor', category: 'Sensor', box: 'BOX_A-61 (RFL) MODULE', qty: 1 },
  { id: '39', name: 'Fuse Holder (Mini)', category: 'Fuse Holder', box: 'BOX_A7', qty: 6 },
  { id: '40', name: 'Fuse Holder (Long)', category: 'Fuse Holder', box: 'BOX_A7', qty: 1 },
  { id: '41', name: 'AC Indicator Type Switch (SPDT)', category: 'Switch', box: 'BOX_A7', qty: 7 },
  { id: '42', name: 'Mini Fuse 2A Remote Fan', category: 'Fuse', box: 'BOX_A7', qty: 7 },
  { id: '43', name: 'Winbond 25Q32FVSIG SPI Flash Memory', category: 'IC', box: 'BOX_A-62 (Lira) Components', qty: 3 },
  { id: '44', name: '10K NTC Metal square type', category: 'Sensor', box: 'BOX_A-62 (Lira) Components', qty: 10 },
  { id: '45', name: 'Load cell CKT HX711', category: 'Module', box: 'BOX_A-62 (Lira) Components', qty: 5 },
  { id: '46', name: 'led ws2812b', category: 'LED', box: 'BOX_A-62 (Lira) Components', qty: 2 },
  { id: '47', name: 'PIC Kit 2 ( USB )', category: 'Programmer', box: 'BOX_A-62 (Lira) Components', qty: 2 },
  { id: '48', name: 'PTC Fuse (XF075, 8A)', category: 'Fuse', box: 'BOX_A-62 (Lira) Components', qty: 5 },
  { id: '49', name: 'PTC Fuse (425, 1.5A)', category: 'Fuse', box: 'BOX_A-62 (Lira) Components', qty: 5 },
  { id: '50', name: 'PIC Kit 2 ( inductor 820uh )', category: 'Inductor', box: 'BOX_A-62 (Lira) Components', qty: 10 },
  { id: '51', name: 'TLP250', category: 'Optocoupler', box: 'BOX_A-62 (Lira) Components', qty: 1 },
  { id: '52', name: 'HX711', category: 'IC', box: 'BOX_A-62 (Lira) Components', qty: 2 },
  { id: '53', name: 'DK124', category: 'IC', box: 'BOX_A-62 (Lira) Components', qty: 10 },
  { id: '54', name: '12V Buzzer', category: 'Buzzer', box: 'BOX-A8', qty: 2 },
  { id: '55', name: 'LM2576', category: 'IC Regulator', box: 'BOX-A8', qty: 21 },
  { id: '56', name: 'Potentiometer (1K)', category: 'Resistor Variable', box: 'BOX-A8', qty: 2 },
  { id: '57', name: 'Potentiometer (10K)', category: 'Resistor Variable', box: 'BOX-A8', qty: 8 },
  { id: '58', name: 'Potentiometer (100K)', category: 'Resistor Variable', box: 'BOX-A8', qty: 4 },
  { id: '59', name: 'Veroboard', category: 'Board', box: 'BOX_A9', qty: 7 },
  { id: '60', name: 'Volume Knob', category: 'Hardware', box: 'BOX_A9', qty: 30 },
  { id: '61', name: 'IRFP250N', category: 'MOSFET', box: 'BOX_A10', qty: 3 },
  { id: '62', name: 'FGH40N60', category: 'IGBT', box: 'BOX_A10', qty: 5 },
  { id: '63', name: 'IRFP254N', category: 'MOSFET', box: 'BOX_A10', qty: 1 },
  { id: '64', name: 'tyn612m SCR', category: 'SCR', box: 'BOX_A10', qty: 3 },
  { id: '65', name: 'irf451', category: 'MOSFET', box: 'BOX_A10', qty: 4 },
  { id: '66', name: 'IRFP260N', category: 'MOSFET', box: 'BOX_A10', qty: 5 },
  { id: '67', name: 'TIP107', category: 'Transistor', box: 'BOX_A10', qty: 5 },
  { id: '68', name: 'TIP122', category: 'Transistor', box: 'BOX_A10', qty: 8 },
  { id: '69', name: 'MOSFET Z44', category: 'MOSFET', box: 'BOX_A10', qty: 2 },
  { id: '70', name: 'F9Z34N', category: 'MOSFET', box: 'BOX_A10', qty: 5 },
  { id: '71', name: 'TRIAC/ BTA41', category: 'Triac', box: 'BOX_A10', qty: 2 },
  { id: '72', name: 'IGBT MBQ60T65PES', category: 'IGBT', box: 'BOX_A10', qty: 9 },
  { id: '73', name: 'IRF3205', category: 'MOSFET', box: 'BOX_A10', qty: 2 },
  { id: '74', name: '18b20', category: 'Sensor', box: 'BOX_A11', qty: 3 },
  { id: '75', name: 'LM35', category: 'Sensor', box: 'BOX_A11', qty: 11 },
  { id: '76', name: 'LDR Module', category: 'Sensor', box: 'BOX_A11', qty: 1 },
  { id: '77', name: 'LDR', category: 'Sensor', box: 'BOX_A11', qty: 5 },
  { id: '78', name: 'Laser Light', category: 'Opto', box: 'BOX_A11', qty: 8 },
  { id: '79', name: 'IR Sensor Module', category: 'Sensor', box: 'BOX_A11', qty: 1 },
  { id: '80', name: 'IR Sensor 3PIN', category: 'Sensor', box: 'BOX_A11', qty: 10 },
  { id: '81', name: 'reed switch (Reed rid)', category: 'Switch', box: 'BOX_A11', qty: 5 },
  { id: '82', name: 'Infrared temperature Sensor', category: 'Sensor', box: 'BOX_A11', qty: 2 },
  { id: '83', name: 'Pin Out Circuit (8,16 Pin)', category: 'IC Socket', box: 'BOX_A12 SMD', qty: 20 },
  { id: '84', name: 'DB1075 (4 Bridge Diode)', category: 'Diode', box: 'BOX_A12 SMD', qty: 9 },
  { id: '85', name: 'HEF 4100383T', category: 'IC', box: 'BOX_A12 SMD', qty: 10 },
  { id: '86', name: 'Programming Socket', category: 'Socket', box: 'BOX_A12 SMD', qty: 1 },
  { id: '87', name: 'LM7805', category: 'Regulator', box: 'BOX_A12 SMD', qty: 30 },
  { id: '88', name: 'Voltage Regulator 3.3v', category: 'Regulator', box: 'BOX_A12 SMD', qty: 9 },
  { id: '89', name: 'ATMEGA328P', category: 'Microcontroller', box: 'BOX_A12 SMD', qty: 10 },
  { id: '90', name: 'CD4052BM', category: 'IC', box: 'BOX_A12 SMD', qty: 1 },
  { id: '91', name: 'PIC12F675', category: 'Microcontroller', box: 'BOX_A12 SMD', qty: 10 },
  { id: '92', name: '12mm Metal Nozzle', category: 'Hardware', box: 'BOX_A13', qty: 12 },
  { id: '93', name: 'PVC Spacer', category: 'Hardware', box: 'BOX_A13', qty: 6 },
  { id: '94', name: 'Linear Bearing', category: 'Hardware', box: 'BOX_A13', qty: 6 },
  { id: '95', name: 'MCP3008', category: 'IC ADC', box: 'BOX_A14', qty: 2 },
  { id: '96', name: 'PIC 16F76', category: 'Microcontroller', box: 'BOX_A14', qty: 7 },
  { id: '97', name: 'MCP41010', category: 'IC Potentiometer', box: 'BOX_A14', qty: 5 },
  { id: '98', name: 'DS1307', category: 'RTC IC', box: 'BOX_A14', qty: 4 },
  { id: '99', name: 'ATMEGA 8A', category: 'Microcontroller', box: 'BOX_A14', qty: 7 },
  { id: '100', name: 'ATMEGA 32A', category: 'Microcontroller', box: 'BOX_A14', qty: 2 },
  { id: '101', name: 'IR2110', category: 'Driver IC', box: 'BOX_A14', qty: 3 },
  { id: '102', name: 'Arduino Uno R3', category: 'Arduino', box: 'BOX_15', qty: 4 },
  { id: '103', name: 'Arduino Mega', category: 'Arduino', box: 'BOX_15', qty: 1 },
  { id: '104', name: 'Relay Module (SPDT)', category: 'Relay', box: 'BOX_15', qty: 3 },
  { id: '105', name: 'Arduino Nano', category: 'Arduino', box: 'BOX_15', qty: 7 },
  { id: '106', name: 'L293D Module', category: 'Motor Driver', box: 'BOX_15', qty: 5 },
  { id: '107', name: 'USB Module for arduino', category: 'Module', box: 'BOX_15', qty: 1 },
  { id: '108', name: '12V DC jack Converter', category: 'Connector', box: 'BOX_15', qty: 2 },
  { id: '109', name: 'ESP 8266', category: 'ESP', box: 'BOX_15', qty: 2 },
  { id: '110', name: 'Finger Print Sensor', category: 'Sensor', box: 'Box_A-16', qty: 1 },
  { id: '111', name: 'USB ASP AVR Burner Module', category: 'Programmer', box: 'Box_A-16', qty: 1 },
  { id: '112', name: 'Micro SD Card Reader Module', category: 'Module', box: 'Box_A-16', qty: 2 },
  { id: '113', name: 'MP3 TF Module', category: 'Module', box: 'Box_A-16', qty: 3 },
  { id: '114', name: 'SIM808', category: 'GSM/GPS', box: 'Box_A-16', qty: 1 },
  { id: '115', name: 'SIM800L', category: 'GSM', box: 'Box_A-16', qty: 2 },
  { id: '116', name: 'GPRS/GPS Module', category: 'GPS', box: 'Box_A-16', qty: 1 },
  { id: '117', name: 'USB TTL Module', category: 'Module', box: 'Box_A-16', qty: 1 },
  { id: '118', name: 'Logic Analyzer', category: 'Tool', box: 'Box_A-16', qty: 1 },
  { id: '119', name: 'Soil Sensor Module', category: 'Sensor', box: 'Box_A-16', qty: 1 },
  { id: '120', name: 'Rain Sensor Module', category: 'Sensor', box: 'Box_A-16', qty: 1 },
  { id: '121', name: 'Weigh Scale Module HX711', category: 'Module', box: 'Box_A-16', qty: 1 },
  { id: '122', name: 'Solar Panel', category: 'Power', box: 'BOX_A-17', qty: 2 },
  { id: '123', name: 'RFID Module', category: 'RFID', box: 'BOX_A-17', qty: 1 },
  { id: '124', name: 'RFID card', category: 'RFID', box: 'BOX_A-17', qty: 7 },
  { id: '125', name: 'Raspberry Pi zero', category: 'Single Board Computer', box: 'BOX_A-18', qty: 2 },
  { id: '126', name: 'Raspberry Pi camera', category: 'Camera', box: 'BOX_A-18', qty: 2 },
  { id: '127', name: 'HDMI Converter', category: 'Adapter', box: 'BOX_A-18', qty: 2 },
  { id: '128', name: 'M5CAM', category: 'Camera', box: 'BOX_A-18', qty: 1 },
  { id: '129', name: 'LCD Display 20x4', category: 'Display', box: 'BOX_A-19', qty: 7 },
  { id: '130', name: 'LCD Display 16x2', category: 'Display', box: 'BOX_A-19', qty: 6 },
  { id: '131', name: 'LCD Display 16x1', category: 'Display', box: 'BOX_A-19', qty: 3 },
  { id: '132', name: 'Limit Switch', category: 'Switch', box: 'BOX_A-20', qty: 15 },
  { id: '133', name: 'Toggle Switch', category: 'Switch', box: 'BOX_A-20', qty: 16 },
  { id: '134', name: '3V Battery', category: 'Battery', box: 'BOX_A-21', qty: 10 },
  { id: '135', name: 'SIM900A GSM', category: 'GSM', box: 'BOX_A-21', qty: 1 },
  { id: '136', name: 'SIM800C GSM', category: 'GSM', box: 'BOX_A-21', qty: 4 },
  { id: '137', name: 'Antenna', category: 'Antenna', box: 'BOX_A-21', qty: 3 },
  { id: '138', name: 'MicroSD Card Adapter', category: 'Module', box: 'BOX_A-21', qty: 2 },
  { id: '139', name: 'RTC Module', category: 'Module', box: 'BOX_A-21', qty: 2 },
  { id: '140', name: 'DHT22 Humidity Sensor', category: 'Sensor', box: 'BOX_A-22', qty: 2 },
  { id: '141', name: 'DHT11 Humidity Sensor', category: 'Sensor', box: 'BOX_A-22', qty: 1 },
  { id: '142', name: 'NRF24L01 Module', category: 'RF Module', box: 'BOX_A-23', qty: 3 },
  { id: '143', name: 'HC05 Bluetooth', category: 'Bluetooth', box: 'BOX_A-23', qty: 8 },
  { id: '144', name: '74HC595 Shift Register', category: 'IC Logic', box: 'BOX_A-23', qty: 20 },
  { id: '145', name: 'Optocoupler (PC817)', category: 'Optocoupler', box: 'BOX_A-25', qty: 40 },
  { id: '146', name: 'BC547 Transistor', category: 'Transistor', box: 'BOX_A-25', qty: 100 },
  { id: '147', name: '7 Segment Display (4 Digit)', category: 'Display', box: 'BOX_A-25', qty: 5 },
  { id: '148', name: '7 Segment Display (1 Digit) CA+', category: 'Display', box: 'BOX_A-25', qty: 20 },
  { id: '149', name: '7 Segment Display (1 Digit) CC-', category: 'Display', box: 'BOX_A-25', qty: 10 },
  { id: '150', name: 'LM317 Regulator', category: 'Regulator', box: 'BOX_A-27', qty: 9 },
  { id: '151', name: 'IC Base 16pin', category: 'IC Base', box: 'BOX_A-27', qty: 40 },
  { id: '152', name: 'IC Base 28pin', category: 'IC Base', box: 'BOX_A-27', qty: 20 },
  { id: '153', name: 'LED Small Green', category: 'LED', box: 'BOX_A-32', qty: 100 },
  { id: '154', name: 'LED Small Yellow', category: 'LED', box: 'BOX_A-32', qty: 100 },
  { id: '155', name: 'LED Small Red', category: 'LED', box: 'BOX_A-32', qty: 20 },
  { id: '156', name: 'IRFZ44 MOSFET', category: 'MOSFET', box: 'BOX_A-41', qty: 100 },
  { id: '157', name: 'SERVO MOTOR', category: 'Motor', box: 'BOX_A-42', qty: 100 },
  { id: '158', name: 'Arduino Nano', category: 'Arduino', box: 'BOX_A-53 (RFL) Big Box', qty: 7 },
  { id: '159', name: 'Gas Sensor MQ2', category: 'Sensor', box: 'BOX_A-53 (RFL) Big Box', qty: 4 },
  { id: '160', name: '3S BMS 40A', category: 'BMS', box: 'BOX_A-53 (RFL) Big Box', qty: 1 },
  { id: '161', name: 'ESP32 Dev Kit Module V1', category: 'ESP', box: 'BOX_A-53 (RFL) Big Box', qty: 2 },
  { id: '162', name: 'L298N Motor Driver Module', category: 'Motor Driver', box: 'BOX_A-53 (RFL) Big Box', qty: 5 },
  { id: '163', name: 'RFID-RC522 Module', category: 'RFID', box: 'BOX_A-53 (RFL) Big Box', qty: 2 },
  { id: '164', name: 'ACS-712 Current Sensor Module', category: 'Sensor', box: 'BOX_A-53 (RFL) Big Box', qty: 5 },
  { id: '165', name: 'NE555 SMD', category: 'IC', box: 'BOX_A-54 (RFL) SMD_BOX', qty: 4 },
  { id: '166', name: 'M24256 EEPROM', category: 'EEPROM', box: 'BOX_A-55 (Lira) GPS/GSM', qty: 2 },
  { id: '167', name: 'GPS NEO 6M', category: 'GPS', box: 'BOX_A-55 (Lira) GPS/GSM', qty: 0 }
];

// STATE ENGINE
let currentItems = [];
let activeSheetUrl = DEFAULT_SHEET_URL;
let activeScriptUrl = "";
let activeView = "boxes"; // "table", "grid", "boxes", "analytics" (default to boxes)
let activeStatusFilter = "ALL"; // "ALL", "IN_STOCK", "LOW", "OUT"
let categoryChartInstance = null;
let boxChartInstance = null;

const STORAGE_KEY_THEME = "stock_mgmt_theme";

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  initTheme();
  setupLockscreen();
  loadSavedConfig();
  setupEventListeners();
  fetchOrLoadStockData();
}

// SECURITY & LOCKSCREEN LOGIC
function setupLockscreen() {
  const overlay = document.getElementById("lockscreenOverlay");
  const form = document.getElementById("lockscreenForm");
  const input = document.getElementById("lockPasswordInput");
  const btnTogglePwd = document.getElementById("btnTogglePwd");
  const eyeIcon = document.getElementById("eyeIcon");
  const errorMsg = document.getElementById("lockErrorMsg");
  const rememberCheckbox = document.getElementById("rememberAuthCheckbox");

  // Check existing session
  const isAuth = localStorage.getItem(STORAGE_KEY_AUTH) === "authenticated" || 
                 sessionStorage.getItem(STORAGE_KEY_AUTH) === "authenticated";

  if (isAuth) {
    if (overlay) overlay.classList.add("unlocked");
  } else {
    if (overlay) {
      overlay.classList.remove("unlocked");
      setTimeout(() => input && input.focus(), 300);
    }
  }

  // Toggle password visibility
  if (btnTogglePwd && input) {
    btnTogglePwd.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      if (eyeIcon) {
        eyeIcon.className = isPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
      }
    });
  }

  // Handle Unlock Submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleUnlockSubmit();
    });
  }

  const btnUnlock = document.getElementById("btnUnlock");
  if (btnUnlock) {
    btnUnlock.addEventListener("click", handleUnlockSubmit);
  }

  function handleUnlockSubmit() {
    const entered = input.value.trim();
    if (entered.toLowerCase() === APP_PASSWORD.toLowerCase()) {
      if (errorMsg) errorMsg.classList.add("hidden");
      
      const remember = rememberCheckbox && rememberCheckbox.checked;
      if (remember) {
        localStorage.setItem(STORAGE_KEY_AUTH, "authenticated");
      } else {
        sessionStorage.setItem(STORAGE_KEY_AUTH, "authenticated");
      }

      if (overlay) overlay.classList.add("unlocked");
      showToast("Welcome! Dashboard Unlocked.", "success");
      input.value = "";
    } else {
      const card = overlay.querySelector(".lockscreen-card");
      if (card) {
        card.classList.remove("shake");
        void card.offsetWidth; // trigger reflow
        card.classList.add("shake");
      }
      if (errorMsg) errorMsg.classList.remove("hidden");
      input.value = "";
      input.focus();
    }
  }
}

function lockDashboard() {
  localStorage.removeItem(STORAGE_KEY_AUTH);
  sessionStorage.removeItem(STORAGE_KEY_AUTH);
  const overlay = document.getElementById("lockscreenOverlay");
  const input = document.getElementById("lockPasswordInput");
  const errorMsg = document.getElementById("lockErrorMsg");

  if (errorMsg) errorMsg.classList.add("hidden");
  if (overlay) {
    overlay.classList.remove("unlocked");
    if (input) {
      input.value = "";
      setTimeout(() => input.focus(), 300);
    }
  }
  showToast("Dashboard locked.", "info");
}

// THEME LOGIC
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || "dark";
  applyTheme(savedTheme);
}

function toggleTheme() {
  const isLight = document.body.classList.contains("light-theme");
  const newTheme = isLight ? "dark" : "light";
  applyTheme(newTheme);
  localStorage.setItem(STORAGE_KEY_THEME, newTheme);
  showToast(`Switched to ${newTheme === "light" ? "Light" : "Dark"} Theme`, "info");
}

function applyTheme(theme) {
  const iconEl = document.getElementById("themeIcon");
  const textEl = document.getElementById("themeText");

  if (theme === "light") {
    document.body.classList.add("light-theme");
    if (iconEl) iconEl.className = "fa-solid fa-moon";
    if (textEl) textEl.textContent = "Dark";
  } else {
    document.body.classList.remove("light-theme");
    if (iconEl) iconEl.className = "fa-solid fa-sun";
    if (textEl) textEl.textContent = "Light";
  }
}

// CONFIG & STORAGE LOGIC
function loadSavedConfig() {
  const savedUrl = localStorage.getItem(STORAGE_KEY_URL);
  if (savedUrl) {
    activeSheetUrl = savedUrl;
  }
  const savedScriptUrl = localStorage.getItem(STORAGE_KEY_SCRIPT_URL);
  activeScriptUrl = savedScriptUrl || DEFAULT_SCRIPT_URL;
  updateSheetUrlDisplay();
}

function updateSheetUrlDisplay() {
  const displayEl = document.getElementById("connectedSheetUrlDisplay");
  const inputEl = document.getElementById("inputSheetUrl");
  const scriptInputEl = document.getElementById("inputScriptUrl");
  if (displayEl) {
    displayEl.href = activeSheetUrl;
    displayEl.textContent = activeSheetUrl;
  }
  if (inputEl) {
    inputEl.value = activeSheetUrl;
  }
  if (scriptInputEl) {
    scriptInputEl.value = activeScriptUrl;
  }
}

// FETCH LIVE DATA FROM GOOGLE SHEETS
async function fetchOrLoadStockData(forceLive = false) {
  setSyncStatus("syncing", "Syncing Sheet...");

  try {
    let parsedItems = null;

    // First try fetching directly from Apps Script Web App Endpoint if configured
    if (activeScriptUrl) {
      console.log("Fetching live stock data via Apps Script Web App API:", activeScriptUrl);
      try {
        const scriptRes = await fetch(activeScriptUrl);
        if (scriptRes.ok) {
          const resJson = await scriptRes.json();
          if (resJson && resJson.items && resJson.items.length > 0) {
            parsedItems = resJson.items;
          }
        }
      } catch (errScript) {
        console.warn("Apps Script API fetch error, falling back to CSV URL:", errScript);
      }
    }

    // Fallback to CSV parsing from Google Sheet share link if Apps Script not used/failed
    if (!parsedItems || parsedItems.length === 0) {
      const csvUrl = getGoogleSheetCsvUrl(activeSheetUrl);
      console.log("Fetching live Google Sheet CSV from:", csvUrl);

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      parsedItems = parseGoogleSheetCsv(csvText);
    }

    if (parsedItems && parsedItems.length > 0) {
      currentItems = mergeWithCustomEdits(parsedItems);
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(currentItems));
      setSyncStatus("success", activeScriptUrl ? "2-Way Live Connected" : "Live Connected", new Date().toLocaleTimeString());
      showToast("Successfully synced live stock data!", "success");
    } else {
      throw new Error("No valid items parsed from sheet");
    }
  } catch (error) {
    console.warn("Live fetch failed or CORS blocked. Falling back to cached data:", error);
    
    // Check local storage cache or fallback to initial dataset
    const cachedData = localStorage.getItem(STORAGE_KEY_DATA);
    if (cachedData) {
      currentItems = JSON.parse(cachedData);
      setSyncStatus("success", "Cached Data", "Offline");
      showToast("Loaded stock data from local cache.", "info");
    } else {
      currentItems = mergeWithCustomEdits(INITIAL_CACHED_ITEMS);
      setSyncStatus("success", "Preloaded Data", "Default");
      showToast("Showing pre-loaded component dataset.", "info");
    }
  }

  refreshDashboardUI();
  checkUrlParamsForBox();
}

function checkUrlParamsForBox() {
  try {
    const params = new URLSearchParams(window.location.search);
    const boxParam = (params.get("b") || params.get("box") || "").trim();
    if (!boxParam) return;

    const cleanQuery = boxParam.toLowerCase().replace(/[^a-z0-9]/g, "");

    // 1. Exact match
    let match = currentItems.find(i => i.box.toLowerCase() === boxParam.toLowerCase());

    // 2. Clean alphanumeric match (e.g. "boxr1boxa50" -> "BOX_R1, BOX_A-50")
    if (!match) {
      match = currentItems.find(i => i.box.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanQuery);
    }

    // 3. Substring / Prefix match
    if (!match) {
      match = currentItems.find(i => {
        const itemBoxClean = i.box.toLowerCase().replace(/[^a-z0-9]/g, "");
        return itemBoxClean.includes(cleanQuery) || cleanQuery.includes(itemBoxClean);
      });
    }

    if (match) {
      setTimeout(() => openBoxDetailModal(match.box), 200);
    }
  } catch (e) {}
}

// Convert any Google Sheet share URL to CSV endpoint
function getGoogleSheetCsvUrl(sheetUrl) {
  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  }
  return sheetUrl;
}

// CSV PARSER FOR MULTI-COLUMN GOOGLE SHEET LAYOUT
function parseGoogleSheetCsv(csvText) {
  const parsed = Papa.parse(csvText, { skipEmptyLines: false });
  if (!parsed.data || parsed.data.length === 0) return [];

  const rows = parsed.data;
  const items = [];
  let itemIdCounter = 1;

  // Track parent box and category per column set
  const colSets = [
    { boxCol: 0, catCol: 1, nameCol: 2, qtyCol: 3, currentBox: "", currentCat: "" },
    { boxCol: 5, catCol: 6, nameCol: 7, qtyCol: 8, currentBox: "", currentCat: "" },
    { boxCol: 10, catCol: 11, nameCol: 12, qtyCol: 13, currentBox: "", currentCat: "" }
  ];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    for (const set of colSets) {
      if (set.boxCol >= row.length) continue;

      const rawBox = (row[set.boxCol] || "").trim();
      const rawCat = (row[set.catCol] || "").trim();
      const rawName = (row[set.nameCol] || "").trim();
      const rawQty = (row[set.qtyCol] || "").trim();

      // Update section state if box name is present
      if (rawBox && rawBox.toLowerCase().startsWith("box")) {
        set.currentBox = rawBox;
      } else if (rawBox && !set.currentBox) {
        set.currentBox = rawBox;
      }

      // Update category state
      if (rawCat && !rawCat.toLowerCase().includes("category")) {
        set.currentCat = rawCat;
      }

      // Validate component entry
      if (rawName && !isHeaderRow(rawName)) {
        const qtyNum = parseInt(rawQty, 10);
        const finalQty = isNaN(qtyNum) ? 0 : Math.max(0, qtyNum);
        const finalBox = set.currentBox || "General Box";
        const finalCat = rawCat || set.currentCat || inferCategoryFromName(rawName);

        items.push({
          id: `item_${itemIdCounter++}`,
          name: sanitizeText(rawName),
          category: sanitizeText(finalCat),
          box: sanitizeText(finalBox),
          qty: finalQty
        });
      }
    }
  }

  return items;
}

function isHeaderRow(text) {
  const lower = text.toLowerCase();
  return lower.includes("component name") || lower.includes("kl ;lkjhgf") || lower.includes("quantity");
}

function inferCategoryFromName(name) {
  const lower = name.toLowerCase();
  if (lower.includes("resistor")) return "Resistor";
  if (lower.includes("diode")) return "Diode";
  if (lower.includes("capacitor") || lower.includes("cap")) return "Capacitor";
  if (lower.includes("switch")) return "Switch";
  if (lower.includes("fuse")) return "Fuse";
  if (lower.includes("sensor")) return "Sensor";
  if (lower.includes("module")) return "Module";
  if (lower.includes("connector") || lower.includes("jack")) return "Connector";
  if (lower.includes("arduino")) return "Arduino";
  if (lower.includes("esp")) return "ESP";
  if (lower.includes("mosfet") || lower.includes("igbt")) return "MOSFET/Transistor";
  return "General";
}

function sanitizeText(str) {
  if (!str) return "";
  return String(str)
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .trim();
}

function normalizeBoxName(box) {
  const clean = sanitizeText(box);
  if (!clean) return "General Box";
  // Canonicalize box prefix casing (e.g. "box_a-16" -> "BOX_A-16")
  if (clean.toLowerCase().startsWith("box_")) {
    return "BOX_" + clean.slice(4);
  }
  if (clean.toLowerCase().startsWith("box-")) {
    return "BOX_" + clean.slice(4);
  }
  return clean;
}

function mergeWithCustomEdits(items) {
  const editsJson = localStorage.getItem(STORAGE_KEY_CUSTOM_EDITS);
  if (!editsJson) return items;

  try {
    const edits = JSON.parse(editsJson);
    const itemMap = new Map();
    items.forEach(item => itemMap.set(item.name.toLowerCase(), item));

    edits.forEach(editItem => {
      itemMap.set(editItem.name.toLowerCase(), editItem);
    });

    return Array.from(itemMap.values());
  } catch (e) {
    return items;
  }
}

function saveCustomEdits() {
  localStorage.setItem(STORAGE_KEY_CUSTOM_EDITS, JSON.stringify(currentItems));
  localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(currentItems));
}

// REAL-TIME AUTO SYNC TO GOOGLE APPS SCRIPT WEB APP
async function syncItemToGoogleSheet(action, payload) {
  saveCustomEdits();

  if (!activeScriptUrl) {
    console.log("Google Apps Script URL not configured. Item saved to browser local storage.");
    return;
  }

  setSyncStatus("syncing", "Syncing to Sheet...");

  try {
    // Construct query parameters for CORS-free GET request to Google Apps Script
    const cleanPayload = {};
    Object.keys(payload || {}).forEach(k => {
      if (payload[k] !== undefined && payload[k] !== null) {
        cleanPayload[k] = payload[k];
      }
    });

    const queryParams = new URLSearchParams({ action, ...cleanPayload }).toString();
    const fullSyncUrl = `${activeScriptUrl}?${queryParams}`;

    const response = await fetch(fullSyncUrl);
    const resJson = await response.json();

    if (resJson && resJson.status === "success") {
      setSyncStatus("success", "Auto-Synced ✓", new Date().toLocaleTimeString());
      showToast("Auto-synced to Google Sheet! ✓", "success");
    } else {
      setSyncStatus("success", "Local Saved", "Sync Alert");
    }
  } catch (err) {
    console.warn("GET sync call error, attempting POST fallback:", err);
    try {
      await fetch(activeScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, ...payload })
      });
      setSyncStatus("success", "Auto-Synced ✓", new Date().toLocaleTimeString());
      showToast("Auto-synced to Google Sheet! ✓", "success");
    } catch (errPost) {
      console.warn("Failed to auto-sync to Google Sheet Apps Script:", errPost);
      setSyncStatus("success", "Local Saved", "Offline");
    }
  }
}

// DASHBOARD RENDERING & FILTERING
function refreshDashboardUI() {
  populateFilterDropdowns();
  updateMetricsSummary();
  renderCurrentView();
}

function populateFilterDropdowns() {
  const catSelect = document.getElementById("categoryFilter");
  const boxSelect = document.getElementById("boxFilter");
  const catDatalist = document.getElementById("categoryDatalist");
  const boxDatalist = document.getElementById("boxDatalist");

  // Normalize item properties
  currentItems.forEach(item => {
    if (item.box) item.box = normalizeBoxName(item.box);
    if (item.category) item.category = sanitizeText(item.category);
  });

  // Extract unique boxes using case-insensitive Map
  const boxMap = new Map();
  currentItems.forEach(i => {
    if (!i.box) return;
    const key = i.box.toLowerCase();
    if (!boxMap.has(key)) {
      boxMap.set(key, i.box);
    }
  });

  const boxes = Array.from(boxMap.values()).sort((a, b) => 
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  // Extract unique categories using case-insensitive Map
  const catMap = new Map();
  currentItems.forEach(i => {
    if (!i.category) return;
    const key = i.category.toLowerCase();
    if (!catMap.has(key)) {
      catMap.set(key, i.category);
    }
  });

  const categories = Array.from(catMap.values()).sort();

  // Populate Category Filter
  const currentCatVal = catSelect.value;
  catSelect.innerHTML = `<option value="ALL">All Categories (${categories.length})</option>`;
  categories.forEach(cat => {
    catSelect.innerHTML += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`;
  });
  catSelect.value = categories.includes(currentCatVal) ? currentCatVal : "ALL";

  // Populate Box Filter
  const currentBoxVal = boxSelect.value;
  boxSelect.innerHTML = `<option value="ALL">All Storage Boxes (${boxes.length})</option>`;
  boxes.forEach(box => {
    boxSelect.innerHTML += `<option value="${escapeHtml(box)}">${escapeHtml(box)}</option>`;
  });
  boxSelect.value = boxes.includes(currentBoxVal) ? currentBoxVal : "ALL";

  // Datalists for Add Modal
  catDatalist.innerHTML = categories.map(c => `<option value="${escapeHtml(c)}">`).join('');
  boxDatalist.innerHTML = boxes.map(b => `<option value="${escapeHtml(b)}">`).join('');
}

function getFilteredAndSortedItems() {
  const searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
  const selectedCat = document.getElementById("categoryFilter").value;
  const selectedBox = document.getElementById("boxFilter").value;
  const sortOption = document.getElementById("sortSelect").value;

  let filtered = currentItems.filter(item => {
    // Search query match
    if (searchQuery) {
      const matchName = item.name.toLowerCase().includes(searchQuery);
      const matchCat = item.category.toLowerCase().includes(searchQuery);
      const matchBox = item.box.toLowerCase().includes(searchQuery);
      if (!matchName && !matchCat && !matchBox) return false;
    }

    // Category match
    if (selectedCat !== "ALL" && item.category !== selectedCat) return false;

    // Box match
    if (selectedBox !== "ALL" && item.box !== selectedBox) return false;

    // Status Pill filter
    if (activeStatusFilter === "IN_STOCK" && item.qty <= 5) return false;
    if (activeStatusFilter === "LOW" && (item.qty === 0 || item.qty > 5)) return false;
    if (activeStatusFilter === "OUT" && item.qty > 0) return false;

    return true;
  });

  // Sorting logic
  filtered.sort((a, b) => {
    switch (sortOption) {
      case "QTY_DESC": return b.qty - a.qty;
      case "QTY_ASC": return a.qty - b.qty;
      case "BOX_ASC": return a.box.localeCompare(b.box);
      case "CAT_ASC": return a.category.localeCompare(b.category);
      case "NAME_ASC":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return filtered;
}

function updateMetricsSummary() {
  const totalItemsCount = currentItems.length;
  const totalStockUnits = currentItems.reduce((acc, curr) => acc + curr.qty, 0);
  const outOfStockCount = currentItems.filter(i => i.qty === 0).length;
  const lowStockCount = currentItems.filter(i => i.qty > 0 && i.qty <= 5).length;
  const inStockCount = currentItems.filter(i => i.qty > 5).length;
  const distinctBoxesCount = new Set(currentItems.map(i => i.box)).size;
  const distinctCategoriesCount = new Set(currentItems.map(i => i.category)).size;

  document.getElementById("valTotalItems").textContent = totalItemsCount.toLocaleString();
  document.getElementById("subTotalTypes").textContent = `${totalItemsCount} Component Types`;
  document.getElementById("valTotalQuantity").textContent = totalStockUnits.toLocaleString();
  document.getElementById("valOutOfStock").textContent = outOfStockCount.toLocaleString();
  document.getElementById("valLowStock").textContent = lowStockCount.toLocaleString();
  document.getElementById("valTotalBoxes").textContent = distinctBoxesCount.toLocaleString();
  document.getElementById("valTotalCategories").textContent = distinctCategoriesCount.toLocaleString();

  // Update Status Pill Counts
  document.getElementById("countPillAll").textContent = totalItemsCount;
  document.getElementById("countPillInStock").textContent = inStockCount;
  document.getElementById("countPillLow").textContent = lowStockCount;
  document.getElementById("countPillOut").textContent = outOfStockCount;
}

function renderCurrentView() {
  const filteredItems = getFilteredAndSortedItems();

  if (activeView === "table") {
    renderTableView(filteredItems);
  } else if (activeView === "grid") {
    renderGridView(filteredItems);
  } else if (activeView === "boxes") {
    renderBoxesView();
  } else if (activeView === "analytics") {
    renderAnalyticsView();
  }
}

// RENDER STORAGE BOXES ORGANIZER VIEW
let activeDetailBoxName = "";

function renderBoxesView() {
  const boxesContainer = document.getElementById("boxesGrid");
  boxesContainer.innerHTML = "";

  const searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
  const selectedBox = document.getElementById("boxFilter").value;
  const selectedCat = document.getElementById("categoryFilter").value;

  // Group items by box considering category and status filters
  const boxMap = new Map();
  currentItems.forEach(item => {
    // Status Pill filter check
    if (activeStatusFilter === "IN_STOCK" && item.qty <= 5) return;
    if (activeStatusFilter === "LOW" && (item.qty === 0 || item.qty > 5)) return;
    if (activeStatusFilter === "OUT" && item.qty > 0) return;

    // Category filter check
    if (selectedCat !== "ALL" && item.category !== selectedCat) return;

    const boxName = normalizeBoxName(item.box);
    item.box = boxName;
    if (!boxMap.has(boxName)) {
      boxMap.set(boxName, []);
    }
    boxMap.get(boxName).push(item);
  });

  // Convert to array
  let boxEntries = Array.from(boxMap.entries());

  // Search query filter
  if (searchQuery) {
    boxEntries = boxEntries.filter(([boxName, items]) => {
      const matchBox = boxName.toLowerCase().includes(searchQuery);
      const matchItem = items.some(i => i.name.toLowerCase().includes(searchQuery) || i.category.toLowerCase().includes(searchQuery));
      return matchBox || matchItem;
    });
  }

  // Sort: If a specific Box ID is selected in dropdown, bring that Box FIRST to position #1 at top!
  if (selectedBox !== "ALL") {
    const exactMatches = boxEntries.filter(([bName]) => bName === selectedBox);
    const otherBoxes = boxEntries.filter(([bName]) => bName !== selectedBox);
    
    // Sort other boxes naturally
    otherBoxes.sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' }));
    
    // Put selectedBox FIRST at top!
    boxEntries = [...exactMatches, ...otherBoxes];
  } else {
    // Sort box names naturally (e.g. BOX_A2, BOX_A3, BOX_A10...)
    boxEntries.sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true, sensitivity: 'base' }));
  }

  if (boxEntries.length === 0) {
    boxesContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon"><i class="fa-solid fa-box-open"></i></div>
        <h3>No Storage Boxes Found</h3>
        <p>No storage boxes match your current search or filter criteria.</p>
        <button class="btn btn-secondary" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  boxEntries.forEach(([boxName, items]) => {
    const isSelectedBox = (selectedBox !== "ALL" && boxName === selectedBox);
    const totalUnits = items.reduce((sum, i) => sum + i.qty, 0);
    const boxCard = document.createElement("div");
    boxCard.className = "storage-box-card clickable-metric";
    
    // Highlight selected box with cyan border and glow if selected in dropdown
    if (isSelectedBox) {
      boxCard.style.border = "2px solid var(--primary-cyan)";
      boxCard.style.boxShadow = "0 0 25px rgba(0, 242, 254, 0.4)";
    }

    const safeBoxName = escapeHtml(boxName).replace(/'/g, "\\'");

    // Render list of components inside box with their quantity
    const itemRowsHtml = items.map(i => `
      <div class="box-item-chip">
        <span class="chip-name">${escapeHtml(i.name)}</span>
        <span class="chip-qty">Qty: ${i.qty}</span>
      </div>
    `).join('');

    boxCard.innerHTML = `
      <div onclick="openBoxDetailModal('${safeBoxName}')">
        <div class="box-card-header">
          <div class="box-card-title">
            <i class="fa-solid fa-box-archive ${isSelectedBox ? 'text-cyan' : ''}"></i>
            <span style="${isSelectedBox ? 'color: var(--primary-cyan); font-weight: 700;' : ''}">${escapeHtml(boxName)} ${isSelectedBox ? '★ (Selected)' : ''}</span>
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button class="icon-btn delete-btn" onclick="event.stopPropagation(); deleteStorageBox('${safeBoxName}')" title="Delete Storage Box '${safeBoxName}'">
              <i class="fa-solid fa-trash-can"></i>
            </button>
            <span class="btn-text" style="font-size: 11px;"><i class="fa-solid fa-expand"></i> Open</span>
          </div>
        </div>
        
        <div class="box-card-stats">
          <span class="box-stat-pill text-purple"><i class="fa-solid fa-layer-group"></i> ${items.length} Items</span>
          <span class="box-stat-pill text-emerald"><i class="fa-solid fa-cubes"></i> ${totalUnits} Total Units</span>
        </div>

        <div class="box-items-preview" style="max-height: 180px; overflow-y: auto; padding-right: 2px;">
          ${itemRowsHtml}
        </div>
      </div>

      <div class="box-card-footer">
        <button class="btn-add-to-box" onclick="event.stopPropagation(); openAddModalForBox('${safeBoxName}')">
          <i class="fa-solid fa-plus-circle"></i> Add Item
        </button>
        <button class="icon-btn" onclick="event.stopPropagation(); openQrModal('${safeBoxName}')" title="Print/Download QR Code Label for ${safeBoxName}">
          <i class="fa-solid fa-qrcode"></i>
        </button>
        <button class="icon-btn" onclick="event.stopPropagation(); openBoxDetailModal('${safeBoxName}')" title="View Full Box Contents">
          <i class="fa-solid fa-folder-open"></i>
        </button>
      </div>
    `;

    fragment.appendChild(boxCard);
  });

  boxesContainer.appendChild(fragment);
}

window.resetAllFilters = function() {
  document.getElementById("searchInput").value = "";
  document.getElementById("categoryFilter").value = "ALL";
  document.getElementById("boxFilter").value = "ALL";
  activeStatusFilter = "ALL";
  updateStatusPillsUI();
  renderCurrentView();
};

// STORAGE BOX DETAIL MODAL LOGIC
window.openBoxDetailModal = function(boxName) {
  activeDetailBoxName = boxName;

  // Update browser URL query parameter to short ?b=
  try {
    const newUrl = window.location.pathname + '?b=' + encodeURIComponent(boxName);
    window.history.pushState({ box: boxName }, '', newUrl);
  } catch (e) {}

  const items = currentItems.filter(i => i.box === boxName);
  const totalUnits = items.reduce((sum, i) => sum + i.qty, 0);

  document.getElementById("boxDetailModalTitle").innerHTML = `<i class="fa-solid fa-box-archive text-purple"></i> Box: <span style="color: var(--primary-cyan); font-family: 'JetBrains Mono';">${escapeHtml(boxName)}</span>`;

  document.getElementById("boxDetailSummary").innerHTML = `
    <div><strong>Storage Location:</strong> <span class="box-tag"><i class="fa-solid fa-box-archive"></i> ${escapeHtml(boxName)}</span></div>
    <div><strong>Component Types:</strong> ${items.length} Types</div>
    <div><strong>Total Stock Quantity:</strong> <span class="text-emerald" style="font-weight: 700;">${totalUnits} Units</span></div>
  `;

  renderBoxDetailTable(items);
  document.getElementById("boxDetailModal").classList.remove("hidden");
};

function renderBoxDetailTable(items) {
  const tbody = document.getElementById("boxDetailTableBody");
  tbody.innerHTML = "";

  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">No components stored in this box yet. Click "Add Component to this Box" to add items.</td></tr>`;
    return;
  }

  items.forEach(item => {
    const tr = document.createElement("tr");
    const statusBadgeHtml = getStatusBadgeHtml(item.qty);

    tr.innerHTML = `
      <td>${statusBadgeHtml}</td>
      <td><strong style="color: var(--text-main); font-size: 13px;">${escapeHtml(item.name)}</strong></td>
      <td><span class="category-tag">${escapeHtml(item.category)}</span></td>
      <td style="text-align: center;"><span class="qty-badge ${getQtyClass(item.qty)}">${item.qty}</span></td>
      <td style="text-align: center;">
        <div class="qty-adjuster">
          <button class="adjust-btn" onclick="adjustQtyInBoxModal('${item.id}', -1)" title="Decrease Stock"><i class="fa-solid fa-minus"></i></button>
          <span class="adjust-num">${item.qty}</span>
          <button class="adjust-btn" onclick="adjustQtyInBoxModal('${item.id}', 1)" title="Increase Stock"><i class="fa-solid fa-plus"></i></button>
        </div>
      </td>
      <td style="text-align: center;">
        <div class="action-btns">
          <button class="icon-btn" onclick="closeBoxDetailModal(); openEditModal('${item.id}');" title="Edit Component"><i class="fa-solid fa-pen"></i></button>
          <button class="icon-btn delete-btn" onclick="deleteItemInBoxModal('${item.id}')" title="Delete Component"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.adjustQtyInBoxModal = function(id, delta) {
  adjustQty(id, delta);
  if (activeDetailBoxName) {
    const items = currentItems.filter(i => i.box === activeDetailBoxName);
    renderBoxDetailTable(items);
  }
};

window.deleteItemInBoxModal = function(id) {
  deleteItem(id);
  if (activeDetailBoxName) {
    const items = currentItems.filter(i => i.box === activeDetailBoxName);
    renderBoxDetailTable(items);
  }
};

function closeBoxDetailModal() {
  document.getElementById("boxDetailModal").classList.add("hidden");
  try {
    window.history.pushState({}, '', window.location.pathname);
  } catch (e) {}
}

// QR CODE & BOX STICKER LABEL LOGIC
let activeQrBoxName = "";

window.openQrModal = function(boxName) {
  if (!boxName) return;
  activeQrBoxName = boxName;
  const items = currentItems.filter(i => i.box === boxName);
  const totalUnits = items.reduce((sum, i) => sum + i.qty, 0);

  document.getElementById("qrStickerBoxName").textContent = boxName;
  document.getElementById("qrStickerCount").textContent = `${items.length} Component Types (${totalUnits} Total Units)`;
  
  // Short URL for simplified, high-readability QR code
  const boxUrl = `${window.location.origin}${window.location.pathname}?b=${encodeURIComponent(boxName)}`;
  const linkInput = document.getElementById("qrDirectLinkInput");
  if (linkInput) linkInput.value = boxUrl;

  const container = document.getElementById("qrCanvasContainer");
  container.innerHTML = "";

  try {
    if (typeof QRCode !== "undefined") {
      new QRCode(container, {
        text: boxUrl,
        width: 175,
        height: 175,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M // Level M makes big, clean, easily-scannable square pixels!
      });
    } else {
      container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=175x175&data=${encodeURIComponent(boxUrl)}&ecc=M" alt="QR Code" style="width: 175px; height: 175px;">`;
    }
  } catch (errQr) {
    container.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=175x175&data=${encodeURIComponent(boxUrl)}&ecc=M" alt="QR Code" style="width: 175px; height: 175px;">`;
  }

  document.getElementById("qrModal").classList.remove("hidden");
};

function closeQrModal() {
  document.getElementById("qrModal").classList.add("hidden");
}

function copyQrLink() {
  const linkInput = document.getElementById("qrDirectLinkInput");
  if (linkInput) {
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value).then(() => {
      showToast("Box direct URL copied to clipboard!", "success");
    }).catch(() => {
      showToast("Failed to copy link", "error");
    });
  }
}

function printQrSticker() {
  window.print();
}

function downloadQrPng() {
  const container = document.getElementById("qrCanvasContainer");
  const canvas = container.querySelector("canvas");
  const img = container.querySelector("img");

  let dataUrl = "";
  if (canvas) {
    dataUrl = canvas.toDataURL("image/png");
  } else if (img && img.src) {
    dataUrl = img.src;
  }

  if (dataUrl) {
    const a = document.createElement("a");
    a.href = dataUrl;
    const safeName = activeQrBoxName.replace(/[^a-zA-Z0-9_-]/g, "_");
    a.download = `QR_LABEL_${safeName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloaded QR code for "${activeQrBoxName}"`, "success");
  } else {
    showToast("QR image not ready yet", "info");
  }
}

// DELETE STORAGE BOX WITH CONFIRMATION
window.deleteStorageBox = function(boxName) {
  if (!boxName) return;

  const boxItems = currentItems.filter(i => i.box === boxName);
  const itemCount = boxItems.length;

  const confirmMsg = itemCount > 0
    ? `⚠️ DELETE BOX CONFIRMATION\n\nAre you sure you want to delete Storage Box "${boxName}" and ALL ${itemCount} component(s) inside it?\n\nThis will remove the box and sync deletion to Google Sheet. This action cannot be undone!`
    : `⚠️ DELETE BOX CONFIRMATION\n\nAre you sure you want to delete empty Storage Box "${boxName}"?`;

  if (confirm(confirmMsg)) {
    // Sync deletion for all items inside this box
    boxItems.forEach(item => {
      syncItemToGoogleSheet("DELETE_ITEM", { name: item.name });
    });

    currentItems = currentItems.filter(i => i.box !== boxName);
    saveCustomEdits();

    closeBoxDetailModal();
    refreshDashboardUI();
    showToast(`Deleted Storage Box "${boxName}" and its items!`, "info");
  }
};

window.openAddModalForBox = function(boxName) {
  openAddModal();
  document.getElementById("formBox").value = boxName;
  setTimeout(() => document.getElementById("formItemName").focus(), 100);
  showToast(`Adding component to "${boxName}"`, "info");
};

window.filterByBox = function(boxName) {
  document.getElementById("boxFilter").value = boxName;
  setView("table");
};

// 1. RENDER TABLE VIEW
function renderTableView(items) {
  const tbody = document.getElementById("tableBody");
  const emptyState = document.getElementById("emptyState");
  tbody.innerHTML = "";

  if (items.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const tr = document.createElement("tr");
    const statusBadgeHtml = getStatusBadgeHtml(item.qty);
    const safeBoxName = escapeHtml(item.box).replace(/'/g, "\\'");

    tr.innerHTML = `
      <td>${statusBadgeHtml}</td>
      <td>
        <div class="item-title">
          <span>${escapeHtml(item.name)}</span>
        </div>
      </td>
      <td><span class="category-tag">${escapeHtml(item.category)}</span></td>
      <td>
        <span class="box-tag" onclick="openBoxDetailModal('${safeBoxName}')" title="Click to view all items inside ${safeBoxName}">
          <i class="fa-solid fa-box-archive"></i> ${escapeHtml(item.box)}
        </span>
      </td>
      <td style="text-align: center;">
        <span class="qty-badge ${getQtyClass(item.qty)}">${item.qty}</span>
      </td>
      <td style="text-align: center;">
        <div class="qty-adjuster">
          <button class="adjust-btn" onclick="adjustQty('${item.id}', -1)" title="Decrease Stock"><i class="fa-solid fa-minus"></i></button>
          <span class="adjust-num">${item.qty}</span>
          <button class="adjust-btn" onclick="adjustQty('${item.id}', 1)" title="Increase Stock"><i class="fa-solid fa-plus"></i></button>
        </div>
      </td>
      <td style="text-align: center;">
        <div class="action-btns">
          <button class="icon-btn" onclick="openEditModal('${item.id}')" title="Edit Component"><i class="fa-solid fa-pen"></i></button>
          <button class="icon-btn delete-btn" onclick="deleteItem('${item.id}')" title="Delete Component"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </td>
    `;
    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment);
}

// 2. RENDER GRID CARD VIEW
function renderGridView(items) {
  const gridContainer = document.getElementById("cardsGrid");
  const emptyState = document.getElementById("emptyState");
  gridContainer.innerHTML = "";

  if (items.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  } else {
    emptyState.classList.add("hidden");
  }

  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "component-card";
    const statusBadgeHtml = getStatusBadgeHtml(item.qty);
    const safeBoxName = escapeHtml(item.box).replace(/'/g, "\\'");

    card.innerHTML = `
      <div>
        <div class="card-top">
          ${statusBadgeHtml}
          <div class="action-btns">
            <button class="icon-btn" onclick="openEditModal('${item.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="icon-btn delete-btn" onclick="deleteItem('${item.id}')"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
        <h3 class="card-title">${escapeHtml(item.name)}</h3>
        <div class="card-meta">
          <span class="category-tag">${escapeHtml(item.category)}</span>
          <span class="box-tag" onclick="openBoxDetailModal('${safeBoxName}')" title="Click to view all items inside ${safeBoxName}">
            <i class="fa-solid fa-box-archive"></i> ${escapeHtml(item.box)}
          </span>
        </div>
      </div>
      <div class="card-bottom">
        <div>
          <span style="font-size: 11px; color: var(--text-dim);">Quantity:</span>
          <span class="qty-badge ${getQtyClass(item.qty)}" style="display: block; margin-top: 2px;">${item.qty} Units</span>
        </div>
        <div class="qty-adjuster">
          <button class="adjust-btn" onclick="adjustQty('${item.id}', -1)"><i class="fa-solid fa-minus"></i></button>
          <span class="adjust-num">${item.qty}</span>
          <button class="adjust-btn" onclick="adjustQty('${item.id}', 1)"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });

  gridContainer.appendChild(fragment);
}

// 3. RENDER ANALYTICS VIEW & CHARTS
function renderAnalyticsView() {
  // Build Category Stock Chart
  const categoryTotals = {};
  currentItems.forEach(i => {
    categoryTotals[i.category] = (categoryTotals[i.category] || 0) + i.qty;
  });

  const catLabels = Object.keys(categoryTotals);
  const catData = Object.values(categoryTotals);

  const ctxCat = document.getElementById("categoryChart").getContext("2d");
  if (categoryChartInstance) categoryChartInstance.destroy();

  categoryChartInstance = new Chart(ctxCat, {
    type: 'doughnut',
    data: {
      labels: catLabels,
      datasets: [{
        data: catData,
        backgroundColor: [
          '#00f2fe', '#10b981', '#f59e0b', '#a855f7', '#3b82f6',
          '#f43f5e', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } }
      }
    }
  });

  // Build Top Storage Boxes Chart
  const boxCounts = {};
  currentItems.forEach(i => {
    boxCounts[i.box] = (boxCounts[i.box] || 0) + 1;
  });

  const sortedBoxes = Object.entries(boxCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const boxLabels = sortedBoxes.map(b => b[0]);
  const boxData = sortedBoxes.map(b => b[1]);

  const ctxBox = document.getElementById("boxChart").getContext("2d");
  if (boxChartInstance) boxChartInstance.destroy();

  boxChartInstance = new Chart(ctxBox, {
    type: 'bar',
    data: {
      labels: boxLabels,
      datasets: [{
        label: 'Distinct Items Count',
        data: boxData,
        backgroundColor: 'rgba(0, 242, 254, 0.6)',
        borderColor: '#00f2fe',
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      },
      plugins: { legend: { display: false } }
    }
  });

  // Build Critical Restock List
  const restockContainer = document.getElementById("restockListContainer");
  restockContainer.innerHTML = "";

  const restockItems = currentItems.filter(i => i.qty <= 5).sort((a, b) => a.qty - b.qty);

  if (restockItems.length === 0) {
    restockContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; color: var(--accent-emerald);">
        <i class="fa-solid fa-circle-check" style="font-size: 28px; margin-bottom: 8px;"></i>
        <p>All component stock levels are healthy! No restock required right now.</p>
      </div>
    `;
    return;
  }

  restockItems.forEach(item => {
    const el = document.createElement("div");
    el.className = "restock-item";
    const statusBadgeHtml = getStatusBadgeHtml(item.qty);

    el.innerHTML = `
      <div class="restock-info">
        <span class="restock-name">${escapeHtml(item.name)}</span>
        <span class="restock-sub">${escapeHtml(item.category)} &bull; ${escapeHtml(item.box)}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        ${statusBadgeHtml}
        <div class="qty-adjuster">
          <button class="adjust-btn" onclick="adjustQty('${item.id}', 1)"><i class="fa-solid fa-plus"></i> Restock</button>
        </div>
      </div>
    `;
    restockContainer.appendChild(el);
  });
}

// HELPERS
function getStatusBadgeHtml(qty) {
  if (qty === 0) {
    return `<span class="badge badge-rose"><span class="status-dot" style="background: var(--accent-rose);"></span> Out of Stock</span>`;
  } else if (qty <= 5) {
    return `<span class="badge badge-amber"><span class="status-dot" style="background: var(--accent-amber);"></span> Low Stock</span>`;
  } else {
    return `<span class="badge badge-emerald"><span class="status-dot" style="background: var(--accent-emerald);"></span> In Stock</span>`;
  }
}

function getQtyClass(qty) {
  if (qty === 0) return "out-of-stock";
  if (qty <= 5) return "low-stock";
  return "in-stock";
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// QUICK QUANTITY ADJUSTMENT
window.adjustQty = function(id, delta) {
  const item = currentItems.find(i => i.id === id);
  if (!item) return;

  const oldQty = item.qty;
  item.qty = Math.max(0, item.qty + delta);

  if (oldQty !== item.qty) {
    saveCustomEdits();
    refreshDashboardUI();
    showToast(`Updated "${item.name}" stock to ${item.qty}`, "success");
    syncItemToGoogleSheet("UPDATE_QTY", {
      name: item.name,
      box: item.box,
      category: item.category,
      qty: item.qty
    });
  }
};

// ADD / EDIT COMPONENT MODAL LOGIC
window.openEditModal = function(id) {
  const item = currentItems.find(i => i.id === id);
  if (!item) return;

  document.getElementById("itemModalTitle").innerHTML = `<i class="fa-solid fa-pen"></i> Edit Component`;
  document.getElementById("editItemId").value = item.id;
  document.getElementById("formItemName").value = item.name;
  document.getElementById("formCategory").value = item.category;
  document.getElementById("formBox").value = item.box;
  document.getElementById("formQuantity").value = item.qty;

  document.getElementById("itemModal").classList.remove("hidden");
};

function openAddModal() {
  document.getElementById("itemModalTitle").innerHTML = `<i class="fa-solid fa-plus-circle"></i> Add New Component`;
  document.getElementById("itemForm").reset();
  document.getElementById("editItemId").value = "";
  document.getElementById("itemModal").classList.remove("hidden");
}

function closeItemModal() {
  document.getElementById("itemModal").classList.add("hidden");
}

function saveItemForm(e) {
  e.preventDefault();

  const editId = document.getElementById("editItemId").value;
  const name = document.getElementById("formItemName").value.trim();
  const category = document.getElementById("formCategory").value.trim() || "General";
  const box = document.getElementById("formBox").value.trim() || "General Box";
  const qty = parseInt(document.getElementById("formQuantity").value, 10) || 0;

  if (!name) {
    showToast("Please enter a component name", "error");
    return;
  }

  if (editId) {
    // Edit existing item
    const item = currentItems.find(i => i.id === editId);
    if (item) {
      const oldName = item.name;
      item.name = name;
      item.category = category;
      item.box = box;
      item.qty = qty;
      showToast(`Updated component "${name}"`, "success");
      syncItemToGoogleSheet("EDIT_ITEM", {
        oldName,
        name,
        category,
        box,
        qty
      });
    }
  } else {
    // Add new item
    const newItem = {
      id: `item_${Date.now()}`,
      name,
      category,
      box,
      qty
    };
    currentItems.unshift(newItem);
    showToast(`Added new component "${name}"`, "success");
    syncItemToGoogleSheet("ADD_ITEM", {
      name,
      category,
      box,
      qty
    });
  }

  saveCustomEdits();
  closeItemModal();
  refreshDashboardUI();
}

window.deleteItem = function(id) {
  const item = currentItems.find(i => i.id === id);
  if (!item) return;

  if (confirm(`Are you sure you want to delete component "${item.name}"?`)) {
    const deletedName = item.name;
    currentItems = currentItems.filter(i => i.id !== id);
    saveCustomEdits();
    refreshDashboardUI();
    showToast(`Deleted component "${deletedName}"`, "info");
    syncItemToGoogleSheet("DELETE_ITEM", { name: deletedName });
  }
};

// GOOGLE SHEET MODAL LOGIC
function openSheetModal() {
  document.getElementById("sheetUrlModal").classList.remove("hidden");
}
function closeSheetModal() {
  document.getElementById("sheetUrlModal").classList.add("hidden");
}
function saveSheetUrlConfig() {
  const newUrl = document.getElementById("inputSheetUrl").value.trim();
  const newScriptUrl = document.getElementById("inputScriptUrl").value.trim();

  if (!newUrl && !newScriptUrl) {
    showToast("Please enter a valid Google Sheet URL or Script URL", "error");
    return;
  }

  if (newUrl) activeSheetUrl = newUrl;
  activeScriptUrl = newScriptUrl;

  localStorage.setItem(STORAGE_KEY_URL, activeSheetUrl);
  localStorage.setItem(STORAGE_KEY_SCRIPT_URL, activeScriptUrl);

  updateSheetUrlDisplay();
  closeSheetModal();

  if (activeScriptUrl) {
    showToast("Google Apps Script 2-Way Auto Sync Enabled!", "success");
  }

  fetchOrLoadStockData(true);
}

// EXPORT MODAL LOGIC
function openExportModal() {
  const csvContent = generateCsvText();
  document.getElementById("csvPreviewText").value = csvContent;
  document.getElementById("exportModal").classList.remove("hidden");
}
function closeExportModal() {
  document.getElementById("exportModal").classList.add("hidden");
}

function generateCsvText() {
  const headers = ["Storage Box", "Category", "Component Name", "Quantity"];
  const rows = currentItems.map(i => [
    `"${i.box.replace(/"/g, '""')}"`,
    `"${i.category.replace(/"/g, '""')}"`,
    `"${i.name.replace(/"/g, '""')}"`,
    i.qty
  ]);
  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
}

function downloadCsvFile() {
  const csvText = generateCsvText();
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Components_Stock_Report_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("CSV file downloaded!", "success");
}

function copyTsvToClipboard() {
  const rows = currentItems.map(i => `${i.box}\t${i.category}\t${i.name}\t${i.qty}`);
  const tsvText = ["Storage Box\tCategory\tComponent Name\tQuantity", ...rows].join("\n");

  navigator.clipboard.writeText(tsvText).then(() => {
    showToast("TSV copied! You can paste directly into Google Sheets.", "success");
  }).catch(() => {
    showToast("Failed to copy TSV to clipboard", "error");
  });
}

// EVENT LISTENERS SETUP
function setupEventListeners() {
  // Sync button
  document.getElementById("btnSyncNow").addEventListener("click", () => fetchOrLoadStockData(true));
  document.getElementById("btnOpenSheetUrl").addEventListener("click", openSheetModal);
  document.getElementById("btnChangeSheetQuick").addEventListener("click", openSheetModal);
  document.getElementById("btnSaveSheetUrl").addEventListener("click", saveSheetUrlConfig);
  document.getElementById("btnCloseSheetModal").addEventListener("click", closeSheetModal);
  document.getElementById("btnCancelSheetModal").addEventListener("click", closeSheetModal);

  // Add Item
  document.getElementById("btnAddItem").addEventListener("click", openAddModal);
  document.getElementById("btnCloseItemModal").addEventListener("click", closeItemModal);
  document.getElementById("btnCancelItemModal").addEventListener("click", closeItemModal);
  document.getElementById("btnSaveItem").addEventListener("click", saveItemForm);

  // Export
  document.getElementById("btnExport").addEventListener("click", openExportModal);
  document.getElementById("btnCloseExportModal").addEventListener("click", closeExportModal);
  document.getElementById("btnDoneExport").addEventListener("click", closeExportModal);
  document.getElementById("btnDownloadCSV").addEventListener("click", downloadCsvFile);
  document.getElementById("btnCopyTSV").addEventListener("click", copyTsvToClipboard);

  // Theme Toggle
  const btnTheme = document.getElementById("btnToggleTheme");
  if (btnTheme) btnTheme.addEventListener("click", toggleTheme);

  // Security Lock
  const btnLock = document.getElementById("btnLockApp");
  if (btnLock) btnLock.addEventListener("click", lockDashboard);

  // Filters & Search
  document.getElementById("searchInput").addEventListener("input", renderCurrentView);
  document.getElementById("btnClearSearch").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    renderCurrentView();
  });

  document.getElementById("categoryFilter").addEventListener("change", renderCurrentView);
  document.getElementById("boxFilter").addEventListener("change", renderCurrentView);
  document.getElementById("sortSelect").addEventListener("change", renderCurrentView);

  document.getElementById("btnResetFilters").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "ALL";
    document.getElementById("boxFilter").value = "ALL";
    activeStatusFilter = "ALL";
    updateStatusPillsUI();
    renderCurrentView();
  });

  // Metric cards quick click filters
  document.getElementById("cardFilterOutOfStock").addEventListener("click", () => {
    activeStatusFilter = "OUT";
    updateStatusPillsUI();
    renderCurrentView();
  });

  document.getElementById("cardFilterLowStock").addEventListener("click", () => {
    activeStatusFilter = "LOW";
    updateStatusPillsUI();
    renderCurrentView();
  });

  document.getElementById("cardFilterBoxes").addEventListener("click", () => {
    setView("boxes");
  });

  const btnCreateBox = document.getElementById("btnCreateNewBox");
  if (btnCreateBox) {
    btnCreateBox.addEventListener("click", () => {
      openAddModal();
      document.getElementById("formBox").focus();
    });
  }

  // Status Pills
  document.querySelectorAll(".status-pill").forEach(pill => {
    pill.addEventListener("click", (e) => {
      activeStatusFilter = e.currentTarget.getAttribute("data-status");
      updateStatusPillsUI();
      renderCurrentView();
    });
  });

  // Box Detail Modal
  const btnCloseDetail = document.getElementById("btnCloseBoxDetailModal");
  const btnCloseDetailBtn = document.getElementById("btnCloseBoxDetailModalBtn");
  const btnDetailAddItem = document.getElementById("btnBoxDetailAddItem");
  const btnDetailDeleteBox = document.getElementById("btnBoxDetailDeleteBox");
  const btnDetailQR = document.getElementById("btnBoxDetailQR");

  if (btnCloseDetail) btnCloseDetail.addEventListener("click", closeBoxDetailModal);
  if (btnCloseDetailBtn) btnCloseDetailBtn.addEventListener("click", closeBoxDetailModal);
  if (btnDetailAddItem) {
    btnDetailAddItem.addEventListener("click", () => {
      const boxToUse = activeDetailBoxName;
      closeBoxDetailModal();
      openAddModalForBox(boxToUse);
    });
  }
  if (btnDetailQR) {
    btnDetailQR.addEventListener("click", () => {
      openQrModal(activeDetailBoxName);
    });
  }
  if (btnDetailDeleteBox) {
    btnDetailDeleteBox.addEventListener("click", () => {
      deleteStorageBox(activeDetailBoxName);
    });
  }

  // QR Modal Listeners
  const btnCloseQr = document.getElementById("btnCloseQrModal");
  const btnCloseQrBtn = document.getElementById("btnCloseQrModalBtn");
  const btnCopyQr = document.getElementById("btnCopyQrLink");
  const btnPrintQr = document.getElementById("btnPrintQrSticker");
  const btnDownloadQr = document.getElementById("btnDownloadQrPng");

  if (btnCloseQr) btnCloseQr.addEventListener("click", closeQrModal);
  if (btnCloseQrBtn) btnCloseQrBtn.addEventListener("click", closeQrModal);
  if (btnCopyQr) btnCopyQr.addEventListener("click", copyQrLink);
  if (btnPrintQr) btnPrintQr.addEventListener("click", printQrSticker);
  if (btnDownloadQr) btnDownloadQr.addEventListener("click", downloadQrPng);

  // Handle Browser Back / Forward URL changes
  window.addEventListener("popstate", () => {
    checkUrlParamsForBox();
  });

  // View Switcher
  document.getElementById("btnViewTable").addEventListener("click", () => setView("table"));
  document.getElementById("btnViewGrid").addEventListener("click", () => setView("grid"));
  document.getElementById("btnViewBoxes").addEventListener("click", () => setView("boxes"));
  document.getElementById("btnViewAnalytics").addEventListener("click", () => setView("analytics"));
}

function updateStatusPillsUI() {
  document.querySelectorAll(".status-pill").forEach(pill => {
    if (pill.getAttribute("data-status") === activeStatusFilter) {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });
}

function setView(viewName) {
  activeView = viewName;

  document.getElementById("btnViewTable").classList.toggle("active", viewName === "table");
  document.getElementById("btnViewGrid").classList.toggle("active", viewName === "grid");
  document.getElementById("btnViewBoxes").classList.toggle("active", viewName === "boxes");
  document.getElementById("btnViewAnalytics").classList.toggle("active", viewName === "analytics");

  document.getElementById("tableViewSection").classList.toggle("hidden", viewName !== "table");
  document.getElementById("gridViewSection").classList.toggle("hidden", viewName !== "grid");
  document.getElementById("boxesViewSection").classList.toggle("hidden", viewName !== "boxes");
  document.getElementById("analyticsViewSection").classList.toggle("hidden", viewName !== "analytics");

  renderCurrentView();
}

// SYNC STATUS UI INDICATOR
function setSyncStatus(type, text, time = "") {
  const badge = document.getElementById("syncStatusBadge");
  const dot = badge.querySelector(".status-dot");
  const textEl = document.getElementById("syncStatusText");
  const timeEl = document.getElementById("lastSyncTime");

  textEl.textContent = text;
  if (time) timeEl.textContent = time;

  if (type === "syncing") {
    dot.className = "status-dot syncing-amber";
  } else {
    dot.className = "status-dot pulsing-green";
  }
}

// TOAST NOTIFICATION SYSTEM
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let iconClass = "fa-circle-info";
  if (type === "success") iconClass = "fa-circle-check";
  if (type === "error") iconClass = "fa-circle-exclamation";

  toast.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

const DEVICES_DATA = {
  "DRV COOL": {
    "name": "DRV COOL",
    "description": "Nagrzewnica/ch\u0142odnica wodna",
    "group_priority": 12,
    "input_registers": [
      {
        "offset": 5,
        "name": "T4"
      },
      {
        "offset": 6,
        "name": "FanEff"
      },
      {
        "offset": 7,
        "name": "AntifreezeState"
      },
      {
        "offset": 10,
        "name": "FuseState"
      },
      {
        "offset": 11,
        "name": "ValveState"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_DEF \u2014 warto\u015b\u0107 domy\u015blna po resecie zasilania",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HT_AUTO \u2014 automatyczne grzanie",
          "3": "WM_HT_MANUAL \u2014 r\u0119czne grzanie",
          "4": "WM_COOL_AUTO \u2014 automatyczne ch\u0142odzenie",
          "5": "WM_COOL_MANUAL \u2014 r\u0119czne ch\u0142odzenie",
          "6": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON \u2014 w\u0142\u0105czony",
          "2": "WM_OFF \u2014 wy\u0142\u0105czony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 10,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS \u2014 tylko odczyt",
          "1": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus (TLeadVal)",
          "3": "TSL_T4 \u2014 czujnik T4 (powietrze przed wymiennikiem wodnym)"
        }
      },
      {
        "offset": 15,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Minimalna wydajno\u015b\u0107 wentylatora w trybie AUTO. AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1, 34\u201366=bieg 2, 67\u2013100=bieg 3"
      },
      {
        "offset": 16,
        "name": "ModeAuto_FanEffRefMax",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Maksymalna wydajno\u015b\u0107 wentylatora w trybie AUTO. AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1, 34\u201366=bieg 2, 67\u2013100=bieg 3"
      },
      {
        "offset": 17,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wydajno\u015b\u0107 wentylatora po osi\u0105gni\u0119ciu temperatury docelowej w trybie MANUAL. AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1, 34\u201366=bieg 2, 67\u2013100=bieg 3"
      }
    ],
    "holding_registers_group": []
  },
  "DRV CUBE": {
    "name": "DRV CUBE",
    "description": "Jednostka wentylacyjna CUBE z dyfuzorem wirowym i czujnikiem CO2",
    "group_priority": 13,
    "input_registers": [
      {
        "offset": 9,
        "name": "ambient_temp_value"
      },
      {
        "offset": 10,
        "name": "supply_temp_value"
      },
      {
        "offset": 11,
        "name": "return_temp_value"
      },
      {
        "offset": 12,
        "name": "water_temp_value"
      },
      {
        "offset": 13,
        "name": "recirculation_damper_level"
      },
      {
        "offset": 14,
        "name": "swirl_diffuser_position"
      },
      {
        "offset": 16,
        "name": "rotary_level"
      },
      {
        "offset": 17,
        "name": "fan_supply_flow"
      },
      {
        "offset": 18,
        "name": "gas_heating_value"
      },
      {
        "offset": 19,
        "name": "CO2_status"
      },
      {
        "offset": 20,
        "name": "Rooftop_work_mode"
      },
      {
        "offset": 21,
        "name": "Rooftop_current_work_mode"
      },
      {
        "offset": 22,
        "name": "Alarm"
      },
      {
        "offset": 23,
        "name": "room_temp_sensor_status"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_ON \u2014 urz\u0105dzenie w\u0142\u0105czone",
          "3": "WM_THERM \u2014 tryb termostatyczny"
        },
        "description": "Rejestr 16-bit: MSB ignorowany, LSB = tryb pracy"
      },
      {
        "offset": 5,
        "name": "fan_eff",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajno\u015bci wentylatora EC, p\u0142ynna regulacja 0\u2013100%"
      },
      {
        "offset": 6,
        "name": "fan_eff_CO2_I",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajno\u015bci wentylatora EC dla 1. progu czujnika CO2"
      },
      {
        "offset": 7,
        "name": "fan_eff_CO2_II",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajno\u015bci wentylatora EC dla 2. progu czujnika CO2"
      },
      {
        "offset": 8,
        "name": "recirculation_mode",
        "values": {
          "0": "RM_AUTO \u2014 tryb automatyczny",
          "1": "RM_MANUAL \u2014 tryb r\u0119czny"
        },
        "description": "Rejestr 16-bit: MSB ignorowany, LSB = tryb recyrkulacji"
      },
      {
        "offset": 9,
        "name": "recirculation_value",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Warto\u015b\u0107 recyrkulacji, p\u0142ynna regulacja 0\u2013100%"
      },
      {
        "offset": 10,
        "name": "recirculation_value_CO2_I",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Warto\u015b\u0107 recyrkulacji dla 1. progu czujnika CO2"
      },
      {
        "offset": 11,
        "name": "recirculation_value_CO2_II",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Warto\u015b\u0107 recyrkulacji dla 2. progu czujnika CO2"
      },
      {
        "offset": 12,
        "name": "work_mode_NW",
        "values": {
          "0": "WM_NW_AUTO \u2014 tryb automatyczny dyfuzora",
          "1": "WM_NW_MANUAL \u2014 tryb r\u0119czny dyfuzora"
        },
        "description": "Tryb pracy dyfuzora wirowego (NW). Rejestr 16-bit: MSB ignorowany, LSB = tryb"
      },
      {
        "offset": 13,
        "name": "swirl_diffuser_level",
        "min": 30,
        "max": 100,
        "unit": "%",
        "description": "Poziom otwarcia dyfuzora wirowego"
      },
      {
        "offset": 14,
        "name": "Htg_swirl_diffuser_level",
        "min": 30,
        "max": 100,
        "unit": "%",
        "description": "Poziom otwarcia dyfuzora wirowego w trybie grzania"
      },
      {
        "offset": 15,
        "name": "Clg_swirl_diffuser_level",
        "min": 30,
        "max": 100,
        "unit": "%",
        "description": "Poziom otwarcia dyfuzora wirowego w trybie ch\u0142odzenia"
      },
      {
        "offset": 16,
        "name": "temperature_ref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1",
        "description": "Docelowa temperatura pomieszczenia"
      },
      {
        "offset": 17,
        "name": "temperature_room",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1",
        "description": "Temperatura pomieszczenia przekazywana do urz\u0105dzenia przez Modbus"
      },
      {
        "offset": 18,
        "name": "room_sensor_selection",
        "values": {
          "1": "TSL_PREFERRED_TLEAD \u2014 warto\u015b\u0107 przez Modbus (gdy lokalny czujnik CUBE jest aktywny)",
          "2": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus (tylko gdy lokalny czujnik CUBE jest wy\u0142\u0105czony)",
          "3": "TSL_PREFERRED_LOCAL \u2014 czujnik lokalny CUBE (gdy jest aktywny)"
        },
        "description": "Wyb\u00f3r \u017ar\u00f3d\u0142a temperatury pomieszczenia"
      },
      {
        "offset": 19,
        "name": "CO2_status",
        "values": {
          "0": "CO2_STAT_OK \u2014 status CO2 OK",
          "1": "CO2_STAT_L1 \u2014 poziom CO2 pr\u00f3g 1",
          "2": "CO2_STAT_L2 \u2014 poziom CO2 pr\u00f3g 2"
        },
        "description": "Status CO2 zapisywany przez T-box do urz\u0105dzenia. Rejestr 16-bit: MSB ignorowany, LSB = status"
      },
      {
        "offset": 20,
        "name": "CO2_source",
        "values": {
          "0": "CO2_SOURCE_LOCAL \u2014 lokalny czujnik CO2 w CUBE",
          "1": "CO2_SOURCE_TBOX \u2014 \u017ar\u00f3d\u0142o CO2 z T-box"
        },
        "description": "Wyb\u00f3r \u017ar\u00f3d\u0142a danych CO2. Rejestr 16-bit: MSB ignorowany, LSB = \u017ar\u00f3d\u0142o"
      }
    ],
    "holding_registers_group": []
  },
  "DRV D": {
    "name": "DRV D",
    "description": "Nagrzewnica wodna (wariant D)",
    "group_priority": 7,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3"
      },
      {
        "offset": 5,
        "name": "T4"
      },
      {
        "offset": 6,
        "name": "FanEff"
      },
      {
        "offset": 7,
        "name": "DestStatus"
      },
      {
        "offset": 8,
        "name": "FuseState"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "1": "WM_OFF \u2014 odszranianie wy\u0142\u0105czone",
          "2": "WM_AUTO_DEPEND \u2014 AUTO zale\u017cny od trybu pracy",
          "3": "WM_AUTO_INDEPEND \u2014 AUTO niezale\u017cny",
          "4": "WM_MANUAL \u2014 tryb r\u0119czny"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 7,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 8,
        "name": "TLeadSensorSelect",
        "values": {
          "1": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus (TLeadVal)",
          "3": "TSL_T4 \u2014 czujnik T4 (z\u0142\u0105cze DRV)"
        }
      },
      {
        "offset": 10,
        "name": "DestTempRef",
        "min": 0,
        "max": 100,
        "unit": "K\u00d70.1",
        "description": "Pr\u00f3g odszraniania: warunek DestTempRef > Td \u2212 Tm (Td=T3 sufit, Tm=czujnik prowadz\u0105cy)"
      },
      {
        "offset": 11,
        "name": "WorkModeTempRef",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1",
        "description": "Docelowa temperatura przy suficie w trybie r\u0119cznym; warunek: WorkModeTempRef > czujnik prowadz\u0105cy"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "1": "WM_OFF \u2014 odszranianie wy\u0142\u0105czone",
          "2": "WM_AUTO_DEPEND \u2014 AUTO zale\u017cny od trybu pracy",
          "3": "WM_AUTO_INDEPEND \u2014 AUTO niezale\u017cny",
          "4": "WM_MANUAL \u2014 tryb r\u0119czny"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "DestTempRef",
        "min": 0,
        "max": 100,
        "unit": "K\u00d70.1",
        "description": "Pr\u00f3g odszraniania: warunek DestTempRef > Td \u2212 Tm (Td=T3 sufit, Tm=czujnik prowadz\u0105cy)"
      },
      {
        "offset": 7,
        "name": "WorkModeTempRef",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1",
        "description": "Docelowa temperatura przy suficie w trybie r\u0119cznym; warunek: WorkModeTempRef > czujnik prowadz\u0105cy"
      }
    ]
  },
  "DRV EL": {
    "name": "DRV EL",
    "description": "Nagrzewnica elektryczna",
    "group_priority": 9,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3"
      },
      {
        "offset": 5,
        "name": "T4"
      },
      {
        "offset": 6,
        "name": "FanEff"
      },
      {
        "offset": 7,
        "name": "AntifreezeState"
      },
      {
        "offset": 8,
        "name": "DestStatus"
      },
      {
        "offset": 9,
        "name": "ThermalContactState"
      },
      {
        "offset": 10,
        "name": "FuseState"
      },
      {
        "offset": 11,
        "name": "PTCHeaterPowerState"
      },
      {
        "offset": 12,
        "name": "ElectricHeaterType"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_TS \u2014 tylko odczyt",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_AUTO \u2014 tryb automatyczny",
          "3": "WM_HEAT \u2014 tryb grzania",
          "4": "WM_VENT \u2014 wentylacja",
          "5": "WM_RAW \u2014 tryb surowy"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON \u2014 w\u0142\u0105czony",
          "2": "WM_OFF \u2014 wy\u0142\u0105czony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 10,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS \u2014 tylko odczyt",
          "1": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus (TLeadVal)",
          "3": "TSL_T4 \u2014 czujnik T4 (z\u0142\u0105cze DRV)"
        }
      },
      {
        "offset": 11,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF \u2014 wymuszanie destratyfikacji wy\u0142\u0105czone",
          "2": "DEST_MDF_ON \u2014 wymuszanie destratyfikacji w\u0142\u0105czone"
        }
      },
      {
        "offset": 12,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF \u2014 destratyfikacja wy\u0142\u0105czona",
          "2": "DEST_MD_AUTO_DEPEND \u2014 AUTO zale\u017cny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND \u2014 AUTO niezale\u017cny"
        }
      },
      {
        "offset": 13,
        "name": "DestTempRef",
        "min": 0,
        "max": 100,
        "unit": "K\u00d70.1",
        "description": "Pr\u00f3g destratyfikacji: warunek DestTempRef > Td \u2212 Tm (Td=T3 sufit, Tm=czujnik prowadz\u0105cy)"
      },
      {
        "offset": 15,
        "name": "ElectricHeaterPTCPower",
        "values": {
          "1": "Off \u2014 grzanie wy\u0142\u0105czone",
          "2": "1 \u2014 1 stopie\u0144 grzania",
          "3": "2 \u2014 2 stopnie grzania",
          "4": "3 \u2014 3 stopnie grzania (tylko SW3.5=K1)"
        },
        "description": "SW3.5=K1 (3 stopnie): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 stopnie): 1=Off, 2=1heat, 3=2heat, 4=2heat"
      },
      {
        "offset": 16,
        "name": "ModeAuto_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pr\u0119dko\u015b\u0107 wentylatora w trybie AUTO. AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1, 34\u201366=bieg 2, 67\u2013100=bieg 3"
      },
      {
        "offset": 17,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pr\u0119dko\u015b\u0107 wentylatora w trybie r\u0119cznym. AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1, 34\u201366=bieg 2, 67\u2013100=bieg 3"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_TS \u2014 tylko odczyt",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_AUTO \u2014 tryb automatyczny",
          "3": "WM_HEAT \u2014 tryb grzania",
          "4": "WM_VENT \u2014 wentylacja",
          "5": "WM_RAW \u2014 tryb surowy"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 7,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF \u2014 destratyfikacja wy\u0142\u0105czona",
          "2": "DEST_MD_AUTO_DEPEND \u2014 AUTO zale\u017cny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND \u2014 AUTO niezale\u017cny"
        }
      },
      {
        "offset": 8,
        "name": "ElectricHeaterPTCPower",
        "values": {
          "1": "Off \u2014 grzanie wy\u0142\u0105czone",
          "2": "1 \u2014 1 stopie\u0144 grzania",
          "3": "2 \u2014 2 stopnie grzania",
          "4": "3 \u2014 3 stopnie grzania (tylko SW3.5=K1)"
        },
        "description": "SW3.5=K1 (3 stopnie): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 stopnie): 1=Off, 2=1heat, 3=2heat, 4=2heat"
      }
    ]
  },
  "DRV ELIS": {
    "name": "DRV ELIS",
    "description": "Kurtyna powietrzna ELIS",
    "group_priority": 3,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3"
      },
      {
        "offset": 5,
        "name": "T4"
      },
      {
        "offset": 6,
        "name": "CurtainFanSpeed"
      },
      {
        "offset": 7,
        "name": "ValveState"
      },
      {
        "offset": 8,
        "name": "HeaterFanSpeed"
      },
      {
        "offset": 9,
        "name": "ContactDoor"
      },
      {
        "offset": 10,
        "name": "HeaterDetect"
      },
      {
        "offset": 11,
        "name": "AntifreezeState"
      },
      {
        "offset": 12,
        "name": "FuseState"
      },
      {
        "offset": 13,
        "name": "CurtainElectricpower"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS \u2014 tylko odczyt",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HEAT \u2014 tryb grzania",
          "3": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS \u2014 tylko odczyt",
          "1": "HEAT_ON \u2014 grzanie w\u0142\u0105czone",
          "2": "HEAT_OFF \u2014 grzanie wy\u0142\u0105czone"
        }
      },
      {
        "offset": 7,
        "name": "HeaterFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "HeaterHeatRef",
        "values": {
          "0": "HEAT_NS \u2014 tylko odczyt",
          "1": "HEAT_ON \u2014 grzanie w\u0142\u0105czone",
          "2": "HEAT_OFF \u2014 grzanie wy\u0142\u0105czone"
        }
      },
      {
        "offset": 10,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 11,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 12,
        "name": "TLeadSensorSelect",
        "values": {
          "1": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus (TLeadVal)",
          "3": "TSL_T4 \u2014 czujnik T4 (z\u0142\u0105cze DRV)"
        }
      },
      {
        "offset": 13,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS \u2014 brak wymuszenia",
          "1": "CURT_PRG_K1 \u2014 wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 \u2014 wymuszenie SW3 na K2"
        }
      },
      {
        "offset": 14,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 15,
        "name": "HeaterFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy (stand-by): 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 16,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Op\u00f3\u017anienie stand-by wentylatora w sekundach; 65535 = niesko\u0144czone"
      },
      {
        "offset": 17,
        "name": "ValveIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Op\u00f3\u017anienie zaworu w trybie stand-by w sekundach; 65535 = niesko\u0144czone. Warunek: ValveIdleDelay < FanIdleDelay"
      },
      {
        "offset": 18,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON \u2014 w\u0142\u0105czony",
          "2": "WM_OFF \u2014 wy\u0142\u0105czony"
        }
      },
      {
        "offset": 19,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS \u2014 tylko odczyt",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HEAT \u2014 tryb grzania",
          "3": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS \u2014 tylko odczyt",
          "1": "HEAT_ON \u2014 grzanie w\u0142\u0105czone",
          "2": "HEAT_OFF \u2014 grzanie wy\u0142\u0105czone"
        }
      },
      {
        "offset": 7,
        "name": "ContactDoor",
        "values": {
          "1": "DOOR_OPEN \u2014 drzwi otwarte",
          "2": "DOOR_CLOSE \u2014 drzwi zamkni\u0119te"
        }
      },
      {
        "offset": 8,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS \u2014 brak wymuszenia",
          "1": "CURT_PRG_K1 \u2014 wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 \u2014 wymuszenie SW3 na K2"
        }
      },
      {
        "offset": 9,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 10,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Op\u00f3\u017anienie stand-by wentylatora w sekundach; 65535 = niesko\u0144czone"
      }
    ]
  },
  "DRV KM": {
    "name": "DRV KM",
    "description": "Centrala wentylacyjna z klap\u0105 mieszaj\u0105c\u0105",
    "group_priority": 2,
    "input_registers": [
      {
        "offset": 4,
        "name": "T1"
      },
      {
        "offset": 5,
        "name": "T3"
      },
      {
        "offset": 6,
        "name": "T4"
      },
      {
        "offset": 7,
        "name": "T5"
      },
      {
        "offset": 8,
        "name": "ExternalGasDetect_TH1"
      },
      {
        "offset": 9,
        "name": "ExternalGasDetect_TH2"
      },
      {
        "offset": 10,
        "name": "ExternalGasDetect_val"
      },
      {
        "offset": 11,
        "name": "FanRoof_TK"
      },
      {
        "offset": 12,
        "name": "FanEff"
      },
      {
        "offset": 13,
        "name": "FanUvoEff"
      },
      {
        "offset": 14,
        "name": "DamperLevel"
      },
      {
        "offset": 15,
        "name": "DamperForceState"
      },
      {
        "offset": 16,
        "name": "AntiFreezeState"
      },
      {
        "offset": 17,
        "name": "FilterWorkTime"
      },
      {
        "offset": 18,
        "name": "FilterPreasureSwitchState"
      },
      {
        "offset": 19,
        "name": "FanEcConnect"
      },
      {
        "offset": 20,
        "name": "FuseState"
      },
      {
        "offset": 21,
        "name": "ValveState"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS \u2014 tylko odczyt",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HT \u2014 tryb grzania",
          "3": "WM_COOL \u2014 tryb ch\u0142odzenia",
          "4": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntiFreezeWareHouseOn",
        "values": {
          "1": "disable \u2014 wy\u0142\u0105czony",
          "2": "enable \u2014 w\u0142\u0105czony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 7,
        "name": "DamperForceMode",
        "values": {
          "0": "DAMPER_FMD_NS \u2014 tylko odczyt",
          "1": "DAMPER_FMD_OFF \u2014 wymuszanie wy\u0142\u0105czone",
          "2": "DAMPER_FMD_ON \u2014 wymuszanie w\u0142\u0105czone (je\u015bli T1 < DamperForceTempRef)"
        }
      },
      {
        "offset": 8,
        "name": "DamperForceTempRef",
        "min": -100,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 9,
        "name": "DamperForceLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 10,
        "name": "DamperLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 11,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC: p\u0142ynna regulacja 0\u2013100%. Wentylator AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 12,
        "name": "FanRoofForceEffRef",
        "min": -10,
        "max": 10,
        "unit": "%",
        "description": "Korekta pr\u0119dko\u015bci wentylatora dachowego \u2014 warto\u015b\u0107 dodawana do aktualnej pr\u0119dko\u015bci"
      },
      {
        "offset": 13,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 14,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 15,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS \u2014 tylko odczyt",
          "1": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus (TLeadVal)",
          "3": "TSL_T4 \u2014 czujnik T4 (powietrze przed wymiennikiem)"
        }
      },
      {
        "offset": 16,
        "name": "FanRoofMode",
        "values": {
          "0": "FR_MD_NS \u2014 tylko odczyt",
          "1": "FR_MD_01 \u2014 zale\u017cny od pozycji klapy (DamperLevelRef) i nastawy wentylatora (FanEffRef)",
          "2": "FR_MD_02 \u2014 zale\u017cny wy\u0142\u0105cznie od pozycji klapy (DamperLevelRef)"
        }
      },
      {
        "offset": 17,
        "name": "FilterTimeCntRst",
        "values": {
          "0": "FLT_CNT_RST_NS \u2014 tylko odczyt (po resecie)",
          "1": "FLT_CNT_RST \u2014 reset licznika czasu filtra"
        }
      },
      {
        "offset": 18,
        "name": "ThermostatModeState",
        "values": {
          "1": "THERMO_MD_ON \u2014 tryb termostatu w\u0142\u0105czony",
          "2": "THERMO_MD_OFF \u2014 tryb termostatu wy\u0142\u0105czony"
        }
      },
      {
        "offset": 19,
        "name": "ThermostatModeFanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pr\u0119dko\u015b\u0107 wentylatora w trybie termostatu. EC: p\u0142ynna 0\u2013100%. AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1, 34\u201366=bieg 2, 67\u2013100=bieg 3"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS \u2014 tylko odczyt",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HT \u2014 tryb grzania",
          "3": "WM_COOL \u2014 tryb ch\u0142odzenia",
          "4": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "DamperForceMode",
        "values": {
          "0": "DAMPER_FMD_NS \u2014 tylko odczyt",
          "1": "DAMPER_FMD_OFF \u2014 wymuszanie wy\u0142\u0105czone",
          "2": "DAMPER_FMD_ON \u2014 wymuszanie w\u0142\u0105czone (je\u015bli T1 < DamperForceTempRef)"
        }
      },
      {
        "offset": 6,
        "name": "DamperForceTempRef",
        "min": -100,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 7,
        "name": "DamperForceLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 8,
        "name": "DamperLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 9,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC: p\u0142ynna regulacja 0\u2013100%. Wentylator AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 10,
        "name": "FanRoofForceEffRef",
        "min": -10,
        "max": 10,
        "unit": "%",
        "description": "Korekta pr\u0119dko\u015bci wentylatora dachowego \u2014 warto\u015b\u0107 dodawana do aktualnej pr\u0119dko\u015bci"
      },
      {
        "offset": 11,
        "name": "FanRoofMode",
        "values": {
          "0": "FR_MD_NS \u2014 tylko odczyt",
          "1": "FR_MD_01 \u2014 zale\u017cny od pozycji klapy (DamperLevelRef) i nastawy wentylatora (FanEffRef)",
          "2": "FR_MD_02 \u2014 zale\u017cny wy\u0142\u0105cznie od pozycji klapy (DamperLevelRef)"
        }
      },
      {
        "offset": 12,
        "name": "ThermostatModeState",
        "values": {
          "1": "THERMO_MD_ON \u2014 tryb termostatu w\u0142\u0105czony",
          "2": "THERMO_MD_OFF \u2014 tryb termostatu wy\u0142\u0105czony"
        }
      },
      {
        "offset": 13,
        "name": "ThermostatModeFanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pr\u0119dko\u015b\u0107 wentylatora w trybie termostatu. EC: p\u0142ynna 0\u2013100%. AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1, 34\u201366=bieg 2, 67\u2013100=bieg 3"
      }
    ]
  },
  "DRV M": {
    "name": "DRV M",
    "description": "Nagrzewnica wodna z wentylatorem EC (p\u0142ynna regulacja)",
    "group_priority": 6,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3"
      },
      {
        "offset": 5,
        "name": "T4"
      },
      {
        "offset": 6,
        "name": "FanEff"
      },
      {
        "offset": 7,
        "name": "AntifreezeState"
      },
      {
        "offset": 8,
        "name": "DestStatus"
      },
      {
        "offset": 9,
        "name": "FanEcConnect"
      },
      {
        "offset": 10,
        "name": "FuseState"
      },
      {
        "offset": 11,
        "name": "ValveState"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "default": 0,
        "values": {
          "0": "WM_DEF \u2014 domy\u015blny po resecie",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HT_AUTO \u2014 grzanie automatyczne",
          "3": "WM_HT_MANUAL \u2014 grzanie r\u0119czne",
          "4": "WM_COOL_AUTO \u2014 ch\u0142odzenie automatyczne",
          "5": "WM_COOL_MANUAL \u2014 ch\u0142odzenie r\u0119czne",
          "6": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON \u2014 w\u0142\u0105czony",
          "2": "WM_OFF \u2014 wy\u0142\u0105czony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 10,
        "name": "TleadSensorSelect",
        "values": {
          "0": "TSL_TNS \u2014 tylko odczyt",
          "1": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus",
          "3": "TSL_T4 \u2014 czujnik T4 (powietrze przed wymiennikiem)"
        }
      },
      {
        "offset": 11,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF \u2014 wymu\u015b wy\u0142\u0105czenie",
          "2": "DEST_MDF_ON \u2014 wymu\u015b w\u0142\u0105czenie"
        }
      },
      {
        "offset": 12,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF \u2014 wy\u0142\u0105czony",
          "2": "DEST_MD_AUTO_DEPEND \u2014 AUTO zale\u017cny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND \u2014 AUTO niezale\u017cny"
        }
      },
      {
        "offset": 13,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K\u00d70.1"
      },
      {
        "offset": 14,
        "name": "DestStratTimeDelay"
      },
      {
        "offset": 15,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 16,
        "name": "ModeAuto_FanEffRefMax",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 17,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "default": 0,
        "values": {
          "0": "WM_DEF \u2014 domy\u015blny po resecie",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HT_AUTO \u2014 grzanie automatyczne",
          "3": "WM_HT_MANUAL \u2014 grzanie r\u0119czne",
          "4": "WM_COOL_AUTO \u2014 ch\u0142odzenie automatyczne",
          "5": "WM_COOL_MANUAL \u2014 ch\u0142odzenie r\u0119czne",
          "6": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 6,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF \u2014 wymu\u015b wy\u0142\u0105czenie",
          "2": "DEST_MDF_ON \u2014 wymu\u015b w\u0142\u0105czenie"
        }
      },
      {
        "offset": 7,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K\u00d70.1"
      },
      {
        "offset": 8,
        "name": "DestStratTimeDelay"
      },
      {
        "offset": 9,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 10,
        "name": "ModeAuto_FanEffRefMax",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 11,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      }
    ]
  },
  "DRV OXEN": {
    "name": "DRV OXEN",
    "description": "Rekuperator OXEN",
    "group_priority": 8,
    "input_registers": [
      {
        "offset": 0,
        "name": "Status1"
      },
      {
        "offset": 2,
        "name": "T1"
      },
      {
        "offset": 3,
        "name": "T2"
      },
      {
        "offset": 4,
        "name": "T3"
      },
      {
        "offset": 5,
        "name": "T4"
      },
      {
        "offset": 6,
        "name": "T5"
      },
      {
        "offset": 7,
        "name": "Outputs"
      },
      {
        "offset": 8,
        "name": "Inputs"
      },
      {
        "offset": 9,
        "name": "FilterWorkTime"
      },
      {
        "offset": 10,
        "name": "FansEff_1"
      },
      {
        "offset": 11,
        "name": "FansEff_2"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 0,
        "name": "Config1",
        "description": "Bit 0: FilterWorkTimeRST \u2014 0=brak akcji, 1=reset licznika czasu filtra (ustawia adres 0x09 na 0x000)"
      },
      {
        "offset": 2,
        "name": "FanEffRef_1",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC \u2014 wentylatory nawiewne (grupa I), p\u0142ynna regulacja 0\u2013100%"
      },
      {
        "offset": 3,
        "name": "FanEffRef_2",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC \u2014 wentylatory wywiewne (grupa II), p\u0142ynna regulacja 0\u2013100%"
      },
      {
        "offset": 4,
        "name": "OxenState",
        "values": {
          "0": "OX_OFF \u2014 wy\u0142\u0105czony",
          "1": "OX_ON \u2014 w\u0142\u0105czony",
          "2": "OX_ON \u2014 w\u0142\u0105czony",
          "3": "OX_ON \u2014 w\u0142\u0105czony"
        }
      },
      {
        "offset": 5,
        "name": "OxenMode",
        "values": {
          "0": "OXEN_MD_AUTO \u2014 automatyczny (automatyczna regulacja bypass)",
          "1": "OXEN_MD_WINTER \u2014 tryb zimowy (bypass wy\u0142\u0105czony)",
          "2": "OXEN_MD_SUMMER \u2014 tryb letni (bypass w\u0142\u0105czony)"
        }
      },
      {
        "offset": 6,
        "name": "TempRef",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 7,
        "name": "TLeadVal",
        "min": -500,
        "max": 1500,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 12,
        "name": "TleadSensorSelect",
        "values": {
          "0": "T_NS \u2014 tylko odczyt",
          "1": "T_LEAD \u2014 warto\u015b\u0107 przez Modbus (TLeadVal)",
          "2": "TSL_T3 \u2014 czujnik T3 (z\u0142\u0105cze DRV)",
          "3": "TSL_T4 \u2014 czujnik T4 (z\u0142\u0105cze DRV)"
        }
      }
    ],
    "holding_registers_group": [
      {
        "offset": 2,
        "name": "FanEffRef_1",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC \u2014 wentylatory nawiewne (grupa I), p\u0142ynna regulacja 0\u2013100%"
      },
      {
        "offset": 3,
        "name": "FanEffRef_2",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC \u2014 wentylatory wywiewne (grupa II), p\u0142ynna regulacja 0\u2013100%"
      },
      {
        "offset": 5,
        "name": "OxenMode",
        "values": {
          "0": "OXEN_MD_AUTO \u2014 automatyczny (automatyczna regulacja bypass)",
          "1": "OXEN_MD_WINTER \u2014 tryb zimowy (bypass wy\u0142\u0105czony)",
          "2": "OXEN_MD_SUMMER \u2014 tryb letni (bypass w\u0142\u0105czony)"
        }
      },
      {
        "offset": 6,
        "name": "TempRef",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      }
    ]
  },
  "DRV R NEXT": {
    "name": "DRV R NEXT",
    "description": "Nagrzewnica gazowa ROBUR NEXT",
    "group_priority": 10,
    "input_registers": [
      {
        "offset": 5,
        "name": "T3"
      },
      {
        "offset": 6,
        "name": "T4"
      },
      {
        "offset": 8,
        "name": "ExternalGasDetectTH1"
      },
      {
        "offset": 9,
        "name": "ExternalGasDetectTH2"
      },
      {
        "offset": 10,
        "name": "ExternalGasDetectVal"
      },
      {
        "offset": 15,
        "name": "AntifreezeStateWarehouse"
      },
      {
        "offset": 16,
        "name": "FuseState"
      },
      {
        "offset": 17,
        "name": "GasAlarmState"
      },
      {
        "offset": 18,
        "name": "STBAlarmState"
      },
      {
        "offset": 19,
        "name": "FilterWorkTime"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS \u2014 tylko odczyt",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HEAT_AUTO \u2014 automatyczne grzanie",
          "3": "WM_HEAT_MANUAL \u2014 r\u0119czne grzanie",
          "4": "WM_VENTILATION \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "ON \u2014 w\u0142\u0105czony",
          "2": "OFF \u2014 wy\u0142\u0105czony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 12,
        "name": "GasAlarmReset",
        "values": {
          "0": "RO \u2014 tylko odczyt",
          "1": "ON \u2014 wysy\u0142anie sygna\u0142u resetuj\u0105cego (ci\u0105g\u0142e)",
          "2": "OFF \u2014 zatrzymanie sygna\u0142u resetuj\u0105cego"
        },
        "description": "Reset alarmu gazowego/p\u0142omieniowego. Czas resetu nie powinien przekracza\u0107 5 s (nast\u0119pnie ustawi\u0107 warto\u015b\u0107 na 0x02)"
      },
      {
        "offset": 14,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 15,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 16,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS \u2014 tylko odczyt",
          "1": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus (TLeadVal)",
          "3": "TSL_T4 \u2014 czujnik T4 (temperatura pomieszczenia)"
        }
      },
      {
        "offset": 18,
        "name": "STBTemperatureAlarmOn",
        "min": 810,
        "max": 1200,
        "unit": "\u00b0C\u00d70.1",
        "description": "Temperatura progowa alarmu STB (Input Register 0x12). Alarm aktywny gdy warto\u015b\u0107 ustawiona > T3 (IR 0x05). Domy\u015blna warto\u015b\u0107 900 zapewnia wyst\u0105pienie b\u0142\u0119du przed rzeczywistym alarmem STB Robur (kt\u00f3ry wymaga r\u0119cznego resetu ze skrzynki sterowniczej)"
      },
      {
        "offset": 19,
        "name": "FilterTimeCntRst",
        "values": {
          "0": "FLT_CNT_RST_NS \u2014 tylko odczyt (po resecie)",
          "1": "FLT_CNT_RST \u2014 reset licznika czasu filtra (FilterWorkTime = 0)"
        }
      },
      {
        "offset": 20,
        "name": "STBTemperatureAlarmOff",
        "min": 610,
        "max": 800,
        "unit": "\u00b0C\u00d70.1",
        "description": "Temperatura resetowania alarmu STB. Reset mo\u017cliwy gdy warto\u015b\u0107 ustawiona > T3 (IR 0x05). Dodatkowy warunek: STB_T_OFF < STB_T_REF"
      },
      {
        "offset": 21,
        "name": "STBAlarmReset",
        "values": {
          "1": "ON \u2014 reset alarmu aktywny",
          "2": "OFF \u2014 reset alarmu nieaktywny"
        },
        "description": "Je\u015bli STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), rejestr zostanie automatycznie ustawiony na 0x02 (OFF)"
      },
      {
        "offset": 22,
        "name": "ContModeFanSpeedRef",
        "values": {
          "0": "Fan OFF \u2014 wentylator wy\u0142\u0105czony",
          "100": "Fan ON \u2014 wentylator w\u0142\u0105czony"
        },
        "description": "Ustawienie wydajno\u015bci wentylatora po osi\u0105gni\u0119ciu temperatury docelowej"
      },
      {
        "offset": 23,
        "name": "GasBurnerLvlRef",
        "values": {
          "0": "RO \u2014 tylko odczyt",
          "1": "FIRST_STEP \u2014 pierwszy stopie\u0144 spalania",
          "2": "SECOND_STEP \u2014 drugi stopie\u0144 spalania"
        },
        "description": "Ustawienie stopnia spalania gazu (aktywne tylko w trybie r\u0119cznego grzania WM_HEAT_MANUAL)"
      }
    ],
    "holding_registers_group": []
  },
  "DRV R KM NEXT": {
    "name": "DRV R KM NEXT",
    "description": "Nagrzewnica gazowa ROBUR NEXT z klap\u0105 mieszaj\u0105c\u0105",
    "group_priority": 11,
    "input_registers": [
      {
        "offset": 4,
        "name": "T1"
      },
      {
        "offset": 5,
        "name": "T3"
      },
      {
        "offset": 6,
        "name": "T4"
      },
      {
        "offset": 7,
        "name": "T5"
      },
      {
        "offset": 8,
        "name": "ExternalGasDetectTH1"
      },
      {
        "offset": 9,
        "name": "ExternalGasDetectTH2"
      },
      {
        "offset": 10,
        "name": "ExternalGasDetectVal"
      },
      {
        "offset": 11,
        "name": "FanRoofTK"
      },
      {
        "offset": 12,
        "name": "FanRoofEff"
      },
      {
        "offset": 13,
        "name": "DamperLevel"
      },
      {
        "offset": 14,
        "name": "DamperForceState"
      },
      {
        "offset": 15,
        "name": "AntifreezeStateWarehouse"
      },
      {
        "offset": 16,
        "name": "FuseState"
      },
      {
        "offset": 17,
        "name": "GasAlarmState"
      },
      {
        "offset": 18,
        "name": "STBAlarmState"
      },
      {
        "offset": 19,
        "name": "FilterWorkTime"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS \u2014 tylko odczyt",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HEAT_AUTO \u2014 automatyczne grzanie",
          "3": "WM_HEAT_MANUAL \u2014 r\u0119czne grzanie",
          "4": "WM_VENTILATION \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "ON \u2014 w\u0142\u0105czony",
          "2": "OFF \u2014 wy\u0142\u0105czony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 7,
        "name": "DamperForceMode",
        "values": {
          "0": "DAMPER_FMD_NS \u2014 tylko odczyt",
          "1": "DAMPER_FMD_OFF \u2014 wymuszanie wy\u0142\u0105czone",
          "2": "DAMPER_FMD_ON \u2014 wymuszanie w\u0142\u0105czone (je\u015bli T1 < DamperForceTempRef)"
        }
      },
      {
        "offset": 8,
        "name": "DamperForceTempRef",
        "min": -100,
        "max": 150,
        "unit": "\u00b0C\u00d70.1",
        "description": "Temperatura wymuszonego otwarcia klapy. Po\u0142\u0105czona z T1 (temperatura \u015bwie\u017cego powietrza \u2014 IR 0x04)"
      },
      {
        "offset": 9,
        "name": "DamperForceLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Docelowe otwarcie klapy przy wymuszeniu (DamperForceMode == DAMPER_FMD_ON, warunek: Temp < DamperForceTempRef)"
      },
      {
        "offset": 10,
        "name": "DamperLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pozycja klapy mieszaj\u0105cej"
      },
      {
        "offset": 11,
        "name": "DamperContLevelRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Pozycja klapy gdy WorkMode == WM_WINTER_CONT"
      },
      {
        "offset": 12,
        "name": "GasAlarmReset",
        "values": {
          "0": "RO \u2014 tylko odczyt",
          "1": "ON \u2014 wysy\u0142anie sygna\u0142u resetuj\u0105cego (ci\u0105g\u0142e)",
          "2": "OFF \u2014 zatrzymanie sygna\u0142u resetuj\u0105cego"
        },
        "description": "Reset alarmu gazowego/p\u0142omieniowego. Czas resetu nie powinien przekracza\u0107 5 s (nast\u0119pnie ustawi\u0107 warto\u015b\u0107 na 0x02)"
      },
      {
        "offset": 13,
        "name": "FanRoofForceEffRef",
        "min": -100,
        "max": 100,
        "unit": "%",
        "description": "Wymuszenie pr\u0119dko\u015bci wentylatora dachowego \u2014 warto\u015b\u0107 dodawana do aktualnej pr\u0119dko\u015bci"
      },
      {
        "offset": 14,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 15,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 16,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS \u2014 tylko odczyt",
          "1": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus (TLeadVal)",
          "3": "TSL_T4 \u2014 czujnik T4 (temperatura pomieszczenia)"
        }
      },
      {
        "offset": 17,
        "name": "FanRoofMode",
        "values": {
          "0": "FR_MD_NS \u2014 tylko odczyt",
          "1": "FR_MD_01 \u2014 zale\u017cny od pozycji klapy (DamperLevelRef) i nastawy wentylatora (FanEffRef)",
          "2": "FR_MD_02 \u2014 zale\u017cny wy\u0142\u0105cznie od pozycji klapy (DamperLevelRef)"
        }
      },
      {
        "offset": 18,
        "name": "STBTemperatureAlarmOn",
        "min": 810,
        "max": 1200,
        "unit": "\u00b0C\u00d70.1",
        "description": "Temperatura progowa alarmu STB (IR 0x12). Alarm aktywny gdy warto\u015b\u0107 ustawiona > T3 (IR 0x05)"
      },
      {
        "offset": 19,
        "name": "FilterTimeCntRst",
        "values": {
          "0": "FLT_CNT_RST_NS \u2014 tylko odczyt (po resecie)",
          "1": "FLT_CNT_RST \u2014 reset licznika czasu filtra (FilterWorkTime = 0)"
        }
      },
      {
        "offset": 20,
        "name": "STBTemperatureAlarmOff",
        "min": 610,
        "max": 800,
        "unit": "\u00b0C\u00d70.1",
        "description": "Temperatura resetowania alarmu STB. Reset mo\u017cliwy gdy warto\u015b\u0107 ustawiona > T3. Dodatkowy warunek: STB_T_OFF < STB_T_REF"
      },
      {
        "offset": 21,
        "name": "STBAlarmReset",
        "values": {
          "1": "ON \u2014 reset alarmu aktywny",
          "2": "OFF \u2014 reset alarmu nieaktywny"
        },
        "description": "Je\u015bli STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), rejestr zostanie automatycznie ustawiony na 0x02 (OFF)"
      },
      {
        "offset": 22,
        "name": "ContModeFanSpeedRef",
        "values": {
          "0": "Fan OFF \u2014 wentylator wy\u0142\u0105czony",
          "100": "Fan ON \u2014 wentylator w\u0142\u0105czony"
        },
        "description": "Ustawienie wydajno\u015bci wentylatora po osi\u0105gni\u0119ciu temperatury docelowej"
      },
      {
        "offset": 23,
        "name": "GasBurnerLvlRef",
        "values": {
          "0": "RO \u2014 tylko odczyt",
          "1": "FIRST_STEP \u2014 pierwszy stopie\u0144 spalania",
          "2": "SECOND_STEP \u2014 drugi stopie\u0144 spalania"
        },
        "description": "Ustawienie stopnia spalania gazu (aktywne tylko w trybie r\u0119cznego grzania WM_HEAT_MANUAL)"
      }
    ],
    "holding_registers_group": []
  },
  "DRV SLIM": {
    "name": "DRV SLIM",
    "description": "Kurtyna powietrzna SLIM",
    "group_priority": 15,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3"
      },
      {
        "offset": 5,
        "name": "T4"
      },
      {
        "offset": 6,
        "name": "CurtainFanSpeed"
      },
      {
        "offset": 7,
        "name": "ValveState"
      },
      {
        "offset": 8,
        "name": "HeaterFanSpeed"
      },
      {
        "offset": 9,
        "name": "ContactDoor"
      },
      {
        "offset": 10,
        "name": "HeaterDetect"
      },
      {
        "offset": 11,
        "name": "AntifreezeState"
      },
      {
        "offset": 12,
        "name": "FuseState"
      },
      {
        "offset": 13,
        "name": "CurtainElectricpower"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS \u2014 tylko odczyt",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HEAT \u2014 tryb grzania",
          "3": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS \u2014 tylko odczyt",
          "1": "HEAT_ON \u2014 grzanie w\u0142\u0105czone",
          "2": "HEAT_OFF \u2014 grzanie wy\u0142\u0105czone"
        }
      },
      {
        "offset": 7,
        "name": "HeaterFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "HeaterHeatRef",
        "values": {
          "0": "HEAT_NS \u2014 tylko odczyt",
          "1": "HEAT_ON \u2014 grzanie w\u0142\u0105czone",
          "2": "HEAT_OFF \u2014 grzanie wy\u0142\u0105czone"
        }
      },
      {
        "offset": 10,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 11,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 12,
        "name": "TLeadSensorSelect",
        "values": {
          "1": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus (TLeadVal)",
          "3": "TSL_T4 \u2014 czujnik T4 (z\u0142\u0105cze DRV)"
        }
      },
      {
        "offset": 13,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS \u2014 brak wymuszenia",
          "1": "CURT_PRG_K1 \u2014 wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 \u2014 wymuszenie SW3 na K2"
        }
      },
      {
        "offset": 14,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 15,
        "name": "HeaterFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy (stand-by): 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 16,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Op\u00f3\u017anienie stand-by wentylatora w sekundach; 65535 = niesko\u0144czone"
      },
      {
        "offset": 17,
        "name": "ValveIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Op\u00f3\u017anienie zaworu w trybie stand-by w sekundach; 65535 = niesko\u0144czone. Warunek: ValveIdleDelay < FanIdleDelay"
      },
      {
        "offset": 18,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON \u2014 w\u0142\u0105czony",
          "2": "WM_OFF \u2014 wy\u0142\u0105czony"
        }
      },
      {
        "offset": 19,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS \u2014 tylko odczyt",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HEAT \u2014 tryb grzania",
          "3": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS \u2014 tylko odczyt",
          "1": "HEAT_ON \u2014 grzanie w\u0142\u0105czone",
          "2": "HEAT_OFF \u2014 grzanie wy\u0142\u0105czone"
        }
      },
      {
        "offset": 7,
        "name": "ContactDoor",
        "values": {
          "1": "DOOR_OPEN \u2014 drzwi otwarte",
          "2": "DOOR_CLOSE \u2014 drzwi zamkni\u0119te"
        }
      },
      {
        "offset": 8,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS \u2014 brak wymuszenia",
          "1": "CURT_PRG_K1 \u2014 wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 \u2014 wymuszenie SW3 na K2"
        }
      },
      {
        "offset": 9,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 10,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Op\u00f3\u017anienie stand-by wentylatora w sekundach; 65535 = niesko\u0144czone"
      },
      {
        "offset": 11,
        "name": "ValveIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Op\u00f3\u017anienie zaworu w trybie stand-by w sekundach; 65535 = niesko\u0144czone. Warunek: ValveIdleDelay < FanIdleDelay"
      }
    ]
  },
  "DRV V": {
    "name": "DRV V",
    "description": "Nagrzewnica wodna z wentylatorem EC",
    "group_priority": 5,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3"
      },
      {
        "offset": 5,
        "name": "T4"
      },
      {
        "offset": 6,
        "name": "FanEff"
      },
      {
        "offset": 7,
        "name": "AntifreezeState"
      },
      {
        "offset": 8,
        "name": "DestStatus"
      },
      {
        "offset": 9,
        "name": "FanEcConnect"
      },
      {
        "offset": 10,
        "name": "FuseState"
      },
      {
        "offset": 11,
        "name": "ValveState"
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "default": 0,
        "values": {
          "0": "WM_DEF \u2014 domy\u015blny po resecie",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HT_AUTO \u2014 grzanie automatyczne",
          "3": "WM_HT_MANUAL \u2014 grzanie r\u0119czne",
          "4": "WM_COOL_AUTO \u2014 ch\u0142odzenie automatyczne",
          "5": "WM_COOL_MANUAL \u2014 ch\u0142odzenie r\u0119czne",
          "6": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON \u2014 w\u0142\u0105czony",
          "2": "WM_OFF \u2014 wy\u0142\u0105czony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wy\u0142\u0105czony (FAN_SPEED0), 1\u201333=bieg 1 (FAN_SPEED1), 34\u201366=bieg 2 (FAN_SPEED2), 67\u2013100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "\u00b0C\u00d70.1"
      },
      {
        "offset": 10,
        "name": "TleadSensorSelect",
        "values": {
          "0": "TSL_TNS \u2014 tylko odczyt",
          "1": "TSL_TLEAD \u2014 warto\u015b\u0107 przez Modbus",
          "3": "TSL_T4 \u2014 czujnik T4 (powietrze przed wymiennikiem)"
        }
      },
      {
        "offset": 11,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF \u2014 wymu\u015b wy\u0142\u0105czenie",
          "2": "DEST_MDF_ON \u2014 wymu\u015b w\u0142\u0105czenie"
        }
      },
      {
        "offset": 12,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF \u2014 wy\u0142\u0105czony",
          "2": "DEST_MD_AUTO_DEPEND \u2014 AUTO zale\u017cny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND \u2014 AUTO niezale\u017cny"
        }
      },
      {
        "offset": 13,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K\u00d70.1"
      },
      {
        "offset": 14,
        "name": "DestStratTimeDelay"
      },
      {
        "offset": 15,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 16,
        "name": "ModeAuto_FanEffRefMax",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 17,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "default": 0,
        "values": {
          "0": "WM_DEF \u2014 domy\u015blny po resecie",
          "1": "WM_OFF \u2014 urz\u0105dzenie wy\u0142\u0105czone",
          "2": "WM_HT_AUTO \u2014 grzanie automatyczne",
          "3": "WM_HT_MANUAL \u2014 grzanie r\u0119czne",
          "4": "WM_COOL_AUTO \u2014 ch\u0142odzenie automatyczne",
          "5": "WM_COOL_MANUAL \u2014 ch\u0142odzenie r\u0119czne",
          "6": "WM_VENT \u2014 wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 6,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF \u2014 wymu\u015b wy\u0142\u0105czenie",
          "2": "DEST_MDF_ON \u2014 wymu\u015b w\u0142\u0105czenie"
        }
      },
      {
        "offset": 7,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K\u00d70.1"
      },
      {
        "offset": 8,
        "name": "DestStratTimeDelay"
      },
      {
        "offset": 9,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%"
      },
      {
        "offset": 10,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%"
      }
    ]
  },
  "DRV AX": {
    "name": "DRV AX",
    "description": "Kurtyna powietrzna ELIS AX (wielobiegowe wentylatory EC)",
    "group_priority": 4,
    "input_registers": [
      { "offset": 4,  "name": "T1",               "description": "Temperatura powietrza zewnętrznego (czujnik T1)." },
      { "offset": 5,  "name": "T3",               "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3)." },
      { "offset": 6,  "name": "T4",               "description": "Temperatura w pomieszczeniu (czujnik T4)." },
      { "offset": 7,  "name": "T5",               "description": "Temperatura wymiennika wodnego — rura powrotna (czujnik T5)." },
      { "offset": 8,  "name": "CurtainState1",    "description": "Rejestr statusu sterownika — bity reprezentują aktywne funkcje i tryby pracy." },
      { "offset": 9,  "name": "CurtainState2",    "description": "Rozszerzenie rejestru statusu sterownika." },
      { "offset": 10, "name": "CurtainState3",    "description": "Rozszerzenie rejestru statusu sterownika." },
      { "offset": 11, "name": "Fan1Speed",        "description": "Rzeczywista prędkość wentylatora nawiewnego 1 [RPM]." },
      { "offset": 12, "name": "Fan2Speed",        "description": "Rzeczywista prędkość wentylatora nawiewnego 2 [RPM]." },
      { "offset": 13, "name": "Fan3Speed",        "description": "Rzeczywista prędkość wentylatora nawiewnego 3 [RPM]." },
      { "offset": 14, "name": "Fan4Speed",        "description": "Rzeczywista prędkość wentylatora nawiewnego 4 [RPM]." },
      { "offset": 15, "name": "Fan5Speed",        "description": "Rzeczywista prędkość wentylatora nawiewnego 5 [RPM]." },
      { "offset": 16, "name": "Fan6Speed",        "description": "Rzeczywista prędkość wentylatora nawiewnego 6 [RPM]." },
      { "offset": 17, "name": "Fan7Speed",        "description": "Rzeczywista prędkość wentylatora nawiewnego 7 [RPM]." },
      { "offset": 18, "name": "FilterWorkTime",   "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min]." },
      { "offset": 19, "name": "ValveRelaysState", "description": "Aktualny status zaworu na stykach VALVE_RELAYS (L1, L2). 0=otwarty, 1=zamknięty." },
      { "offset": 20, "name": "Valve0-10State",   "description": "Aktualny status zaworu 0–10V." }
    ],
    "holding_registers_single": [
      { "offset": 4,  "name": "WorkMode",                   "values": { "0": "OFF — urządzenie wyłączone", "1": "HEAT — tryb grzania", "2": "VENT — wentylacja", "3": "SMART — tryb automatyczny" } },
      { "offset": 5,  "name": "FanWorkMode",                "values": { "0": "AUTO", "1": "MANUAL" }, "description": "Tryb pracy wentylatora. Domyślnie MANUAL." },
      { "offset": 6,  "name": "Program",                    "description": "Program pracy kurtyny (K1, K2...). Domyślnie K1." },
      { "offset": 7,  "name": "FWM_ManualHeatVentRef",      "min": 0, "max": 100, "unit": "%", "description": "Wydajność wentylatora w trybie MANUAL (HEAT lub VENT). Domyślnie 50%." },
      { "offset": 8,  "name": "FWM_StandbyRef",             "min": 0, "max": 100, "unit": "%", "description": "Wydajność wentylatora w trybie STANDBY. Domyślnie 20%." },
      { "offset": 9,  "name": "FWM_AutoHeatVentMin",        "min": 0, "max": 100, "unit": "%", "description": "Minimalna wydajność wentylatora w trybie AUTO (HEAT/VENT). Warunek: Min < Max. Domyślnie 0%." },
      { "offset": 10, "name": "FWM_AutoHeatVentMax",        "min": 0, "max": 100, "unit": "%", "description": "Maksymalna wydajność wentylatora w trybie AUTO (HEAT/VENT). Warunek: Max > Min. Domyślnie 100%." },
      { "offset": 11, "name": "EWM_HeatT3Ref",              "min": 0, "max": 999, "unit": "×0.1°C", "description": "Temperatura zadana nawiewu dla trybu grzania (HEAT). Domyślnie 320 = 32.0°C." },
      { "offset": 12, "name": "EWM_HeatT5Max",              "min": 0, "max": 999, "unit": "×0.1°C", "description": "Ograniczenie temperatury wody powrotnej dla trybu grzania. Domyślnie 320 = 32.0°C." },
      { "offset": 13, "name": "EWM_HeatT5LimitMode",        "values": { "1": "ON — aktywne", "2": "OFF — wyłączone" }, "description": "Włącz/wyłącz ograniczenie temperatury wody powrotnej. Domyślnie OFF." },
      { "offset": 14, "name": "PreheatT5Ref",               "min": 0, "max": 999, "unit": "×0.1°C", "description": "Temperatura wody powrotnej po której włącza się wentylator (PREHEAT). Domyślnie 300 = 30.0°C." },
      { "offset": 15, "name": "StandbyFanIdleDelay",        "min": 0, "max": 9999, "unit": "s", "description": "Opóźnienie pracy wentylatora w trybie STANDBY [s]. Domyślnie 300s. Warunek: ≥ StandbyValveIdleDelay." },
      { "offset": 16, "name": "StandbyValveIdleDelay",      "min": 0, "max": 9999, "unit": "s", "description": "Opóźnienie pracy zaworu w trybie STANDBY [s]. Domyślnie 300s. Warunek: ≤ StandbyFanIdleDelay." },
      { "offset": 17, "name": "AntifreezeWareHouseOn",      "values": { "1": "ON — aktywne", "2": "OFF — wyłączone" }, "description": "Ochrona przeciwzamrożeniowa magazynu. Domyślnie OFF." },
      { "offset": 18, "name": "AntifreezeWareTempOn",       "min": 0, "max": 999, "unit": "×0.1°C", "description": "Temperatura progowa aktywacji ochrony przeciwzamrożeniowej magazynu. Domyślnie 70 = 7.0°C." },
      { "offset": 19, "name": "AntifreezeWaterExchangeOn",  "values": { "1": "ON — aktywne", "2": "OFF — wyłączone" }, "description": "Ochrona przeciwzamrożeniowa wymiennika wodnego. Domyślnie ON." },
      { "offset": 20, "name": "AntifreezeWaterExchangeT3",  "min": 0, "max": 999, "unit": "×0.1°C", "description": "Progowa temperatura nawiewu T3 dla aktywacji ochrony wymiennika. Domyślnie 70 = 7.0°C." },
      { "offset": 21, "name": "AntifreezeWaterExchangeT5",  "min": 0, "max": 999, "unit": "×0.1°C", "description": "Progowa temperatura wody T5 dla aktywacji ochrony wymiennika. Domyślnie 70 = 7.0°C." },
      { "offset": 22, "name": "PreheatOnOff",               "values": { "1": "ON", "2": "OFF" }, "description": "Włącz/wyłącz podgrzewanie wstępne (PREHEAT). Domyślnie OFF." },
      { "offset": 23, "name": "FilterMaxWorkTime",          "description": "Kasowanie licznika czasu pracy filtra. Domyślnie OFF." },
      { "offset": 24, "name": "DoorOpenFreqAlphaThreshold", "min": 0, "max": 100, "description": "Próg detekcji częstotliwości otwierania drzwi w trybie SMART. Domyślnie 60." },
      { "offset": 25, "name": "DoorOpenFreqTimePeriod",     "unit": "s", "description": "Okres detekcji częstotliwości otwierania drzwi w trybie SMART. Domyślnie 300s." },
      { "offset": 26, "name": "FWMAutoAddHeatMin",          "min": 0, "max": 100, "unit": "%", "description": "Minimalna wydajność wentylatora w trybie dogrzewania (ADD HEAT), Auto. Domyślnie 5%. Warunek: Min < Max." },
      { "offset": 27, "name": "FWMAutoAddHeatMax",          "min": 0, "max": 100, "unit": "%", "description": "Maksymalna wydajność wentylatora w trybie dogrzewania (ADD HEAT), Auto. Domyślnie 5%. Warunek: Min < Max." },
      { "offset": 28, "name": "EWMSmartT124h",              "min": 0, "max": 999, "unit": "×0.1°C", "description": "Temperatura zadana przejścia VENT→HEAT w trybie SMART. Domyślnie 170 = 17.0°C. Warunek: ≤ EWMSmartT13h − 1K." },
      { "offset": 29, "name": "EWMSmartT13h",               "min": 0, "max": 999, "unit": "×0.1°C", "description": "Temperatura zadana przejścia HEAT→VENT w trybie SMART. Domyślnie 210 = 21.0°C. Warunek: ≥ EWMSmartT124h + 1K." },
      { "offset": 30, "name": "HeatT3_PI_KP",               "description": "Wzmocnienie KP regulatora PI temperatury nawiewu T3. Domyślnie 3." },
      { "offset": 31, "name": "HeatT3_PI_TI",               "unit": "s", "description": "Czas podwajania TI regulatora PI temperatury nawiewu T3. Domyślnie 180s." },
      { "offset": 32, "name": "HeatT5_PI_KP",               "description": "Wzmocnienie KP regulatora PI temperatury wody powrotnej T5. Domyślnie 3." },
      { "offset": 33, "name": "HeatT5_PI_TI",               "unit": "s", "description": "Czas TI regulatora PI temperatury wody powrotnej T5. Domyślnie 180s." }
    ],
    "holding_registers_group": []
  }
};
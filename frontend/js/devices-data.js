const DEVICES_DATA = {
  "DRV OXEN": {
    "name": "DRV OXEN",
    "description": "Rekuperator OXEN",
    "group_priority": 1,
    "input_registers": [
      {
        "offset": 0,
        "name": "Status1",
        "description": "Rejestr statusu nr 1 (bitowy)."
      },
      {
        "offset": 2,
        "name": "T1",
        "description": "Temperatura powietrza nawiewanego (czujnik T1)."
      },
      {
        "offset": 3,
        "name": "T2",
        "description": "Temperatura powietrza przy wentylatorze wyciągowym (czujnik T2)."
      },
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura powietrza powrotnego / pomieszczenia (czujnik T4)."
      },
      {
        "offset": 6,
        "name": "T5",
        "description": "Temperatura wymiennika wodnego (czujnik T5)."
      },
      {
        "offset": 7,
        "name": "Outputs",
        "description": "Stan wyjść sterownika."
      },
      {
        "offset": 8,
        "name": "Inputs",
        "description": "Stan wejść sterownika (wejścia beznap. i przełączniki)."
      },
      {
        "offset": 9,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra."
      },
      {
        "offset": 10,
        "name": "FansEff_1",
        "description": "Wydajność wentylatorów grupy I — nawiew [%]."
      },
      {
        "offset": 11,
        "name": "FansEff_2",
        "description": "Wydajność wentylatorów grupy II — wyciąg [%]."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 0,
        "name": "Config1",
        "description": "Bit 0: FilterWorkTimeRST — 0=brak akcji, 1=reset licznika czasu filtra (ustawia adres 0x09 na 0x000)"
      },
      {
        "offset": 2,
        "name": "FanEffRef_1",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC — wentylatory nawiewne (grupa I), płynna regulacja 0–100%"
      },
      {
        "offset": 3,
        "name": "FanEffRef_2",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC — wentylatory wywiewne (grupa II), płynna regulacja 0–100%"
      },
      {
        "offset": 4,
        "name": "OxenState",
        "values": {
          "0": "OX_OFF — wyłączony",
          "1": "OX_ON — włączony",
          "2": "OX_ON — włączony",
          "3": "OX_ON — włączony"
        }
      },
      {
        "offset": 5,
        "name": "OxenMode",
        "values": {
          "0": "OXEN_MD_AUTO — automatyczny (automatyczna regulacja bypass)",
          "1": "OXEN_MD_WINTER — tryb zimowy (bypass wyłączony)",
          "2": "OXEN_MD_SUMMER — tryb letni (bypass włączony)"
        }
      },
      {
        "offset": 6,
        "name": "TempRef",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "TLeadVal",
        "min": -500,
        "max": 1500,
        "unit": "°C×0.1"
      },
      {
        "offset": 12,
        "name": "TleadSensorSelect",
        "values": {
          "0": "T_NS — tylko odczyt",
          "1": "T_LEAD — wartość przez Modbus (TLeadVal)",
          "2": "TSL_T3 — czujnik T3 (złącze DRV)",
          "3": "TSL_T4 — czujnik T4 (złącze DRV)"
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
        "description": "Wentylator EC — wentylatory nawiewne (grupa I), płynna regulacja 0–100%"
      },
      {
        "offset": 3,
        "name": "FanEffRef_2",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator EC — wentylatory wywiewne (grupa II), płynna regulacja 0–100%"
      },
      {
        "offset": 5,
        "name": "OxenMode",
        "values": {
          "0": "OXEN_MD_AUTO — automatyczny (automatyczna regulacja bypass)",
          "1": "OXEN_MD_WINTER — tryb zimowy (bypass wyłączony)",
          "2": "OXEN_MD_SUMMER — tryb letni (bypass włączony)"
        }
      },
      {
        "offset": 6,
        "name": "TempRef",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      }
    ]
  },
  "DRV KM": {
    "name": "DRV KM",
    "description": "Centrala wentylacyjna z klapą mieszającą",
    "group_priority": 2,
    "input_registers": [
      {
        "offset": 4,
        "name": "T1",
        "description": "Temperatura powietrza świeżego (czujnik T1)."
      },
      {
        "offset": 5,
        "name": "T3",
        "description": "Temperatura czujnika T3 (powietrze za wymiennikiem wodnym)."
      },
      {
        "offset": 6,
        "name": "T4",
        "description": "Temperatura powietrza przed wymiennikiem (czujnik T4)."
      },
      {
        "offset": 7,
        "name": "T5",
        "description": "Temperatura wody na wymienniku (czujnik T5)."
      },
      {
        "offset": 8,
        "name": "ExternalGasDetectTH1",
        "description": "Sygnał zewnętrznego czujnika gazu — próg pierwszy."
      },
      {
        "offset": 9,
        "name": "ExternalGasDetectTH2",
        "description": "Sygnał zewnętrznego czujnika gazu — próg drugi."
      },
      {
        "offset": 10,
        "name": "ExternalGasDetectVal",
        "description": "Stężenie gazu — wejście 0–10V DC."
      },
      {
        "offset": 11,
        "name": "FanRoofTK",
        "description": "Sygnał TK z wentylatora dachowego."
      },
      {
        "offset": 12,
        "name": "FanEff",
        "description": "Wydajność wentylatora EC lub AC (3-biegowy)."
      },
      {
        "offset": 13,
        "name": "FanRoofEff",
        "description": "Wydajność wentylatora dachowego."
      },
      {
        "offset": 14,
        "name": "DamperLevel",
        "description": "Aktualna pozycja klapy."
      },
      {
        "offset": 15,
        "name": "DamperForceState",
        "description": "Stan wymuszenia pozycji klapy."
      },
      {
        "offset": 16,
        "name": "AntiFreezeState",
        "description": "Stan ochrony przeciwzamrożeniowej — 8 bitów."
      },
      {
        "offset": 17,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min]."
      },
      {
        "offset": 18,
        "name": "FilterPressureSwitchState",
        "description": "Stan presostatu filtra."
      },
      {
        "offset": 19,
        "name": "FanEcConnect",
        "description": "Status połączenia wentylatora EC."
      },
      {
        "offset": 20,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatorów EC/3V/dachowych (bity maskowane)."
      },
      {
        "offset": 21,
        "name": "ValveState",
        "description": "Stan zaworu wodnego."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT — tryb grzania",
          "3": "WM_COOL — tryb chłodzenia",
          "4": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntiFreezeWareHouseOn",
        "values": {
          "1": "disable — wyłączony",
          "2": "enable — włączony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "DamperForceMode",
        "values": {
          "0": "DAMPER_FMD_NS — tylko odczyt",
          "1": "DAMPER_FMD_OFF — wymuszanie wyłączone",
          "2": "DAMPER_FMD_ON — wymuszanie włączone (jeśli T1 < DamperForceTempRef)"
        }
      },
      {
        "offset": 8,
        "name": "DamperForceTempRef",
        "min": -100,
        "max": 150,
        "unit": "°C×0.1"
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
        "description": "Wentylator EC: płynna regulacja 0–100%. Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 12,
        "name": "FanRoofForceEffRef",
        "min": -10,
        "max": 10,
        "unit": "%",
        "description": "Korekta prędkości wentylatora dachowego — wartość dodawana do aktualnej prędkości"
      },
      {
        "offset": 13,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 14,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 15,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (powietrze przed wymiennikiem)"
        }
      },
      {
        "offset": 16,
        "name": "FanRoofMode",
        "values": {
          "0": "FR_MD_NS — tylko odczyt",
          "1": "FR_MD_01 — zależny od pozycji klapy (DamperLevelRef) i nastawy wentylatora (FanEffRef)",
          "2": "FR_MD_02 — zależny wyłącznie od pozycji klapy (DamperLevelRef)"
        }
      },
      {
        "offset": 17,
        "name": "FilterTimeCntRst",
        "values": {
          "0": "FLT_CNT_RST_NS — tylko odczyt (po resecie)",
          "1": "FLT_CNT_RST — reset licznika czasu filtra"
        }
      },
      {
        "offset": 18,
        "name": "ThermostatModeState",
        "values": {
          "1": "THERMO_MD_ON — tryb termostatu włączony",
          "2": "THERMO_MD_OFF — tryb termostatu wyłączony"
        }
      },
      {
        "offset": 19,
        "name": "ThermostatModeFanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Prędkość wentylatora w trybie termostatu. EC: płynna 0–100%. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT — tryb grzania",
          "3": "WM_COOL — tryb chłodzenia",
          "4": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "DamperForceMode",
        "values": {
          "0": "DAMPER_FMD_NS — tylko odczyt",
          "1": "DAMPER_FMD_OFF — wymuszanie wyłączone",
          "2": "DAMPER_FMD_ON — wymuszanie włączone (jeśli T1 < DamperForceTempRef)"
        }
      },
      {
        "offset": 6,
        "name": "DamperForceTempRef",
        "min": -100,
        "max": 150,
        "unit": "°C×0.1"
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
        "description": "Wentylator EC: płynna regulacja 0–100%. Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 10,
        "name": "FanRoofForceEffRef",
        "min": -10,
        "max": 10,
        "unit": "%",
        "description": "Korekta prędkości wentylatora dachowego — wartość dodawana do aktualnej prędkości"
      },
      {
        "offset": 11,
        "name": "FanRoofMode",
        "values": {
          "0": "FR_MD_NS — tylko odczyt",
          "1": "FR_MD_01 — zależny od pozycji klapy (DamperLevelRef) i nastawy wentylatora (FanEffRef)",
          "2": "FR_MD_02 — zależny wyłącznie od pozycji klapy (DamperLevelRef)"
        }
      },
      {
        "offset": 12,
        "name": "ThermostatModeState",
        "values": {
          "1": "THERMO_MD_ON — tryb termostatu włączony",
          "2": "THERMO_MD_OFF — tryb termostatu wyłączony"
        }
      },
      {
        "offset": 13,
        "name": "ThermostatModeFanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Prędkość wentylatora w trybie termostatu. EC: płynna 0–100%. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3"
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
        "name": "T3",
        "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura powietrza przed wymiennikiem wodnym (czujnik T4)."
      },
      {
        "offset": 6,
        "name": "CurtainFanSpeed",
        "description": "Prędkość wentylatora kurtyny (AC 3-biegowy: 0=stop, 1–33=bieg1, 34–66=bieg2, 67–100=bieg3)."
      },
      {
        "offset": 7,
        "name": "ValveState",
        "description": "Stan zaworu wodnego."
      },
      {
        "offset": 8,
        "name": "HeaterFanSpeed",
        "description": "Prędkość wentylatora nagrzewnicy (AC 3-biegowy)."
      },
      {
        "offset": 9,
        "name": "ContactDoor",
        "description": "Stan styku drzwiowego."
      },
      {
        "offset": 10,
        "name": "HeaterDetect",
        "description": "Procedura wykrywania nagrzewnicy (ELIS-DUO)."
      },
      {
        "offset": 11,
        "name": "AntifreezeState",
        "description": "Stan ochrony przeciwzamrożeniowej — 8 bitów dla poszczególnych trybów."
      },
      {
        "offset": 12,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatora 3V (bity 8–11). Przykład: 0x100 = OK, 0x200 = przepalony."
      },
      {
        "offset": 13,
        "name": "CurtainElectricpower",
        "description": "Moc elektrycznej nagrzewnicy kurtyny (wyjścia L1/L2 na złączu VALVE)."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT — tryb grzania",
          "3": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        }
      },
      {
        "offset": 7,
        "name": "HeaterFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "HeaterHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        }
      },
      {
        "offset": 10,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 11,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 12,
        "name": "TLeadSensorSelect",
        "values": {
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (złącze DRV)"
        }
      },
      {
        "offset": 13,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS — brak wymuszenia",
          "1": "CURT_PRG_K1 — wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 — wymuszenie SW3 na K2"
        }
      },
      {
        "offset": 14,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 15,
        "name": "HeaterFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 16,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie stand-by wentylatora w sekundach; 65535 = nieskończone"
      },
      {
        "offset": 17,
        "name": "ValveIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie zaworu w trybie stand-by w sekundach; 65535 = nieskończone. Warunek: ValveIdleDelay < FanIdleDelay"
      },
      {
        "offset": 18,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        }
      },
      {
        "offset": 19,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT — tryb grzania",
          "3": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        }
      },
      {
        "offset": 7,
        "name": "ContactDoor",
        "values": {
          "1": "DOOR_OPEN — drzwi otwarte",
          "2": "DOOR_CLOSE — drzwi zamknięte"
        }
      },
      {
        "offset": 8,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS — brak wymuszenia",
          "1": "CURT_PRG_K1 — wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 — wymuszenie SW3 na K2"
        }
      },
      {
        "offset": 9,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 10,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie stand-by wentylatora w sekundach; 65535 = nieskończone"
      }
    ]
  },
  "DRV AX": {
    "name": "DRV AX",
    "description": "Kurtyna powietrzna ELIS AX (wielobiegowe wentylatory EC)",
    "group_priority": 4,
    "tbox_zone_only": true,
    "input_registers": [
      {
        "offset": 4,
        "name": "T1",
        "description": "Temperatura powietrza zewnętrznego (czujnik T1)."
      },
      {
        "offset": 5,
        "name": "T3",
        "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3)."
      },
      {
        "offset": 6,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4)."
      },
      {
        "offset": 7,
        "name": "T5",
        "description": "Temperatura wymiennika wodnego — rura powrotna (czujnik T5)."
      },
      {
        "offset": 8,
        "name": "CurtainState1",
        "description": "Rejestr statusu sterownika — bity reprezentują aktywne funkcje i tryby pracy."
      },
      {
        "offset": 9,
        "name": "CurtainState2",
        "description": "Rozszerzenie rejestru statusu sterownika."
      },
      {
        "offset": 10,
        "name": "CurtainState3",
        "description": "Rozszerzenie rejestru statusu sterownika."
      },
      {
        "offset": 11,
        "name": "Fan1Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 1 [RPM]."
      },
      {
        "offset": 12,
        "name": "Fan2Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 2 [RPM]."
      },
      {
        "offset": 13,
        "name": "Fan3Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 3 [RPM]."
      },
      {
        "offset": 14,
        "name": "Fan4Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 4 [RPM]."
      },
      {
        "offset": 15,
        "name": "Fan5Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 5 [RPM]."
      },
      {
        "offset": 16,
        "name": "Fan6Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 6 [RPM]."
      },
      {
        "offset": 17,
        "name": "Fan7Speed",
        "description": "Rzeczywista prędkość wentylatora nawiewnego 7 [RPM]."
      },
      {
        "offset": 18,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min]."
      },
      {
        "offset": 19,
        "name": "ValveRelaysState",
        "description": "Aktualny status zaworu na stykach VALVE_RELAYS (L1, L2). 0=otwarty, 1=zamknięty."
      },
      {
        "offset": 20,
        "name": "Valve0-10State",
        "description": "Aktualny status zaworu 0–10V."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "OFF — urządzenie wyłączone",
          "1": "HEAT — tryb grzania",
          "2": "VENT — wentylacja",
          "3": "SMART — tryb automatyczny"
        }
      },
      {
        "offset": 5,
        "name": "FanWorkMode",
        "values": {
          "0": "AUTO",
          "1": "MANUAL"
        },
        "description": "Tryb pracy wentylatora. Domyślnie MANUAL."
      },
      {
        "offset": 6,
        "name": "Program",
        "description": "Program pracy kurtyny (K1, K2...). Domyślnie K1."
      },
      {
        "offset": 7,
        "name": "FWM_ManualHeatVentRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wydajność wentylatora w trybie MANUAL (HEAT lub VENT). Domyślnie 50%."
      },
      {
        "offset": 8,
        "name": "FWM_StandbyRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wydajność wentylatora w trybie STANDBY. Domyślnie 20%."
      },
      {
        "offset": 9,
        "name": "FWM_AutoHeatVentMin",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Minimalna wydajność wentylatora w trybie AUTO (HEAT/VENT). Warunek: Min < Max. Domyślnie 0%."
      },
      {
        "offset": 10,
        "name": "FWM_AutoHeatVentMax",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Maksymalna wydajność wentylatora w trybie AUTO (HEAT/VENT). Warunek: Max > Min. Domyślnie 100%."
      },
      {
        "offset": 11,
        "name": "EWM_HeatT3Ref",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura zadana nawiewu dla trybu grzania (HEAT). Domyślnie 320 = 32.0°C."
      },
      {
        "offset": 12,
        "name": "EWM_HeatT5Max",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Ograniczenie temperatury wody powrotnej dla trybu grzania. Domyślnie 320 = 32.0°C."
      },
      {
        "offset": 13,
        "name": "EWM_HeatT5LimitMode",
        "values": {
          "1": "ON — aktywne",
          "2": "OFF — wyłączone"
        },
        "description": "Włącz/wyłącz ograniczenie temperatury wody powrotnej. Domyślnie OFF."
      },
      {
        "offset": 14,
        "name": "PreheatT5Ref",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura wody powrotnej po której włącza się wentylator (PREHEAT). Domyślnie 300 = 30.0°C."
      },
      {
        "offset": 15,
        "name": "StandbyFanIdleDelay",
        "min": 0,
        "max": 9999,
        "unit": "s",
        "description": "Opóźnienie pracy wentylatora w trybie STANDBY [s]. Domyślnie 300s. Warunek: ≥ StandbyValveIdleDelay."
      },
      {
        "offset": 16,
        "name": "StandbyValveIdleDelay",
        "min": 0,
        "max": 9999,
        "unit": "s",
        "description": "Opóźnienie pracy zaworu w trybie STANDBY [s]. Domyślnie 300s. Warunek: ≤ StandbyFanIdleDelay."
      },
      {
        "offset": 17,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "ON — aktywne",
          "2": "OFF — wyłączone"
        },
        "description": "Ochrona przeciwzamrożeniowa magazynu. Domyślnie OFF."
      },
      {
        "offset": 18,
        "name": "AntifreezeWareTempOn",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura progowa aktywacji ochrony przeciwzamrożeniowej magazynu. Domyślnie 70 = 7.0°C."
      },
      {
        "offset": 19,
        "name": "AntifreezeWaterExchangeOn",
        "values": {
          "1": "ON — aktywne",
          "2": "OFF — wyłączone"
        },
        "description": "Ochrona przeciwzamrożeniowa wymiennika wodnego. Domyślnie ON."
      },
      {
        "offset": 20,
        "name": "AntifreezeWaterExchangeT3",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Progowa temperatura nawiewu T3 dla aktywacji ochrony wymiennika. Domyślnie 70 = 7.0°C."
      },
      {
        "offset": 21,
        "name": "AntifreezeWaterExchangeT5",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Progowa temperatura wody T5 dla aktywacji ochrony wymiennika. Domyślnie 70 = 7.0°C."
      },
      {
        "offset": 22,
        "name": "PreheatOnOff",
        "values": {
          "1": "ON",
          "2": "OFF"
        },
        "description": "Włącz/wyłącz podgrzewanie wstępne (PREHEAT). Domyślnie OFF."
      },
      {
        "offset": 23,
        "name": "FilterMaxWorkTime",
        "description": "Kasowanie licznika czasu pracy filtra. Domyślnie OFF."
      },
      {
        "offset": 24,
        "name": "DoorOpenFreqAlphaThreshold",
        "min": 0,
        "max": 100,
        "description": "Próg detekcji częstotliwości otwierania drzwi w trybie SMART. Domyślnie 60."
      },
      {
        "offset": 25,
        "name": "DoorOpenFreqTimePeriod",
        "unit": "s",
        "description": "Okres detekcji częstotliwości otwierania drzwi w trybie SMART. Domyślnie 300s."
      },
      {
        "offset": 26,
        "name": "FWMAutoAddHeatMin",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Minimalna wydajność wentylatora w trybie dogrzewania (ADD HEAT), Auto. Domyślnie 5%. Warunek: Min < Max."
      },
      {
        "offset": 27,
        "name": "FWMAutoAddHeatMax",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Maksymalna wydajność wentylatora w trybie dogrzewania (ADD HEAT), Auto. Domyślnie 5%. Warunek: Min < Max."
      },
      {
        "offset": 28,
        "name": "EWMSmartT124h",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura zadana przejścia VENT→HEAT w trybie SMART. Domyślnie 170 = 17.0°C. Warunek: ≤ EWMSmartT13h − 1K."
      },
      {
        "offset": 29,
        "name": "EWMSmartT13h",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura zadana przejścia HEAT→VENT w trybie SMART. Domyślnie 210 = 21.0°C. Warunek: ≥ EWMSmartT124h + 1K."
      },
      {
        "offset": 30,
        "name": "HeatT3_PI_KP",
        "description": "Wzmocnienie KP regulatora PI temperatury nawiewu T3. Domyślnie 3."
      },
      {
        "offset": 31,
        "name": "HeatT3_PI_TI",
        "unit": "s",
        "description": "Czas podwajania TI regulatora PI temperatury nawiewu T3. Domyślnie 180s."
      },
      {
        "offset": 32,
        "name": "HeatT5_PI_KP",
        "description": "Wzmocnienie KP regulatora PI temperatury wody powrotnej T5. Domyślnie 3."
      },
      {
        "offset": 33,
        "name": "HeatT5_PI_TI",
        "unit": "s",
        "description": "Czas TI regulatora PI temperatury wody powrotnej T5. Domyślnie 180s."
      }
    ],
    "holding_registers_group": []
  },
  "DRV V": {
    "name": "DRV V",
    "description": "Nagrzewnica wodna z wentylatorem EC",
    "group_priority": 5,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura przy suficie (czujnik T3)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4)."
      },
      {
        "offset": 6,
        "name": "FanEff",
        "description": "Prędkość wentylatora (AC 3-biegowy)."
      },
      {
        "offset": 7,
        "name": "AntifreezeeState",
        "description": "Stan ochrony przeciwzamrożeniowej magazynu — 8 bitów."
      },
      {
        "offset": 8,
        "name": "DestStatus",
        "description": "Stan destratyfikacji: aktywna gdy (DestTempRef > Td–Tm) oraz (Tz > Tm)."
      },
      {
        "offset": 9,
        "name": "FilterPressureState",
        "description": "Stan presostatu filtra."
      },
      {
        "offset": 10,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatorów (bity). Przykład: 0x100 = OK, 0x200 = przepalony."
      },
      {
        "offset": 11,
        "name": "ValveState",
        "description": "Stan zaworu wodnego."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "default": 0,
        "values": {
          "0": "WM_DEF — domyślny po resecie",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — grzanie automatyczne",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 10,
        "name": "TleadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus",
          "3": "TSL_T4 — czujnik T4 (powietrze przed wymiennikiem)"
        }
      },
      {
        "offset": 11,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF — wymuś wyłączenie",
          "2": "DEST_MDF_ON — wymuś włączenie"
        }
      },
      {
        "offset": 12,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF — wyłączony",
          "2": "DEST_MD_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO niezależny"
        }
      },
      {
        "offset": 13,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K×0.1"
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
          "0": "WM_DEF — domyślny po resecie",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — grzanie automatyczne",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — wentylacja"
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
          "1": "DEST_MDF_OFF — wymuś wyłączenie",
          "2": "DEST_MDF_ON — wymuś włączenie"
        }
      },
      {
        "offset": 7,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K×0.1"
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
  "DRV M": {
    "name": "DRV M",
    "description": "Nagrzewnica wodna z wentylatorem EC (płynna regulacja)",
    "group_priority": 6,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4)."
      },
      {
        "offset": 6,
        "name": "FanEff",
        "description": "Wydajność wentylatora EC — prędkość obrotowa [rpm]."
      },
      {
        "offset": 7,
        "name": "AntifreezeeState",
        "description": "Stan ochrony przeciwzamrożeniowej — 8 bitów."
      },
      {
        "offset": 8,
        "name": "DestStatus",
        "description": "Stan destratyfikacji: aktywna gdy (DestTempRef > Td–Tm) oraz (Tz > Tm)."
      },
      {
        "offset": 9,
        "name": "FanEcConnect",
        "description": "Status połączenia wentylatora EC z urządzeniem DRV M."
      },
      {
        "offset": 10,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatorów EC/3V/dachowych (bity). Przykład: 0x100 = wentylator 3V OK."
      },
      {
        "offset": 11,
        "name": "ValveState",
        "description": "Stan zaworu wodnego."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "default": 0,
        "values": {
          "0": "WM_DEF — domyślny po resecie",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — grzanie automatyczne",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
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
        "unit": "°C×0.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 10,
        "name": "TleadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus",
          "3": "TSL_T4 — czujnik T4 (powietrze przed wymiennikiem)"
        }
      },
      {
        "offset": 11,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF — wymuś wyłączenie",
          "2": "DEST_MDF_ON — wymuś włączenie"
        }
      },
      {
        "offset": 12,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF — wyłączony",
          "2": "DEST_MD_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO niezależny"
        }
      },
      {
        "offset": 13,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K×0.1"
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
          "0": "WM_DEF — domyślny po resecie",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — grzanie automatyczne",
          "3": "WM_HT_MANUAL — grzanie ręczne",
          "4": "WM_COOL_AUTO — chłodzenie automatyczne",
          "5": "WM_COOL_MANUAL — chłodzenie ręczne",
          "6": "WM_VENT — wentylacja"
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
          "1": "DEST_MDF_OFF — wymuś wyłączenie",
          "2": "DEST_MDF_ON — wymuś włączenie"
        }
      },
      {
        "offset": 7,
        "name": "DestTempRef",
        "default": 50,
        "min": 0,
        "max": 100,
        "unit": "K×0.1"
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
  "DRV D": {
    "name": "DRV D",
    "description": "Destratyfikator (DRV D / LEO D)",
    "group_priority": 7,
    "input_registers": [
      {
        "offset": 4,
        "name": "T3",
        "description": "Temperatura przy suficie (czujnik T3)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4)."
      },
      {
        "offset": 6,
        "name": "FanEff",
        "description": "Prędkość wentylatora (AC 3-biegowy)."
      },
      {
        "offset": 7,
        "name": "DestStatus",
        "description": "Stan destratyfikacji: aktywna gdy (DestTempRef > Td–Tm) oraz (Tz > Tm). Td=T3, Tm=TLeadVal lub T4."
      },
      {
        "offset": 8,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatora 3V (bity 8–11). Przykład: 0x100 = OK, 0x200 = przepalony."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "1": "WM_OFF — odszranianie wyłączone",
          "2": "WM_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "WM_AUTO_INDEPEND — AUTO niezależny",
          "4": "WM_MANUAL — tryb ręczny"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 8,
        "name": "TLeadSensorSelect",
        "values": {
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (złącze DRV)"
        }
      },
      {
        "offset": 10,
        "name": "DestTempRef",
        "min": 0,
        "max": 100,
        "unit": "K×0.1",
        "description": "Próg odszraniania: warunek DestTempRef > Td − Tm (Td=T3 sufit, Tm=czujnik prowadzący)"
      },
      {
        "offset": 11,
        "name": "WorkModeTempRef",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1",
        "description": "Docelowa temperatura przy suficie w trybie ręcznym; warunek: WorkModeTempRef > czujnik prowadzący"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "1": "WM_OFF — odszranianie wyłączone",
          "2": "WM_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "WM_AUTO_INDEPEND — AUTO niezależny",
          "4": "WM_MANUAL — tryb ręczny"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "DestTempRef",
        "min": 0,
        "max": 100,
        "unit": "K×0.1",
        "description": "Próg odszraniania: warunek DestTempRef > Td − Tm (Td=T3 sufit, Tm=czujnik prowadzący)"
      },
      {
        "offset": 7,
        "name": "WorkModeTempRef",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1",
        "description": "Docelowa temperatura przy suficie w trybie ręcznym; warunek: WorkModeTempRef > czujnik prowadzący"
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
        "name": "T3",
        "description": "Temperatura przy suficie (czujnik T3)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4)."
      },
      {
        "offset": 6,
        "name": "FanEff",
        "description": "Prędkość wentylatora (AC 3-biegowy)."
      },
      {
        "offset": 7,
        "name": "AntifreezeeState",
        "description": "Stan ochrony przeciwzamrożeniowej."
      },
      {
        "offset": 8,
        "name": "DestStatus",
        "description": "Stan destratyfikacji."
      },
      {
        "offset": 9,
        "name": "ThermalContactState",
        "description": "Stan styku termicznego. Gdy = 1: FanEffRef → 100, ElectricHeaterPTCPower → 0 (ochrona przed przegrzaniem)."
      },
      {
        "offset": 10,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatorów EC/3V/dachowych (bity). Przykład: 0x100 = wentylator 3V OK."
      },
      {
        "offset": 11,
        "name": "PTCHeaterPowerState",
        "description": "Moc nagrzewnicy elektrycznej PTC. LEO EL L (SW3.5=K1) lub LEO EL S (SW3.5=K2)."
      },
      {
        "offset": 12,
        "name": "ElectricHeaterType",
        "description": "Typ elektrycznej nagrzewnicy."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_TS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_AUTO — tryb automatyczny",
          "3": "WM_HEAT — tryb grzania",
          "4": "WM_VENT — wentylacja",
          "5": "WM_RAW — tryb surowy"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 10,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (złącze DRV)"
        }
      },
      {
        "offset": 11,
        "name": "DestModeForce",
        "values": {
          "1": "DEST_MDF_OFF — wymuszanie destratyfikacji wyłączone",
          "2": "DEST_MDF_ON — wymuszanie destratyfikacji włączone"
        }
      },
      {
        "offset": 12,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF — destratyfikacja wyłączona",
          "2": "DEST_MD_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO niezależny"
        }
      },
      {
        "offset": 13,
        "name": "DestTempRef",
        "min": 0,
        "max": 100,
        "unit": "K×0.1",
        "description": "Próg destratyfikacji: warunek DestTempRef > Td − Tm (Td=T3 sufit, Tm=czujnik prowadzący)"
      },
      {
        "offset": 15,
        "name": "ElectricHeaterPTCPower",
        "values": {
          "1": "Off — grzanie wyłączone",
          "2": "1 — 1 stopień grzania",
          "3": "2 — 2 stopnie grzania",
          "4": "3 — 3 stopnie grzania (tylko SW3.5=K1)"
        },
        "description": "SW3.5=K1 (3 stopnie): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 stopnie): 1=Off, 2=1heat, 3=2heat, 4=2heat"
      },
      {
        "offset": 16,
        "name": "ModeAuto_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Prędkość wentylatora w trybie AUTO. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3"
      },
      {
        "offset": 17,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Prędkość wentylatora w trybie ręcznym. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_TS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_AUTO — tryb automatyczny",
          "3": "WM_HEAT — tryb grzania",
          "4": "WM_VENT — wentylacja",
          "5": "WM_RAW — tryb surowy"
        }
      },
      {
        "offset": 5,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "DestMode",
        "values": {
          "1": "DEST_MD_OFF — destratyfikacja wyłączona",
          "2": "DEST_MD_AUTO_DEPEND — AUTO zależny od trybu pracy",
          "3": "DEST_MD_AUTO_INDEPEND — AUTO niezależny"
        }
      },
      {
        "offset": 8,
        "name": "ElectricHeaterPTCPower",
        "values": {
          "1": "Off — grzanie wyłączone",
          "2": "1 — 1 stopień grzania",
          "3": "2 — 2 stopnie grzania",
          "4": "3 — 3 stopnie grzania (tylko SW3.5=K1)"
        },
        "description": "SW3.5=K1 (3 stopnie): 1=Off, 2=1heat, 3=2heat, 4=3heat. SW3.5=K2 (2 stopnie): 1=Off, 2=1heat, 3=2heat, 4=2heat"
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
        "name": "T3",
        "description": "Temperatura przy suficie (czujnik T3)."
      },
      {
        "offset": 6,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4)."
      },
      {
        "offset": 8,
        "name": "ExternalGasDetectTH1",
        "description": "Sygnał zewnętrznego czujnika gazu — próg pierwszy."
      },
      {
        "offset": 9,
        "name": "ExternalGasDetectTH2",
        "description": "Sygnał zewnętrznego czujnika gazu — próg drugi."
      },
      {
        "offset": 10,
        "name": "ExternalGasDetectVal",
        "description": "Stężenie gazu — wejście 0–10V DC (wymagana kalibracja czujnika)."
      },
      {
        "offset": 15,
        "name": "AntifreezeStateWarehouse",
        "description": "Stan ochrony przeciwzamrożeniowej magazynu."
      },
      {
        "offset": 16,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatora."
      },
      {
        "offset": 17,
        "name": "GasAlarmState",
        "description": "Alarm Robur — gaz/płomień. Odczyt z zacisku nr 6 (terminal wewnątrz nagrzewnicy)."
      },
      {
        "offset": 18,
        "name": "STBAlarmState",
        "description": "Alarm temperatury wyciągu powietrza (STB)."
      },
      {
        "offset": 19,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min]."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT_AUTO — automatyczne grzanie",
          "3": "WM_HEAT_MANUAL — ręczne grzanie",
          "4": "WM_VENTILATION — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "ON — włączony",
          "2": "OFF — wyłączony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 12,
        "name": "GasAlarmReset",
        "values": {
          "0": "RO — tylko odczyt",
          "1": "ON — wysyłanie sygnału resetującego (ciągłe)",
          "2": "OFF — zatrzymanie sygnału resetującego"
        },
        "description": "Reset alarmu gazowego/płomieniowego. Czas resetu nie powinien przekraczać 5 s (następnie ustawić wartość na 0x02)"
      },
      {
        "offset": 14,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 15,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 16,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (temperatura pomieszczenia)"
        }
      },
      {
        "offset": 18,
        "name": "STBTemperatureAlarmOn",
        "min": 810,
        "max": 1200,
        "unit": "°C×0.1",
        "description": "Temperatura progowa alarmu STB (Input Register 0x12). Alarm aktywny gdy wartość ustawiona > T3 (IR 0x05). Domyślna wartość 900 zapewnia wystąpienie błędu przed rzeczywistym alarmem STB Robur (który wymaga ręcznego resetu ze skrzynki sterowniczej)"
      },
      {
        "offset": 19,
        "name": "FilterTimeCntRst",
        "values": {
          "0": "FLT_CNT_RST_NS — tylko odczyt (po resecie)",
          "1": "FLT_CNT_RST — reset licznika czasu filtra (FilterWorkTime = 0)"
        }
      },
      {
        "offset": 20,
        "name": "STBTemperatureAlarmOff",
        "min": 610,
        "max": 800,
        "unit": "°C×0.1",
        "description": "Temperatura resetowania alarmu STB. Reset możliwy gdy wartość ustawiona > T3 (IR 0x05). Dodatkowy warunek: STB_T_OFF < STB_T_REF"
      },
      {
        "offset": 21,
        "name": "STBAlarmReset",
        "values": {
          "1": "ON — reset alarmu aktywny",
          "2": "OFF — reset alarmu nieaktywny"
        },
        "description": "Jeśli STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), rejestr zostanie automatycznie ustawiony na 0x02 (OFF)"
      },
      {
        "offset": 22,
        "name": "ContModeFanSpeedRef",
        "values": {
          "0": "Fan OFF — wentylator wyłączony",
          "100": "Fan ON — wentylator włączony"
        },
        "description": "Ustawienie wydajności wentylatora po osiągnięciu temperatury docelowej"
      },
      {
        "offset": 23,
        "name": "GasBurnerLvlRef",
        "values": {
          "0": "RO — tylko odczyt",
          "1": "FIRST_STEP — pierwszy stopień spalania",
          "2": "SECOND_STEP — drugi stopień spalania"
        },
        "description": "Ustawienie stopnia spalania gazu (aktywne tylko w trybie ręcznego grzania WM_HEAT_MANUAL)"
      }
    ],
    "holding_registers_group": []
  },
  "DRV R KM NEXT": {
    "name": "DRV R KM NEXT",
    "description": "Nagrzewnica gazowa ROBUR NEXT z klapą mieszającą",
    "group_priority": 11,
    "input_registers": [
      {
        "offset": 4,
        "name": "T1",
        "description": "Temperatura powietrza świeżego (czujnik T1)."
      },
      {
        "offset": 5,
        "name": "T3",
        "description": "Temperatura wyciągu powietrza (czujnik T3)."
      },
      {
        "offset": 6,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4)."
      },
      {
        "offset": 8,
        "name": "ExternalGasDetectTH1",
        "description": "Sygnał zewnętrznego czujnika gazu — próg pierwszy."
      },
      {
        "offset": 9,
        "name": "ExternalGasDetectTH2",
        "description": "Sygnał zewnętrznego czujnika gazu — próg drugi."
      },
      {
        "offset": 10,
        "name": "ExternalGasDetectVal",
        "description": "Stężenie gazu — wejście 0–10V DC."
      },
      {
        "offset": 11,
        "name": "FanRoofTK",
        "description": "Sygnał TK z wentylatora dachowego."
      },
      {
        "offset": 12,
        "name": "FanRoofEff",
        "description": "Wydajność wentylatora dachowego."
      },
      {
        "offset": 13,
        "name": "DamperLevel",
        "description": "Aktualna pozycja klapy mieszania."
      },
      {
        "offset": 14,
        "name": "DamperForceState",
        "description": "Stan wymuszenia pozycji klapy (tryb DamperForceMode = ON)."
      },
      {
        "offset": 15,
        "name": "AntifreezeStateWarehouse",
        "description": "Stan ochrony przeciwzamrożeniowej magazynu."
      },
      {
        "offset": 16,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatora."
      },
      {
        "offset": 17,
        "name": "GasAlarmState",
        "description": "Alarm Robur — gaz/płomień."
      },
      {
        "offset": 18,
        "name": "STBAlarmState",
        "description": "Alarm STB — temperatura wyciągu powietrza."
      },
      {
        "offset": 19,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min]."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT_AUTO — automatyczne grzanie",
          "3": "WM_HEAT_MANUAL — ręczne grzanie",
          "4": "WM_VENTILATION — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "ON — włączony",
          "2": "OFF — wyłączony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "DamperForceMode",
        "values": {
          "0": "DAMPER_FMD_NS — tylko odczyt",
          "1": "DAMPER_FMD_OFF — wymuszanie wyłączone",
          "2": "DAMPER_FMD_ON — wymuszanie włączone (jeśli T1 < DamperForceTempRef)"
        }
      },
      {
        "offset": 8,
        "name": "DamperForceTempRef",
        "min": -100,
        "max": 150,
        "unit": "°C×0.1",
        "description": "Temperatura wymuszonego otwarcia klapy. Połączona z T1 (temperatura świeżego powietrza — IR 0x04)"
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
        "description": "Pozycja klapy mieszającej"
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
          "0": "RO — tylko odczyt",
          "1": "ON — wysyłanie sygnału resetującego (ciągłe)",
          "2": "OFF — zatrzymanie sygnału resetującego"
        },
        "description": "Reset alarmu gazowego/płomieniowego. Czas resetu nie powinien przekraczać 5 s (następnie ustawić wartość na 0x02)"
      },
      {
        "offset": 13,
        "name": "FanRoofForceEffRef",
        "min": -100,
        "max": 100,
        "unit": "%",
        "description": "Wymuszenie prędkości wentylatora dachowego — wartość dodawana do aktualnej prędkości"
      },
      {
        "offset": 14,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 15,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 16,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (temperatura pomieszczenia)"
        }
      },
      {
        "offset": 17,
        "name": "FanRoofMode",
        "values": {
          "0": "FR_MD_NS — tylko odczyt",
          "1": "FR_MD_01 — zależny od pozycji klapy (DamperLevelRef) i nastawy wentylatora (FanEffRef)",
          "2": "FR_MD_02 — zależny wyłącznie od pozycji klapy (DamperLevelRef)"
        }
      },
      {
        "offset": 18,
        "name": "STBTemperatureAlarmOn",
        "min": 810,
        "max": 1200,
        "unit": "°C×0.1",
        "description": "Temperatura progowa alarmu STB (IR 0x12). Alarm aktywny gdy wartość ustawiona > T3 (IR 0x05)"
      },
      {
        "offset": 19,
        "name": "FilterTimeCntRst",
        "values": {
          "0": "FLT_CNT_RST_NS — tylko odczyt (po resecie)",
          "1": "FLT_CNT_RST — reset licznika czasu filtra (FilterWorkTime = 0)"
        }
      },
      {
        "offset": 20,
        "name": "STBTemperatureAlarmOff",
        "min": 610,
        "max": 800,
        "unit": "°C×0.1",
        "description": "Temperatura resetowania alarmu STB. Reset możliwy gdy wartość ustawiona > T3. Dodatkowy warunek: STB_T_OFF < STB_T_REF"
      },
      {
        "offset": 21,
        "name": "STBAlarmReset",
        "values": {
          "1": "ON — reset alarmu aktywny",
          "2": "OFF — reset alarmu nieaktywny"
        },
        "description": "Jeśli STB_T (T3, IR 0x03) < STBTemperatureAlarmOff (HR 0x14), rejestr zostanie automatycznie ustawiony na 0x02 (OFF)"
      },
      {
        "offset": 22,
        "name": "ContModeFanSpeedRef",
        "values": {
          "0": "Fan OFF — wentylator wyłączony",
          "100": "Fan ON — wentylator włączony"
        },
        "description": "Ustawienie wydajności wentylatora po osiągnięciu temperatury docelowej"
      },
      {
        "offset": 23,
        "name": "GasBurnerLvlRef",
        "values": {
          "0": "RO — tylko odczyt",
          "1": "FIRST_STEP — pierwszy stopień spalania",
          "2": "SECOND_STEP — drugi stopień spalania"
        },
        "description": "Ustawienie stopnia spalania gazu (aktywne tylko w trybie ręcznego grzania WM_HEAT_MANUAL)"
      }
    ],
    "holding_registers_group": []
  },
  "DRV COOL": {
    "name": "DRV COOL",
    "description": "Nagrzewnica/chłodnica wodna",
    "group_priority": 12,
    "input_registers": [
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura w pomieszczeniu (czujnik T4)."
      },
      {
        "offset": 6,
        "name": "FanEff",
        "description": "Prędkość wentylatora (AC 3-biegowy)."
      },
      {
        "offset": 7,
        "name": "AntifreezeState",
        "description": "Stan ochrony przeciwzamrożeniowej magazynu — 8 bitów."
      },
      {
        "offset": 9,
        "name": "FilterPressureState",
        "description": "Stan presostatu filtra."
      },
      {
        "offset": 10,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatorów (bity). Przykład: 0x100 = OK, 0x200 = przepalony."
      },
      {
        "offset": 11,
        "name": "ValveState",
        "description": "Stan zaworu wodnego."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_DEF — wartość domyślna po resecie zasilania",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HT_AUTO — automatyczne grzanie",
          "3": "WM_HT_MANUAL — ręczne grzanie",
          "4": "WM_COOL_AUTO — automatyczne chłodzenie",
          "5": "WM_COOL_MANUAL — ręczne chłodzenie",
          "6": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        }
      },
      {
        "offset": 6,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      },
      {
        "offset": 7,
        "name": "FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 9,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 10,
        "name": "TLeadSensorSelect",
        "values": {
          "0": "TSL_TNS — tylko odczyt",
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (powietrze przed wymiennikiem wodnym)"
        }
      },
      {
        "offset": 15,
        "name": "ModeAuto_FanEffRefMin",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Minimalna wydajność wentylatora w trybie AUTO. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3"
      },
      {
        "offset": 16,
        "name": "ModeAuto_FanEffRefMax",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Maksymalna wydajność wentylatora w trybie AUTO. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3"
      },
      {
        "offset": 17,
        "name": "ModeManual_FanEffRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wydajność wentylatora po osiągnięciu temperatury docelowej w trybie MANUAL. AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1, 34–66=bieg 2, 67–100=bieg 3"
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
        "name": "ambient_temp_value",
        "description": "Temperatura zewnętrzna."
      },
      {
        "offset": 10,
        "name": "supply_temp_value",
        "description": "Temperatura powietrza nawiewanego."
      },
      {
        "offset": 11,
        "name": "return_temp_value",
        "description": "Temperatura powietrza wyciąganego."
      },
      {
        "offset": 12,
        "name": "water_temp_value",
        "description": "Temperatura wymiennika wodnego."
      },
      {
        "offset": 13,
        "name": "TempRoom_ADD",
        "description": "Temperatura z dodatkowego czujnika pokojowego."
      },
      {
        "offset": 14,
        "name": "recirculation_damper_level",
        "description": "Aktualna pozycja klapy recyrkulacji."
      },
      {
        "offset": 16,
        "name": "swirl_diffuser_position",
        "description": "Pozycja dyfuzora wirowego."
      },
      {
        "offset": 17,
        "name": "rotary_level",
        "description": "Poziom obrotowego (rotary)."
      },
      {
        "offset": 18,
        "name": "fan_supply_flow",
        "description": "Przepływ powietrza nawiewanego."
      },
      {
        "offset": 19,
        "name": "gas_heating_value",
        "description": "Wartość ogrzewania gazowego."
      },
      {
        "offset": 20,
        "name": "CO2_status",
        "description": "Status CO2 — wartość LSB (MSB ignorowany)."
      },
      {
        "offset": 21,
        "name": "Rooftop_work_mode",
        "description": "Zadany tryb pracy jednostki dachowej — wartość LSB."
      },
      {
        "offset": 22,
        "name": "Rooftop_current_work_mode",
        "description": "Aktualny tryb pracy jednostki dachowej — wartość LSB."
      },
      {
        "offset": 23,
        "name": "Alarm",
        "description": "Stan alarmów — wartość LSB."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_ON — urządzenie włączone",
          "3": "WM_THERM — tryb termostatyczny"
        },
        "description": "Rejestr 16-bit: MSB ignorowany, LSB = tryb pracy"
      },
      {
        "offset": 5,
        "name": "fan_eff",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajności wentylatora EC, płynna regulacja 0–100%"
      },
      {
        "offset": 6,
        "name": "fan_eff_CO2_I",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajności wentylatora EC dla 1. progu czujnika CO2"
      },
      {
        "offset": 7,
        "name": "fan_eff_CO2_II",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Nastawa wydajności wentylatora EC dla 2. progu czujnika CO2"
      },
      {
        "offset": 8,
        "name": "recirculation_mode",
        "values": {
          "0": "RM_AUTO — tryb automatyczny",
          "1": "RM_MANUAL — tryb ręczny"
        },
        "description": "Rejestr 16-bit: MSB ignorowany, LSB = tryb recyrkulacji"
      },
      {
        "offset": 9,
        "name": "recirculation_value",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wartość recyrkulacji, płynna regulacja 0–100%"
      },
      {
        "offset": 10,
        "name": "recirculation_value_CO2_I",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wartość recyrkulacji dla 1. progu czujnika CO2"
      },
      {
        "offset": 11,
        "name": "recirculation_value_CO2_II",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wartość recyrkulacji dla 2. progu czujnika CO2"
      },
      {
        "offset": 12,
        "name": "work_mode_NW",
        "values": {
          "0": "WM_NW_AUTO — tryb automatyczny dyfuzora",
          "1": "WM_NW_MANUAL — tryb ręczny dyfuzora"
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
        "description": "Poziom otwarcia dyfuzora wirowego w trybie chłodzenia"
      },
      {
        "offset": 16,
        "name": "temperature_ref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1",
        "description": "Docelowa temperatura pomieszczenia"
      },
      {
        "offset": 17,
        "name": "temperature_room",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1",
        "description": "Temperatura pomieszczenia przekazywana do urządzenia przez Modbus"
      },
      {
        "offset": 18,
        "name": "room_sensor_selection",
        "values": {
          "1": "TSL_PREFERRED_TLEAD — wartość przez Modbus (gdy lokalny czujnik CUBE jest aktywny)",
          "2": "TSL_TLEAD — wartość przez Modbus (tylko gdy lokalny czujnik CUBE jest wyłączony)",
          "3": "TSL_PREFERRED_LOCAL — czujnik lokalny CUBE (gdy jest aktywny)"
        },
        "description": "Wybór źródła temperatury pomieszczenia"
      },
      {
        "offset": 19,
        "name": "CO2_status",
        "values": {
          "0": "CO2_STAT_OK — status CO2 OK",
          "1": "CO2_STAT_L1 — poziom CO2 próg 1",
          "2": "CO2_STAT_L2 — poziom CO2 próg 2"
        },
        "description": "Status CO2 zapisywany przez T-box do urządzenia. Rejestr 16-bit: MSB ignorowany, LSB = status"
      },
      {
        "offset": 20,
        "name": "CO2_source",
        "values": {
          "0": "CO2_SOURCE_LOCAL — lokalny czujnik CO2 w CUBE",
          "1": "CO2_SOURCE_TBOX — źródło CO2 z T-box"
        },
        "description": "Wybór źródła danych CO2. Rejestr 16-bit: MSB ignorowany, LSB = źródło"
      }
    ],
    "holding_registers_group": []
  },
  "DRV LUNA": {
    "name": "DRV LUNA",
    "description": "Nagrzewnica LUNA",
    "group_priority": 14,
    "tbox_zone_only": true,
    "input_registers": [
      {
        "offset": 5,
        "name": "RoomTemperatureValue",
        "description": "Temperatura zmierzona przez czujnik T4 (temperatura w pomieszczeniu)."
      },
      {
        "offset": 6,
        "name": "LeadTemperatureValue",
        "description": "Temperatura z czujnika wiodącego (MODBUS, ROOM, SUPPLY lub INTAKE — zależnie od ustawień)."
      },
      {
        "offset": 7,
        "name": "IntakeTemperatureValue",
        "description": "Temperatura zmierzona przez czujnik Ti3 (powietrze wlotowe)."
      },
      {
        "offset": 8,
        "name": "SupplyTemperatureValue",
        "description": "Temperatura zmierzona przez czujnik T1 (powietrze wylotowe)."
      },
      {
        "offset": 9,
        "name": "HeaterTemperatureValue",
        "description": "Temperatura zmierzona przez czujnik T2 (wymiennik wodny)."
      },
      {
        "offset": 10,
        "name": "FanEfficiencyValue",
        "description": "Aktualna wydajność wentylatora."
      },
      {
        "offset": 11,
        "name": "DrainPumpAlarm",
        "description": "Stan alarmu pompy skroplin."
      },
      {
        "offset": 12,
        "name": "FilterWorkTime",
        "description": "Czas pracy filtra. Czas rzeczywisty = 5 × wartość [min]."
      },
      {
        "offset": 13,
        "name": "ValveHTValue",
        "description": "Aktualny stan zaworu grzewczego (HT)."
      },
      {
        "offset": 14,
        "name": "ValveCLValue",
        "description": "Aktualny stan zaworu chłodniczego (CL)."
      },
      {
        "offset": 15,
        "name": "Smart1State",
        "description": "Stan trybu SMART I — informacja czy tryb jest aktywny."
      },
      {
        "offset": 16,
        "name": "Smart2State",
        "description": "Stan trybu SMART II — informacja czy tryb jest aktywny."
      },
      {
        "offset": 17,
        "name": "Smart3State",
        "description": "Stan trybu SMART III — informacja czy tryb jest aktywny."
      },
      {
        "offset": 18,
        "name": "TechnologicalHeatAlarm",
        "description": "Brak ciepła ze źródła zasilania."
      },
      {
        "offset": 19,
        "name": "Smart2LowTempAlarm",
        "description": "Alarm niskiej temperatury nawiewu — II stan."
      },
      {
        "offset": 20,
        "name": "SupplyTemperatureValue2",
        "description": "Temperatura powietrza wylotowego — dodatkowy odczyt (czujnik T1)."
      },
      {
        "offset": 21,
        "name": "HeaterTemperatureValue2",
        "description": "Temperatura wymiennika wodnego — dodatkowy odczyt (czujnik T2)."
      },
      {
        "offset": 22,
        "name": "IntakeTemperatureValue2",
        "description": "Temperatura powietrza wlotowego — dodatkowy odczyt (czujnik T3)."
      },
      {
        "offset": 23,
        "name": "RoomTemperatureValue2",
        "description": "Temperatura powietrza w pomieszczeniu — dodatkowy odczyt (czujnik T4)."
      },
      {
        "offset": 24,
        "name": "InputDIState",
        "description": "Stan wejścia cyfrowego DI."
      },
      {
        "offset": 25,
        "name": "FanWorkTime",
        "description": "Czas pracy wentylatora."
      },
      {
        "offset": 26,
        "name": "PreheatState",
        "description": "Stan funkcji podgrzewania wstępnego."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 5,
        "name": "OnOff",
        "values": {
          "0": "OFF — wyłączone",
          "1": "ON — włączone"
        },
        "description": "Włącz/wyłącz urządzenie. Domyślnie OFF."
      },
      {
        "offset": 6,
        "name": "ManualWorkMode",
        "values": {
          "0": "AUTO",
          "1": "MANUAL"
        },
        "description": "Tryb pracy wentylatora. Domyślnie MANUAL."
      },
      {
        "offset": 7,
        "name": "DestratificationMode",
        "values": {
          "0": "OFF",
          "1": "ON"
        },
        "description": "Włącz/wyłącz tryb destratyfikacji. Aktywne gdy LowCeilingMode=OFF."
      },
      {
        "offset": 8,
        "name": "LowCeilingMode",
        "values": {
          "0": "OFF",
          "1": "ON"
        },
        "description": "Włącz/wyłącz tryb niskiego sufitu."
      },
      {
        "offset": 9,
        "name": "NozzleLvl",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Ustawienie dyszy (5 kroków). Aktywne gdy ManualWorkMode=ON. Domyślnie 0%."
      },
      {
        "offset": 10,
        "name": "SmartMode",
        "values": {
          "0": "OFF",
          "1": "ON"
        },
        "description": "Włącz/wyłącz tryb SMART. Aktywne gdy InputDIConfiguration=1 lub 2."
      },
      {
        "offset": 11,
        "name": "PreheatMode",
        "values": {
          "0": "OFF",
          "1": "ON"
        },
        "description": "Włącz/wyłącz podgrzewanie wstępne. Aktywne gdy ExchangerTypeConfiguration=0 lub 2."
      },
      {
        "offset": 12,
        "name": "FanManualLvl",
        "min": 0,
        "max": 1000,
        "unit": "×0.1%",
        "description": "Ręczna wydajność wentylatora. Aktywne gdy ManualWorkMode=1. Domyślnie 200 = 20%."
      },
      {
        "offset": 13,
        "name": "DestratificationTempRef",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Różnica temperatur aktywująca destratyfikację: IntakeTemp − RoomTemp > wartość. Domyślnie 50 = 5.0°C."
      },
      {
        "offset": 14,
        "name": "PreheatTempRef",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Temperatura wymiennika po której włącza się wentylator (tryb grzania). Domyślnie 280 = 28.0°C."
      },
      {
        "offset": 15,
        "name": "SmartMode1TimeRef",
        "min": 0,
        "max": 99999,
        "unit": "s",
        "description": "Czas aktywacji warunku SMART MODE I. Domyślnie 1800s."
      },
      {
        "offset": 16,
        "name": "SmartMode2TimeRef",
        "min": 0,
        "max": 99999,
        "unit": "s",
        "description": "Czas aktywacji warunku SMART MODE II. Domyślnie 3600s."
      },
      {
        "offset": 17,
        "name": "SmartMode3TimeRef",
        "min": 0,
        "max": 99999,
        "unit": "s",
        "description": "Czas aktywacji warunku SMART MODE III. Domyślnie 7200s."
      },
      {
        "offset": 18,
        "name": "SmartMode2HysteresisHeat",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Histereza temperatury dla grzania w SMART MODE II. Domyślnie 20 = 2.0°C."
      },
      {
        "offset": 19,
        "name": "SmartMode2HysteresisCool",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Histereza temperatury dla chłodzenia w SMART MODE II. Domyślnie 20 = 2.0°C."
      },
      {
        "offset": 20,
        "name": "SmartMode3TempMin",
        "min": 0,
        "max": 999,
        "unit": "×0.1°C",
        "description": "Minimalna temperatura dla SMART MODE III. Domyślnie 180 = 18.0°C."
      },
      {
        "offset": 21,
        "name": "InputDiForce",
        "description": "Nadpisanie wejścia DI przez MODBUS. Aktywne gdy InputDIConfiguration=1 lub 2 i IR[0x0E]=1. Domyślnie 0."
      },
      {
        "offset": 22,
        "name": "DestratificationFanRef",
        "min": 0,
        "max": 1000,
        "unit": "×0.1%",
        "description": "Wydajność wentylatora w trybie destratyfikacji. Domyślnie 600 = 60%."
      },
      {
        "offset": 23,
        "name": "LowCeilingFanRef",
        "min": 0,
        "max": 1000,
        "unit": "×0.1%",
        "description": "Wydajność wentylatora w trybie niskiego sufitu. Domyślnie 600 = 60%."
      },
      {
        "offset": 24,
        "name": "LowCeilingLowLimit",
        "min": 0,
        "max": 1000,
        "unit": "×0.1%",
        "description": "Dolny limit wydajności wentylatora w trybie Low Ceiling. Domyślnie 0%."
      },
      {
        "offset": 25,
        "name": "LowCeilingHighLimit",
        "min": 0,
        "max": 1000,
        "unit": "×0.1%",
        "description": "Górny limit wydajności wentylatora w trybie Low Ceiling. Domyślnie 600 = 60%."
      },
      {
        "offset": 26,
        "name": "InputDIConfiguration",
        "description": "Aktywacja i wybór polaryzacji wejścia DI."
      },
      {
        "offset": 27,
        "name": "ActuatorsTimeConfiguration",
        "unit": "s",
        "description": "Czas otwarcia siłownika 3-drogowego — zgodnie z danymi producenta. Domyślnie 150s."
      },
      {
        "offset": 28,
        "name": "ExchangerTypeConfiguration",
        "description": "Typ wymiennika ciepła. Domyślnie 2."
      },
      {
        "offset": 29,
        "name": "ValveTypeConfiguration",
        "description": "Typ siłownika zaworu. Domyślnie 0."
      },
      {
        "offset": 30,
        "name": "DrainPumpAlarmConfiguration",
        "description": "Polaryzacja styku alarmu pompy skroplin. Domyślnie 0."
      },
      {
        "offset": 31,
        "name": "FilterMaxWorkTime",
        "description": "Maksymalny czas pracy filtra. Domyślnie 4000h."
      },
      {
        "offset": 32,
        "name": "GroupTLeadSensorSelect",
        "description": "Wybór czujnika wiodącego grupy."
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
        "name": "T3",
        "description": "Temperatura powietrza za wymiennikiem wodnym (czujnik T3)."
      },
      {
        "offset": 5,
        "name": "T4",
        "description": "Temperatura powietrza przed wymiennikiem wodnym (czujnik T4)."
      },
      {
        "offset": 6,
        "name": "CurtainFanSpeed",
        "description": "Prędkość wentylatora kurtyny (AC 3-biegowy: 0=stop, 1–33=bieg1, 34–66=bieg2, 67–100=bieg3)."
      },
      {
        "offset": 7,
        "name": "ValveState",
        "description": "Stan zaworu wodnego."
      },
      {
        "offset": 8,
        "name": "HeaterFanSpeed",
        "description": "Prędkość wentylatora nagrzewnicy (AC 3-biegowy)."
      },
      {
        "offset": 9,
        "name": "ContactDoor",
        "description": "Stan styku drzwiowego."
      },
      {
        "offset": 10,
        "name": "HeaterDetect",
        "description": "Procedura wykrywania nagrzewnicy (ELIS-DUO)."
      },
      {
        "offset": 11,
        "name": "AntifreezeState",
        "description": "Stan ochrony przeciwzamrożeniowej — 8 bitów dla poszczególnych trybów."
      },
      {
        "offset": 12,
        "name": "FuseState",
        "description": "Stan bezpiecznika wentylatora 3V (bity 8–11). Przykład: 0x100 = OK, 0x200 = przepalony."
      },
      {
        "offset": 13,
        "name": "CurtainElectricpower",
        "description": "Moc elektrycznej nagrzewnicy kurtyny (wyjścia L1/L2 na złączu VALVE)."
      }
    ],
    "holding_registers_single": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT — tryb grzania",
          "3": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        }
      },
      {
        "offset": 7,
        "name": "HeaterFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 8,
        "name": "HeaterHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        }
      },
      {
        "offset": 10,
        "name": "Tref",
        "min": 50,
        "max": 450,
        "unit": "°C×0.1"
      },
      {
        "offset": 11,
        "name": "TLeadVal",
        "min": -600,
        "max": 600,
        "unit": "°C×0.1"
      },
      {
        "offset": 12,
        "name": "TLeadSensorSelect",
        "values": {
          "1": "TSL_TLEAD — wartość przez Modbus (TLeadVal)",
          "3": "TSL_T4 — czujnik T4 (złącze DRV)"
        }
      },
      {
        "offset": 13,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS — brak wymuszenia",
          "1": "CURT_PRG_K1 — wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 — wymuszenie SW3 na K2"
        }
      },
      {
        "offset": 14,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 15,
        "name": "HeaterFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator nagrzewnicy AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 16,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie stand-by wentylatora w sekundach; 65535 = nieskończone"
      },
      {
        "offset": 17,
        "name": "ValveIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie zaworu w trybie stand-by w sekundach; 65535 = nieskończone. Warunek: ValveIdleDelay < FanIdleDelay"
      },
      {
        "offset": 18,
        "name": "AntifreezeWareHouseOn",
        "values": {
          "1": "WM_ON — włączony",
          "2": "WM_OFF — wyłączony"
        }
      },
      {
        "offset": 19,
        "name": "AntifreezeWareHouseTempRef",
        "min": 50,
        "max": 150,
        "unit": "°C×0.1"
      }
    ],
    "holding_registers_group": [
      {
        "offset": 4,
        "name": "WorkMode",
        "values": {
          "0": "WM_NS — tylko odczyt",
          "1": "WM_OFF — urządzenie wyłączone",
          "2": "WM_HEAT — tryb grzania",
          "3": "WM_VENT — wentylacja"
        }
      },
      {
        "offset": 5,
        "name": "CurtainFanSpeedRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy: 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 6,
        "name": "CurtainHeatRef",
        "values": {
          "0": "HEAT_NS — tylko odczyt",
          "1": "HEAT_ON — grzanie włączone",
          "2": "HEAT_OFF — grzanie wyłączone"
        }
      },
      {
        "offset": 7,
        "name": "ContactDoor",
        "values": {
          "1": "DOOR_OPEN — drzwi otwarte",
          "2": "DOOR_CLOSE — drzwi zamknięte"
        }
      },
      {
        "offset": 8,
        "name": "CurtainProgram",
        "values": {
          "0": "CURT_PRG_NS — brak wymuszenia",
          "1": "CURT_PRG_K1 — wymuszenie SW3 na K1",
          "2": "CURT_PRG_K2 — wymuszenie SW3 na K2"
        }
      },
      {
        "offset": 9,
        "name": "CurtainFanIdleRef",
        "min": 0,
        "max": 100,
        "unit": "%",
        "description": "Wentylator kurtyny AC 3-biegowy (stand-by): 0=wyłączony (FAN_SPEED0), 1–33=bieg 1 (FAN_SPEED1), 34–66=bieg 2 (FAN_SPEED2), 67–100=bieg 3 (FAN_SPEED3)"
      },
      {
        "offset": 10,
        "name": "FanIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie stand-by wentylatora w sekundach; 65535 = nieskończone"
      },
      {
        "offset": 11,
        "name": "ValveIdleDelay",
        "min": 0,
        "max": 65535,
        "unit": "s",
        "description": "Opóźnienie zaworu w trybie stand-by w sekundach; 65535 = nieskończone. Warunek: ValveIdleDelay < FanIdleDelay"
      }
    ]
  }
};
export const MODULE_KEYS = {
  module_id: { addr: 20, value: 0 },
  cooling_available: { addr: 21, value: 0 },
  holiday_mode: { addr: 22, value: 0 },
  forced_eco_mode: { addr: 23, value: 0 },
  hc_mode: { addr: 24, value: 0 },
  hc_masterslave: { addr: 25, value: 0 },
  ts_sv_version: { addr: 26, value: 0 },
  holiday_setpoint: { addr: 27, value: 0 },
  average_temp_low: { addr: 28, value: 0 },
  low_temp_alarm_limit: { addr: 29, value: 0 },
  low_temp_alarm_hysteresis: { addr: 30, value: 0 },
  remote_access_alarm: { addr: 31, value: 0 },
  device_lost_alarm: { addr: 32, value: 0 },
  no_comm_controller1: { addr: 33, value: 0 },
  no_comm_controller2: { addr: 34, value: 0 },
  no_comm_controller3: { addr: 35, value: 0 },
  no_comm_controller4: { addr: 36, value: 0 },
  average_room_temperature: { addr: 37, value: 0 },
  controller_presence: { addr: 38, value: 0 },
  allow_hc_mode_change: { addr: 39, value: 0 },
  hc_master_type: { addr: 40, value: 0 },
};

export const CONTROLLER_KEYS = {
  output_module: { addr: 60, value: 0 },
  rh_deadzone: { addr: 61, value: 0 },
  controller_sv_version: { addr: 62, value: 0 },
  thermostat_presence: { addr: 63, value: 0 },

  supply_high_alarm: { addr: 64, value: 0 },
  supply_low_alarm: { addr: 65, value: 0 },
  average_room_temperature_NO: { addr: 66, value: 0 },
  measured_outdoor_temperature: { addr: 67, value: 0 },
  supply_temp: { addr: 68, value: 0 },
  dehumidifier_status: { addr: 69, value: 0 },
  outdoor_sensor_presence: { addr: 70, value: 0 },
};

export const THERMOSTAT_KEYS = {
  eco_profile_active_cf: { addr: 80, value: 0 },
  dehumidifier_control_activation: { addr: 81, value: 0 },
  rh_control_activation: { addr: 82, value: 0 },
  eco_profile_number: { addr: 83, value: 0 },
  setpoint_write_enable: { addr: 84, value: 0 },
  cooling_allowed: { addr: 85, value: 0 },
  rh_setpoint: { addr: 86, value: 0 },
  min_setpoint: { addr: 87, value: 0 },
  max_setpoint: { addr: 88, value: 0 },
  min_floor_temp: { addr: 89, value: 0 },
  max_floor_temp: { addr: 90, value: 0 },
  room_setpoint: { addr: 91, value: 0 },
  eco_offset: { addr: 92, value: 0 },
  eco_profile_active: { addr: 93, value: 0 },
  home_away_mode_status: { addr: 94, value: 0 },
  room_in_demand: { addr: 95, value: 0 },
  rh_limit_reached: { addr: 96, value: 0 },
  floor_limit_status: { addr: 97, value: 0 },
  technical_alarm: { addr: 98, value: 0 },
  tamper_indication: { addr: 99, value: 0 },
  rf_alarm: { addr: 100, value: 0 },
  battery_alarm: { addr: 101, value: 0 },
  rh_sensor: { addr: 102, value: 0 },
  thermostat_type: { addr: 103, value: 0 },
  regulation_mode: { addr: 104, value: 0 },
  room_temperature: { addr: 105, value: 0 },
  room_temperature_ext: { addr: 106, value: 0 },
  rh_value: { addr: 107, value: 0 },
  ch_linked_to_th: { addr: 108, value: 0 },
  room_name: { addr: 109, value: 0 },
  utilization_factor_24h: { addr: 110, value: 0 },
  utilization_factor_7d: { addr: 111, value: 0 },
  reg_mode: { addr: 112, value: 0 },
  channel_average: { addr: 113, value: 0 },
  radiator_heating: { addr: 114, value: 0 },
};
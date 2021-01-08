/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  Nullable,
  PlatformAccessory,
  Service,
} from "homebridge";
import { Thermostat } from "./controller";
import { ExampleHomebridgePlatform } from "./platform";

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class ExamplePlatformAccessory {
  private service: Service;

  constructor(
    private readonly platform: ExampleHomebridgePlatform,
    private readonly accessory: PlatformAccessory,
    private readonly thermostat: Thermostat
  ) {
    // set accessory information

    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(
        this.platform.Characteristic.Manufacturer,
        "Default-Manufacturer"
      )
      .setCharacteristic(this.platform.Characteristic.Model, "Default-Model")
      .setCharacteristic(
        this.platform.Characteristic.SerialNumber,
        "Default-Serial"
      );

    this.service =
      this.accessory.getService(this.platform.Service.Thermostat) ||
      this.accessory.addService(this.platform.Service.Thermostat);

    this.service.setCharacteristic(
      this.platform.Characteristic.Name,
      thermostat.roomName
    );

    this.service
      .getCharacteristic(
        this.platform.Characteristic.CurrentHeatingCoolingState
      )
      .on("get", this.handleCurrentHeatingCoolingStateGet.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.TargetHeatingCoolingState)
      .on("get", this.handleTargetHeatingCoolingStateGet.bind(this))
      .on("set", this.handleTargetHeatingCoolingStateSet.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on("get", this.handleCurrentTemperatureGet.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.TargetTemperature)
      .on("get", this.handleTargetTemperatureGet.bind(this))
      .on("set", this.handleTargetTemperatureSet.bind(this));

    this.service
      .getCharacteristic(this.platform.Characteristic.TemperatureDisplayUnits)
      .on("get", this.handleTemperatureDisplayUnitsGet.bind(this))
      .on("set", this.handleTemperatureDisplayUnitsSet.bind(this));
  }

  /**
   * Handle requests to get the current value of the "Current Heating Cooling State" characteristic
   */
  handleCurrentHeatingCoolingStateGet(callback) {
    this.platform.log.debug("Triggered GET CurrentHeatingCoolingState");
    // set this to a valid value for TargetHeatingCoolingState
    const currentValue = 1;

    callback(null, currentValue);
  }

  /**
   * Handle requests to get the current value of the "Target Heating Cooling State" characteristic
   */
  handleTargetHeatingCoolingStateGet(callback) {
    this.platform.log.debug(
      "Triggered GET TargetHeatingCoolingState",
      this.thermostat.roomInDemand
    );

    // set this to a valid value for TargetHeatingCoolingState
    const currentValue = 1;

    callback(null, currentValue);
  }

  /**
   * Handle requests to set the "Target Heating Cooling State" characteristic
   */
  handleTargetHeatingCoolingStateSet(
    value: CharacteristicValue,
    cb: CharacteristicSetCallback,
    _context?: unknown,
    _connectionID?: string | undefined
  ) {
    this.platform.log.debug("Triggered SET TargetHeatingCoolingState:", value);
    cb(new Error("no."), 1);
  }

  /**
   * Handle requests to get the current value of the "Current Temperature" characteristic
   */
  handleCurrentTemperatureGet(
    callback: CharacteristicGetCallback<Nullable<CharacteristicValue>>
  ) {
    this.platform.log.debug("Triggered GET CurrentTemperature");

    callback(null, this.thermostat.temperature);
  }

  /**
   * Handle requests to get the current value of the "Target Temperature" characteristic
   */
  handleTargetTemperatureGet(callback) {
    this.platform.log.debug("Triggered GET TargetTemperature");
    callback(null, this.thermostat.setpoint);
  }

  /**
   * Handle requests to set the "Target Temperature" characteristic
   */
  handleTargetTemperatureSet(
    value: CharacteristicValue,
    cb: CharacteristicSetCallback,
    _context?: unknown,
    _connectionID?: string | undefined
  ) {
    this.platform.log.debug("Triggered SET TargetTemperature:", value);
    this.thermostat.setSetpoint(value).then(() => {
      cb(null, value);
    });
  }

  /**
   * Handle requests to get the current value of the "Temperature Display Units" characteristic
   */
  handleTemperatureDisplayUnitsGet(
    callback: CharacteristicGetCallback<Nullable<CharacteristicValue>>
  ) {
    this.platform.log.debug("Triggered GET TemperatureDisplayUnits");

    // set this to a valid value for TemperatureDisplayUnits
    const currentValue = 0;

    callback(null, currentValue);
  }

  /**
   * Handle requests to set the "Temperature Display Units" characteristic
   */
  handleTemperatureDisplayUnitsSet(
    _value: CharacteristicValue,
    _cb: CharacteristicSetCallback,
    _context?: unknown,
    _connectionID?: string | undefined
  ) {
    return;
  }
}

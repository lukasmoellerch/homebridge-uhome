/* eslint-disable no-prototype-builtins */
import * as jayson from "jayson/promise";
import { CONTROLLER_KEYS, THERMOSTAT_KEYS } from "./const";
type KeyType = Record<string, { addr: number; value: number | string }>;
type Request = { addr: number; cb: (v: number) => void };
class Controller {
  home: UHome;
  index: number;
  keys: typeof CONTROLLER_KEYS;
  constructor(home: UHome, index: number) {
    this.home = home;
    this.index = index;
    this.keys = {} as typeof CONTROLLER_KEYS;
    for (const keyName in CONTROLLER_KEYS) {
      if (CONTROLLER_KEYS.hasOwnProperty(keyName)) {
        const value = CONTROLLER_KEYS[keyName];
        this.keys[keyName] = {
          addr: value.addr + 500 * index,
          value: undefined,
        };
      }
    }
  }

  getUpdateRequests() {
    const result: Request[] = [];
    for (const keyName in this.keys) {
      if (this.keys.hasOwnProperty(keyName)) {
        const value = this.keys[keyName];
        result.push({
          addr: value.addr,
          cb: (newValue) => {
            value.value = newValue;
          },
        });
      }
    }
    return result;
  }

  async set(obj, value) {
    await this.home.set(obj, value);
  }
}
export class Thermostat {
  controller: Controller;
  controllerIndex: number;
  index: number;
  keys: typeof THERMOSTAT_KEYS;
  constructor(controller: Controller, index: number) {
    this.controller = controller;
    this.controllerIndex = controller.index;
    this.index = index;
    this.keys = {} as typeof THERMOSTAT_KEYS;
    for (const keyName in THERMOSTAT_KEYS) {
      if (THERMOSTAT_KEYS.hasOwnProperty(keyName)) {
        const value = THERMOSTAT_KEYS[keyName];
        this.keys[keyName] = {
          addr: value.addr + 500 * this.controllerIndex + 40 * index,
          value: undefined,
        };
      }
    }
  }

  getUpdateRequests() {
    const result: Request[] = [];
    for (const keyName in this.keys) {
      if (this.keys.hasOwnProperty(keyName)) {
        const value = this.keys[keyName];
        result.push({
          addr: value.addr,
          cb: (newValue) => {
            value.value = newValue;
          },
        });
      }
    }
    return result;
  }

  get roomName() {
    return (this.keys.room_name.value as unknown) as string;
  }

  get temperature() {
    return this.keys.room_temperature.value;
  }

  get setpoint() {
    return this.keys.room_setpoint.value;
  }

  set setpoint(newValue) {
    this.keys.room_setpoint.value = newValue;
  }

  async set(obj, value) {
    await this.controller.set(obj, value);
  }

  async setSetpoint(newValue) {
    await this.set(this.keys.room_setpoint, newValue);
  }

  get roomInDemand() {
    return this.keys.room_in_demand.value;
  }
}
export class UHome {
  host: string;
  client: jayson.HttpClient;
  keys: KeyType = {};
  controllers: Controller[];
  thermostats: Thermostat[];
  constructor(host: string) {
    this.host = host;
    this.client = jayson.Client.http({
      host: host,
      path: "/api",
      protocol: "http:",
      method: "POST",
    });

    this.controllers = [];
    this.thermostats = [];
  }

  async init() {
    await this.initControllers();
    await this.initThermostats();
  }

  async initControllers() {
    this.controllers = [];
    for (let i = 0; i < 4; i++) {
      try {
        const request = await this.client.request("read", {
          objects: [
            {
              id: `${CONTROLLER_KEYS.controller_sv_version.addr + 500 * i}`,
              properties: { 85: {} },
            },
          ],
        });
        const value = request.result.objects[0].properties[85].value;
        if (`${value}` !== "0.00") {
          const controller = new Controller(this, i);
          this.controllers.push(controller);
        }
      } catch (error) {
        continue;
      }
    }
  }

  async initThermostats() {
    this.thermostats = [];
    for (const controller of this.controllers) {
      for (let index = 0; index < 12; index++) {
        try {
          const request = await this.client.request("read", {
            objects: [
              {
                id: `${
                  THERMOSTAT_KEYS.room_setpoint.addr +
                  500 * controller.index +
                  40 * index
                }`,
                properties: { 85: {} },
              },
            ],
          });
          const setpoint = request.result.objects[0].properties[85].value;
          if (setpoint > 0 && setpoint < 50) {
            const thermostat = new Thermostat(controller, index);
            this.thermostats.push(thermostat);
          }
        } catch (error) {
          continue;
        }
      }
    }
  }

  getUpdateRequests() {
    const result: Request[] = [];
    for (const keyName in this.keys) {
      if (this.keys.hasOwnProperty(keyName)) {
        const value = this.keys[keyName];
        result.push({
          addr: value.addr,
          cb: (newValue) => {
            value.value = newValue;
          },
        });
      }
    }
    return result;
  }

  async set(obj, value) {
    await this.client.request("write", {
      objects: [
        {
          id: obj.addr,
          properties: {
            85: {
              value: `${value}`,
            },
          },
        },
      ],
    });
    obj.value = value;
  }

  async update() {
    let requests: Request[] = [];
    requests = requests.concat(this.getUpdateRequests());
    for (let i = 0; i < this.controllers.length; i++) {
      const controller = this.controllers[i];
      requests = requests.concat(controller.getUpdateRequests());
    }
    for (let i = 0; i < this.thermostats.length; i++) {
      const thermostat = this.thermostats[i];
      requests = requests.concat(thermostat.getUpdateRequests());
    }
    const callbacksById = {};
    for (let i = 0; i < requests.length; i++) {
      const callback = requests[i].cb;
      callbacksById[requests[i].addr] = callback;
    }
    const params = {
      objects: requests.map((request) => {
        return {
          id: `${request.addr}`,
          properties: {
            85: {},
          },
        };
      }),
    };
    const request = await this.client.request("read", params);
    const result = request.result;
    for (let i = 0; i < result.objects.length; i++) {
      try {
        const object = result.objects[i];
        const id = object.id;
        const value = object.properties[85].value;
        callbacksById[id](value);
      } catch (error) {
        continue;
      }
    }
  }
}

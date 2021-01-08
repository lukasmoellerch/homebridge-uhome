import {
  API,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  PlatformConfig,
  Service,
  Characteristic,
} from "homebridge";

import { PLATFORM_NAME, PLUGIN_NAME } from "./settings";
import { ExamplePlatformAccessory } from "./platformAccessory";
import { UHome } from "./controller";

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class ExampleHomebridgePlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap
    .Characteristic;

  public readonly accessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API
  ) {
    this.log.debug("Finished initializing platform:", this.config.name);

    this.api.on("didFinishLaunching", () => {
      log.debug("Executed didFinishLaunching callback");

      this.discoverDevices();
    });
  }

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info("Loading accessory from cache:", accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  /**
   * This is an example method showing how to register discovered accessories.
   * Accessories must only be registered once, previously created accessories
   * must not be registered again to prevent "duplicate UUID" errors.
   */
  async discoverDevices() {
    const home = new UHome("192.168.178.35");
    this.log.info("initializing uhome...");
    await home.init();
    this.log.info("discovering uhome devices...");
    await home.update();
    this.log.info(`found ${home.thermostats.length} devices:`);
    for (let i = 0; i < home.thermostats.length; i++) {
      const thermostat = home.thermostats[i];
      this.log.info(
        ` - "${thermostat.roomName}": setpoint=${thermostat.setpoint} temperature=${thermostat.temperature}`
      );
    }

    setInterval(() => {
      home.update();
    }, 2000);

    for (const device of home.thermostats) {
      const uuid = this.api.hap.uuid.generate(device.roomName);

      const existingAccessory = this.accessories.find(
        (accessory) => accessory.UUID === uuid
      );

      if (existingAccessory) {
        // the accessory already exists
        if (device) {
          this.log.info(
            "Restoring existing accessory from cache:",
            existingAccessory.displayName
          );

          this.api.updatePlatformAccessories([existingAccessory]);

          new ExamplePlatformAccessory(this, existingAccessory, device);

          this.api.updatePlatformAccessories([existingAccessory]);
        } else if (!device) {
          // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
          // remove platform accessories when no longer present
          this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [
            existingAccessory,
          ]);
          this.log.info(
            "Removing existing accessory from cache:",
            existingAccessory.displayName
          );
        }
      } else {
        this.log.info("Adding new accessory:", device.roomName);
        const accessory = new this.api.platformAccessory(device.roomName, uuid);
        new ExamplePlatformAccessory(this, accessory, device);
        this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [
          accessory,
        ]);
      }
    }
  }
}

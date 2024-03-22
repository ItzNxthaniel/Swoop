import { fileURLToPath } from "url";
import * as path from "path";
import * as fs from "fs";
import Wick from "../wick";

export default class EventHandler {
  Wick;

  constructor(Wick: Wick) {
    this.Wick = Wick;
  }

  loadEvents() {
    const eventsPath = path.join(__dirname, "../events");
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);

      if (event.once) {
        this.Wick.Client.once(event.name, (...args: any) => event.execute(...args, this.Wick))
      } else {
        this.Wick.Client.on(event.name, (...args: any) => event.execute(...args, this.Wick))
      }
    }
  }
}
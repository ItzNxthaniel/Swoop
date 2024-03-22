// @ts-nocheck
import { Routes } from "discord.js";
import * as path from "path";
import * as fs from "fs";
import Wick from "../wick"

export default class CommandHandler {
  Wick;
  commandsArray: Object[];

  constructor(Wick: Wick) {
    this.Wick = Wick;
    this.commandsArray = [];
  }

  async loadCommands() {
    const foldersPath = path.join(__dirname, "../commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
          this.Wick.Client.commands.set(command.data.name, command);
          this.commandsArray.push(command.data.toJSON());
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
        }
      }
    }

    return this;
  }

  async deployCommands() {
    if (this.Wick.Client.commands.size <= 0) {
      console.log("[WARNING] No commands found.");
      return this;
    }

    try {
      console.log(`Started refreshing ${this.commandsArray.length} application (/) commands.`);

      await this.Wick.Rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        {body: this.commandsArray}
      )
    } catch (err) {
      console.error(err);
    }

    return this;
  }
}
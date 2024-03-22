import { Client, Events } from "discord.js";
import Wick from "../wick";

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client, Wick: Wick) {
    // @ts-ignore
    console.log(`Wick is online and ready! (${client.user.id})`)
  }
}
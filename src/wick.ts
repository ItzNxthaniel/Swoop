import { Client, Collection, GatewayIntentBits, REST} from "discord.js"
import { CommandHandler, EventHandler, FormHandler } from "./handlers";

export default class Wick {
  CommandHandler: CommandHandler
  EventHandler: EventHandler
  FormHandler: FormHandler
  Client: Client
  Rest: REST

  constructor() {
    this.Client = new Client({ intents: [GatewayIntentBits.Guilds] })
    this.CommandHandler = new CommandHandler(this)
    this.FormHandler = new FormHandler(this)
    this.EventHandler = new EventHandler(this)

    // @ts-ignore
    this.Rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN)
  }

  async setupCommands() {
    this.Client.commands = new Collection();

    await this.CommandHandler.loadCommands();
    await this.CommandHandler.deployCommands();

    return this;
  }

  async setupHandlers() {
    this.EventHandler.loadEvents();

    return this;
  }

  async login() {
    await this.Client.login(process.env.DISCORD_BOT_TOKEN);
  }
}
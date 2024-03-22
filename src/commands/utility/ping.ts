import { CommandInteraction, SlashCommandBuilder} from "discord.js";
import Wick from "../../wick"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: CommandInteraction, Wick: Wick) {
    console.log("ping!")


    await Wick.FormHandler.pullData();
    Wick.FormHandler.checkData()

    await interaction.reply("Pong!")
  }
}
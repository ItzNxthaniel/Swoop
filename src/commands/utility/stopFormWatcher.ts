import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import Wick from "../../wick";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stopformwatcher")
    .setDescription("Stops the form watcher interval.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction: CommandInteraction, Wick: Wick) {
    if (Wick.FormHandler.formWatcher == undefined)
      await interaction.reply({content: "No watcher is running at the moment.", ephemeral: true})
    else {
      Wick.FormHandler.stopWatcher()

      await interaction.reply({content: "Watcher has been stopped.", ephemeral: true});
    }

  }
}
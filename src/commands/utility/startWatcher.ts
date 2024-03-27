import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import Wick from "../../wick";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("startwatcher")
    .setDescription("Starts a new watcher")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction: CommandInteraction, Wick: Wick) {
    if (Wick.FormHandler.formWatcher == undefined) {
      Wick.FormHandler.setupWatcher();

      await interaction.reply({content: "Starting the watcher!", ephemeral: true});
    } else {
      await interaction.reply({content: "A watcher is already running.", ephemeral: true});
    }

  }
}
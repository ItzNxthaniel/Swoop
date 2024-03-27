import {CommandInteraction, PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import Wick from "../../wick";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("checkdata")
    .setDescription("Forces the bot to check form submissions.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction: CommandInteraction, Wick: Wick) {
    console.log("Checking Data");
    await Wick.FormHandler.pullData();
    Wick.FormHandler.checkData();

    await interaction.reply({content: "Form responses have been pulled and I will check the data. Any needed changes will be made.", ephemeral: true});
  }
}
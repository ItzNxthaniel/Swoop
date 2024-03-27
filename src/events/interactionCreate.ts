import { BaseInteraction, Events} from "discord.js"
import Wick from "../wick"

module.exports = {
  name: Events.InteractionCreate,
  execute: async function (interaction: BaseInteraction, Wick: Wick) {
    if (!interaction.isChatInputCommand()) return;
    const command = Wick.Client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      console.log(`[${new Date().toDateString()}] | ${interaction.user.tag} executed command ${command.data.name}.`)
      await command.execute(interaction, Wick);
    } catch (err) {
      console.error(err);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true
        });
      } else {
        interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        });
      }
    }
  }
}
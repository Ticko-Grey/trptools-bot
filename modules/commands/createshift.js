import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

export async function createshift(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('createshift')
    .setTitle('Schedule a new shift');

  const dow = new TextInputBuilder()
    .setCustomId('dayofweek')
    .setLabel("Day of the week")
    .setStyle(TextInputStyle.Short);

  const time = new TextInputBuilder()
    .setCustomId('time')
    .setLabel("Time")
    .setStyle(TextInputStyle.Short);

  const shiftname = new TextInputBuilder()
    .setCustomId('name')
    .setLabel("Shift name")
    .setStyle(TextInputStyle.Short);

  const firstActionRow = new ActionRowBuilder().addComponents(dow);
  const secondActionRow = new ActionRowBuilder().addComponents(time);
  const thirdActionRow = new ActionRowBuilder().addComponents(shiftname);

  modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
  
  await interaction.showModal(modal);
}
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js'
import { getCustomShifts } from '../time.js'

const dow = {
    0 : "sunday",
    1 : "monday",
    2 : "tuesday",
    3 : "wednesday",
    4 : "thursday",
    5 : "friday",
    6 : "saturday"
}

export function shiftcancel(interaction) {
    const shifts = getCustomShifts()

    if (shifts.length == 0) {
        const errorEmbedResponse = new EmbedBuilder()
            .setColor(0xa83232)
            .setTitle('Error')
            .setDescription(`There are no scheduled shifts you can remove`)
            .setFooter({text: 'You will need to modify the config.json file to remove repeating shifts'});

        interaction.reply({
            embeds: [errorEmbedResponse],
            ephemeral: true
        });
        return
    }

    let shiftsArray = []

    for (let i = 0; i < shifts.length; i++) {
        shiftsArray.push(
            new StringSelectMenuOptionBuilder()
                .setLabel(shifts[i].UID)
                .setDescription(`Shift on ${dow[shifts[i].dayOfWeek]} at ${shifts[i].timeUTC} UTC`)
                .setValue(shifts[i].UID),
        )
    }

    const select = new StringSelectMenuBuilder()
        .setCustomId('shiftremoveselector')
        .setPlaceholder('Select a shift')
        .addOptions(shiftsArray);

    const row = new ActionRowBuilder()
        .addComponents(select);

    const embedResponse = new EmbedBuilder()
        .setColor(0x4287f5)
        .setTitle('Cancel a shift')
        .setDescription(`Select a shift from the dropdown menu`);

    interaction.reply({
        embeds: [embedResponse],
        components: [row],
        ephemeral: true
    });
}
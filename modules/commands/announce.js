import { EmbedBuilder } from 'discord.js'
import * as configFile from "../config.js"
import { getNextShift, getShiftTime  } from "../time.js"
const config = configFile.get()

export async function announce(interaction, client) {
    const shiftChannel = client.channels.cache.get(config.channels.shifts)
    const nextShift = await getNextShift(true)

    if (!shiftChannel) {
        const errorEmbedResponse = new EmbedBuilder()
            .setColor(0xa83232)
            .setTitle('Error')
            .setDescription(`Could not find shift announcement channel`)

        interaction.reply({
            embeds: [errorEmbedResponse],
            ephemeral: true
        });
    return
    }

    const relativeTime = Math.floor(getShiftTime(nextShift).getTime() / 1000)

    const shiftEmbed = new EmbedBuilder()
        .setColor(0x4287f5)
        .setTitle(`Shift announcement`)
        .setDescription(`${nextShift.UID} is scheduled for <t:${relativeTime}:F> (<t:${relativeTime}:R>)`)
        .setFooter({iconURL: `https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.png`, text: interaction.guild.name + " • Hosted by " + interaction.member.nickname})

    await shiftChannel.send({
        embeds: [shiftEmbed]
    })

    const responseEmbed = new EmbedBuilder()
        .setColor(0x69f079)
        .setTitle("Shift announcement created")
        .setDescription(`Shift has been announced in <#${config.channels.shifts}>`)

    interaction.reply({
        embeds: [ responseEmbed],
        ephemeral: true
    })
}
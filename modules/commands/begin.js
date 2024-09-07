import { EmbedBuilder } from 'discord.js'
import * as configFile from "../config.js"
import storage from 'node-persist';
import { getNextShift  } from "../time.js"
const config = configFile.get()

export async function begin(interaction, client) {
    const nextShift = await getNextShift(false)
    const shiftChannel = client.channels.cache.get(config.channels.shifts)

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

    let note = await storage.getItem('shift-note')
    const id = await storage.getItem('shift-id') || config.ids.server_ownerid

    if (note) {
        note = note + ' \n \n'
    } else {
        note = ''
    }

    const shiftEmbed = new EmbedBuilder()
        .setColor(0x4287f5)
        .setTitle(`Shift announcement`)
        .setDescription(`${nextShift.UID} is starting now. \n \n${note}[Click here to join](https://www.roblox.com/games/start?placeId=2337102976&launchData={"Server":${id}}) \n(or join through the self hosted servers tab)`)
        .setFooter({iconURL: `https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.png`, text: interaction.guild.name + " • Hosted by " + interaction.member.nickname})

    await shiftChannel.send({
        //content: `<@&${config.roles.shiftping}>`,
        embeds: [shiftEmbed]
    })

    const code = await storage.getItem("dispatchCode")

    if (code) {
        const dispatchEmbed = new EmbedBuilder()
        .setColor(0xc27c0e)
        .setTitle("Live server stats")
        .setDescription(`Connecting to dispatch server...`)

        const dispatchMessage = await shiftChannel.send({
            embeds: [dispatchEmbed],
        })

        storage.setItem("dispatchCode", {code: code.code, message: dispatchMessage.id})
    }

    const responseEmbed = new EmbedBuilder()
        .setColor(0x69f079)
        .setTitle("Shift announcement created")
        .setDescription(`Shift has been announced in <#${config.channels.shifts}>`)

    interaction.reply({
        embeds: [ responseEmbed],
        ephemeral: true
    })
}
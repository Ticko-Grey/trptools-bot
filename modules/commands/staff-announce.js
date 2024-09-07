import * as configFile from "../config.js";
const config = configFile.get();
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { getNextShift, getShiftTime  } from "../time.js";
import storage from 'node-persist';

export async function staffannounce(interaction, client) {
    const nextShift = await getNextShift(true)
    const relativeTime = Math.floor(getShiftTime(nextShift).getTime() / 1000)

    let channelIds = []
    let i = 1

    // loop through for every role that needs to be requested
    config.activityObjects.forEach(async (activityObject, index, array) => {
        channelIds.push({ name: "Channel " + i, value: `<#${activityObject.channel}>`, inline: true })
        i++
        const shiftChannel = client.channels.cache.get(activityObject.channel)

        // create fields
        let fields = []
        let dropdownOptions = []
        Object.keys(activityObject.positions).forEach((k) => {
            fields.push({ name: k, value: "Empty", inline: false })

            dropdownOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(k)
                    .setDescription(activityObject.positions[k])
                    .setValue(k),
            )
        })

        // generate embed
        const embedTitle = `${activityObject.name} activity request`
        const embedDescription = `Sign up for the shift scheduled for <t:${relativeTime}:F> (<t:${relativeTime}:R>) by using the dropdown below`
        const embed = new EmbedBuilder()
            .setColor(activityObject.color)
            .setTitle(embedTitle)
            .setDescription(embedDescription)
            .addFields(fields)

        // generate interaction row 
        const select = new StringSelectMenuBuilder()
            .setCustomId('staffsignup')
            .setPlaceholder('Select a slot')
            .setMaxValues(1)
            .setMinValues(1)
            .addOptions(dropdownOptions);
        const row = new ActionRowBuilder()
            .addComponents(select);

        // send message
        const message = await shiftChannel.send({
            content: `<@&${activityObject.ping}>`,
            components: [row],
            embeds: [embed]
        })

        // store message
        let interactionStorage = {
            strings: { title: embedTitle, description: embedDescription },
            positions: activityObject.positions,
            color : activityObject.color,
            vacancy: {}
        }

        storage.setItem(message.id + '_interaction', interactionStorage)
    });
    
    const embedResponse = new EmbedBuilder()
    .setColor(0x69f079)
    .setTitle("Staff announcement message sent")
    .setDescription("A request for activity was sent to the following channels")
    .addFields(channelIds)

    interaction.reply({
        embeds : [ embedResponse ],
    })
}
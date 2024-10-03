import * as configFile from "../config.js";
const config = configFile.get();
import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { getNextShift, getShiftTime  } from "../time.js";
import storage from 'node-persist';

export async function staffbegin(interaction, client) {
    const nextShift = await getNextShift(false)
    const relativeTime = Math.floor(getShiftTime(nextShift).getTime() / 1000)
    let channelIds = []
    let i = 1

    config.activityObjects.forEach(async (activityObject, index, array) => {
        channelIds.push({ name: "Channel " + i, value: `<#${activityObject.channel}>`, inline: true })
        i++
        const pings = await storage.getItem(activityObject.ping + "_ping")
        const shiftChannel = client.channels.cache.get(activityObject.channel)
        const staffCode = interaction.options.getInteger('code');
        const id = await storage.getItem('shift-id') || config.ids.server_ownerid

        let pingstring = ""
        for (const a in pings) {
            if (pings[a] == null) continue
            pingstring = pingstring + `<@${pings[a]}>`
        }

        const embedTitle = `${activityObject.name} shift announcement`
        const embedDescription = `Shift is starting <t:${relativeTime}:R>\n\nJoin by [clicking here](https://www.roblox.com/games/start?placeId=2337102976&launchData={"Code":${staffCode},"Server":${id}}) or using this code: **${staffCode}**`
        const embed = new EmbedBuilder()
            .setColor(activityObject.color)
            .setTitle(embedTitle)
            .setDescription(embedDescription)

        shiftChannel.send({
            content : pingstring,
            embeds : [ embed ]
        })
    })

    const embedResponse = new EmbedBuilder()
    .setColor(0x69f079)
    .setTitle("Staff begin message sent")
    .setDescription("A notification of the shift starting was sent to the following channels")
    .addFields(channelIds)

    interaction.reply({
        embeds : [ embedResponse ],
    })
}
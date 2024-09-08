import storage from 'node-persist';
import * as configFile from "./config.js"
import { EmbedBuilder } from 'discord.js'
const config = configFile.get()

export default async function dispatchupdate(client) {
    const channel = await client.channels.fetch(config.channels.shifts)

    setInterval(async function () {
        const dispatchCodeItem = await storage.getItem('dispatchCode')
        if (!dispatchCodeItem || !dispatchCodeItem.message) return

        try {
            let data = await fetch(`https://trptools.com/dispatch/get?roomid=${dispatchCodeItem.code}`)
            data = await data.json()

            let parsedData = ""

            for (const [key, d] of Object.entries(data)) {
                const usernameResponse = await fetch(`https://users.roblox.com/v1/users/${d.OwnerId}`)
                const json = await usernameResponse.json()
                parsedData = parsedData + `\`\`${d.Id} - ${json.name} - ${d.Name} - Route ${d.route}\`\` \n`
            }

            const dispatchEmbed = new EmbedBuilder()
                .setColor(0xc27c0e)
                .setTitle("Live server stats")
                .setDescription(parsedData)

            const message = await channel.messages.fetch(dispatchCodeItem.message)
            message.edit({
                embeds: [dispatchEmbed]
            })
        } catch {
            const dispatchEmbed = new EmbedBuilder()
                .setColor(0xc27c0e)
                .setTitle("Live server stats")
                .setDescription("Reconnecting to dispatch server...")

            try {
                const message = await channel.messages.fetch(dispatchCodeItem.message)
                message.edit({
                    embeds: [dispatchEmbed]
                })
            } catch {}
            }
    }, 10 * 1000);
}
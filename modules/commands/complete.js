import { EmbedBuilder } from 'discord.js'
import * as configFile from "../config.js";
const config = configFile.get();

function addLeadingZero(num) {
    if (num <= 9) {
      return '0' + num.toString()
    } else {
      return num
    }
  }


export async function complete(interaction, client) {
    await config.channels.clearChannels.forEach(async (d) => {
        let c = await client.channels.cache.get(d)
        c.messages.fetch({ limit: 10, cache: false })
        .then(messages => c.bulkDelete(messages));
    })

    const date = new Date();
    const formattedDate = `${date.getUTCFullYear()}-${addLeadingZero(date.getUTCMonth() + 1)}-${addLeadingZero(date.getUTCDate())}`

    const pollChannel = client.channels.cache.get(config.channels.polls)
    pollChannel.send({
        poll: {
            question : { text : "Shift Poll " + formattedDate},
            answers : config.pollObject,
            allowMultiselect: false,
            duration: 4
        }
    })

  const responseEmbed = new EmbedBuilder()
    .setColor(0x69f079)
    .setTitle("Shift completed")
    .setDescription(`Shift cleanup has been executed`)

  interaction.reply({
    embeds: [responseEmbed],
    ephemeral: true
  })
}
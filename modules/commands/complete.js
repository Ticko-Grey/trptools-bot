import * as configFile from "../config.js";
const config = configFile.get();
import storage from 'node-persist';

function addLeadingZero(num) {
    if (num <= 9) {
      return '0' + num.toString()
    } else {
      return num
    }
  }


export async function complete(interaction, client) {
    const store = await storage.getItem('deleteList')
    store.forEach(async (d) => {
        let c = await client.channels.cache.get(d.channel)
        let m = await c.messages.cache.get(d.message)

        m.delete()
    })

    storage.removeItem('deleteList')

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
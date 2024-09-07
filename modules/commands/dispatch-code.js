import { Embed, EmbedBuilder } from 'discord.js'
import storage from 'node-persist';

export async function dispatchcode(interaction, client) {
    let code = interaction.options.getString('code');
    storage.setItem('dispatchCode', {code: code, message: null})

    const embedResponse = new EmbedBuilder()
        .setColor(0xc27c0e)
        .setTitle('Dispatch code set')
        .setDescription(`Dispatch code set to ${code} successfully`)

    interaction.reply({    
        embeds : [embedResponse]
    })
}
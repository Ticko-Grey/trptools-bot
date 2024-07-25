import * as configFile from "../config.js";
import storage from 'node-persist';
const config = configFile.get();
import { ComponentAssertions, EmbedBuilder } from 'discord.js';
import { getNextShift, getShiftTime  } from "../time.js";

export async function shiftprogram(interaction, client) {
    // collect static data
    let note = interaction.options.getString('note');
    let owner = interaction.options.getString('owner');
    let reset = interaction.options.getBoolean('reset');
    const oldNote = await storage.getItem('shift-note')
    const oldOwner = await storage.getItem('shift-id') || config.ids.server_ownerid
    const nextShift = getNextShift(false)
    const relativeTime = Math.floor(getShiftTime(nextShift).getTime() / 1000) 
    const dist = relativeTime - new Date().getTime() / 1000

    if (reset == true) {
        owner = config.ids.server_ownerid
        note = null
        storage.removeItem('shift-note')
    }

    // set new data
    if (note) {storage.setItem('shift-note', note, {ttl: 1000*dist /* 30 minutes after the next shift */ })}
    if (owner) {storage.setItem('shift-id', owner, {ttl: 1000*dist + 1000*60*30 /* 30 minutes after the next shift */ })}

    // respond
    const embedResponse = new EmbedBuilder()
        .setColor(0x69f079)
        .setTitle('Shift program set successfully')
        .setDescription(`Shift **${nextShift.UID}** (scheduled for <t:${relativeTime}:f>) has been modified \n\n`)
        .addFields(
            { name: 'Shift owner', value: `${oldOwner.toString()}  **-->**  ${owner || oldOwner.toString()}`, inline: false },
            { name: 'Shift note', value: `${oldNote || 'N/A'}  **-->**  ${note || 'N/A'}`, inline: false },
        )

    interaction.reply({
        embeds : [ embedResponse ]
    })
}
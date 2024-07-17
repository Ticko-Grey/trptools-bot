import { EmbedBuilder } from 'discord.js'
import { getShiftTime, getAllShifts } from '../time.js'

export function shiftview(interaction) {
    const shifts = getAllShifts()
    let fields = []

    for (let i = 0; i < shifts.length; i++) {
        let name
        if (shifts[i].expires) {
            name = shifts[i].UID + " (no repeat)"
        } else {
            name = shifts[i].UID
        }
        fields[i] = {inline : true, name : name, value : `<t:${Math.floor(getShiftTime(shifts[i]).getTime() / 1000)}:f>`}
    }
        
    const embedResponse = new EmbedBuilder()
    .setColor(0x4287f5)
    .setTitle('Scheduled shifts')
    .setDescription(`List of all currently scheduled shifts`)
    .addFields(fields)

    interaction.reply({
        embeds : [ embedResponse ]
    })
}
import { EmbedBuilder } from 'discord.js'
import { getShiftTime, getAllShifts } from '../time.js'

export function shiftview(interaction) {
    const shifts = getAllShifts()
    let fields = []

    for (let i = 0; i < shifts.length; i++) { // loop thru shifts to add no repeat to custom shifts and remove overridden config shifts
        let name
        if (shifts[i].expires) {
            name = shifts[i].UID + " (no repeat)"
        } else {
            name = shifts[i].UID
        }

        if (!shifts.find((shift) => shift.override == shifts[i].UID)) {
            fields[i] = {inline : true, name : name, value : `<t:${Math.floor(getShiftTime(shifts[i]).getTime() / 1000)}:f>`}
        }
    }

    fields = fields.filter(n => n) // remove null
        
    const embedResponse = new EmbedBuilder()
    .setColor(0x4287f5)
    .setTitle('Scheduled shifts')
    .setDescription(`List of all currently scheduled shifts`)
    .addFields(fields)

    interaction.reply({
        embeds : [ embedResponse ]
    })
}
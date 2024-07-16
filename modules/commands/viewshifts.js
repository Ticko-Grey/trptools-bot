import { EmbedBuilder } from 'discord.js'
import { getShiftTime, getAllShifts } from '../time.js'

export function viewshifts(interaction) {
    const shifts = getAllShifts()
    let fields = []

    for (let i = 0; i < shifts.length; i++) {
        fields[i] = {inline : true, name : shifts[i].UID, value : `<t:${Math.floor(getShiftTime(shifts[i]).getTime() / 1000)}:f>`}
    }

    console.log(fields)
        
    const embedResponse = new EmbedBuilder()
    .setColor(0x4287f5)
    .setTitle('Scheduled shifts')
    .setDescription(`List of all currently scheduled shifts`)
    .addFields(fields)

    interaction.reply({
        embeds : [ embedResponse ]
    })
}
import { EmbedBuilder } from 'discord.js'
import { removeCustomShift, getCustomShifts, getShiftTime } from '../time.js'

export async function shiftremoveselector(interaction) {
    const shiftToRemove = interaction.values[0]
    const shifts= await getCustomShifts()
    const shiftData = shifts.find((v) => v.UID == shiftToRemove)
    const shiftTime = getShiftTime(shiftData)

    await removeCustomShift(shiftToRemove)

    const embedResponse = new EmbedBuilder()
        .setColor(0x4287f5)
        .setTitle('Shift unscheduled successfully')
        .setDescription(`Shift **${shiftData.UID}** scheduled for <t:${Math.floor(shiftTime.getTime() / 1000)}:f> has been unscheduled`)

    interaction.reply({
        embeds : [ embedResponse ]
    })
}
import { EmbedBuilder } from 'discord.js'
import { removeCustomShift, getCustomShifts, getShiftTime } from '../time.js'

export function shiftremoveselector(interaction) {
    const shiftToRemove = interaction.values[0]
    const shiftData = getCustomShifts().find((v) => v.UID == shiftToRemove)
    const shiftTime = getShiftTime(shiftData)

    removeCustomShift(shiftToRemove)

    const embedResponse = new EmbedBuilder()
        .setColor(0x4287f5)
        .setTitle('Shift unscheduled successfully')
        .setDescription(`Shift **${shiftData.UID}** scheduled for <t:${Math.floor(shiftTime.getTime() / 1000)}:f> has been unscheduled`)

    interaction.reply({
        embeds : [ embedResponse ]
    })
}
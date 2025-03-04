const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Muestra la cola de canciones.'),

    async run(interaction) {
        const channel = interaction.member.voice.channel;

        if (!channel)
            return interaction.reply({ content: 'Debes estar en un canal de voz para usar este comando.', ephemeral: true });

        const queue = useQueue(interaction.guild.id);

        if (!queue || !queue.tracks.size) {
            return interaction.reply({ content: 'La lista está vacía.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('🎶 Lista de canciones')
            .setColor('#1D8954')
            .setDescription(queue.tracks.toArray().slice(0, 10).map((track, i) =>
                `**${i + 1}.** [${track.title}](${track.url}) - ${track.duration}`).join('\n'))
            .setFooter({ text: `Sonando ${queue.currentTrack.title}` });

        return interaction.reply({ embeds: [embed] });
    }
}
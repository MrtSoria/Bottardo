const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Salta la canción actual.'),

    async run(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;

        if (!channel)
            return interaction.reply({ content: 'Debes estar en un canal de voz para usar este comando.', ephemeral: true });

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.node.isPlaying()) {
            return interaction.reply({ content: 'No hay ninguna canción reproduciéndose.', ephemeral: true });
        }

        const currentTrack = queue.currentTrack;

        if (queue.node.skip()) {
            return interaction.reply(`⏭️ Se saltó **${currentTrack.title}**.`);
        } else {
            return interaction.reply('❌ No se pudo saltar la canción.');
        }
    }
}
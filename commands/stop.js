const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, GuildQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Detiene la reproducción.')
    ,
    async run(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;

        if (!channel)
            return interaction.reply({ content: 'Debes estar en un canal de voz para usar este comando.', ephemeral: true });

        await interaction.deferReply();

        let queue = player.nodes.get(interaction.guild);

        if (!queue || !queue.connection)
            return interaction.followUp('No hay ninguna canción en reproducción.');

        queue.tracks.clear();
        queue.node.stop();

        return interaction.followUp('Reproducción detenida.');
    }

}
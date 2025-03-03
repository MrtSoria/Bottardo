const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce una canción.')
        .addStringOption(option =>
            option.setName('search')
                .setDescription('URL o nombre de la canción.')
                .setRequired(true)
        ),

    async run(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;

        if (!channel)
            return interaction.reply({ content: 'Debes estar en un canal de voz para usar este comando.', ephemeral: true });

        const query = interaction.options.getString('search', true);

        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction,
                }
            });
            return interaction.followUp(`Se agrego **${track.title}** a la cola.`);
        } catch (e) {
            return interaction.followUp(`Hubo un error: ${e.message}`);
        }
    }
}

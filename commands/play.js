const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, GuildQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce una canción.')
        .addStringOption(option =>
            option.setName('search')
                .setDescription('URL o nombre de la canción.')
                .setRequired(false)
        ),

    async run(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;

        if (!channel)
            return interaction.reply({ content: 'Debes estar en un canal de voz para usar este comando.', ephemeral: true });

        const query = interaction.options.getString('search');

        await interaction.deferReply();

        try {
            let queue = player.nodes.get(interaction.guild);

            // Si no hay query, reanudar la canción pausada
            if (!query) {
                if (queue && queue.node.isPaused()) {
                    queue.node.resume();
                    return interaction.followUp('Reanudando reproducción.');
                }
                return interaction.followUp('No hay ninguna cancion pausada.');
            }

            // Si no hay cola, crear una nueva
            if (!queue) {
                queue = player.nodes.create(interaction.guild, {
                    metadata: interaction,
                    volume: 50,
                    leaveOnEmpty: true, // Salir si no hay usuarios en el canal
                    leaveOnEmptyCooldown: 30000, // 30 segundos antes de salir
                    leaveOnEnd: true, // Salir al terminar la cola
                    leaveOnEndCooldown: 60000, // 60 segundos antes de salir
                });
            }

            // Conectar al canal de voz
            if (!queue.connection) await queue.connect(channel);

            // Reproducir la canción
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction,
                }
            });

            // Construir un embed para la respuesta
            const embed = new EmbedBuilder()
                .setTitle('🎶 Canción añadida a la cola')
                .setDescription(`**[${track.title}](${track.url})**`)
                .setThumbnail(track.thumbnail)
                .addFields({ name: 'Duración', value: track.duration, inline: true })
                .setFooter({ text: `Pedido por ${interaction.user.username}` });

            return interaction.followUp({ embeds: [embed] });
        } catch (e) {
            return interaction.followUp(`Hubo un error: ${e.message}`);
        }
    }
}

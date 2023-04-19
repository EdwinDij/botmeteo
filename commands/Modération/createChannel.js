const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createchannel")
        .setDescription("Créer le channel du bot"),

    async execute(interaction) {
        const channelManager = interaction.guild.channels;
        const channelId = interaction.guild.channels.cache.find(c => c.name ==="Bot");
        if (interaction.guild.channels.cache.find(channel => channel.name === "meteo")) {
            await interaction.reply("Le channel existe déjà");

        } else {
            await interaction.guild.channels.create({
                name: "meteo",
                type: 0,
            })
            .then(channel =>  {
                const categoryId = channelId.id;
                channel.setParent(categoryId);
                interaction.reply("Le channel a été créé");
            })        
            
        }
    }
}
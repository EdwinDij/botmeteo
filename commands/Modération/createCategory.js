const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("createcategory")
        .setDescription("Créer la catégorie du bot"),


    async execute(interaction) {
        if (interaction.guild.channels.cache.find(channel => channel.name !== "Bot")) {
            await interaction.guild.channels.create({
                name: "Bot",
                type: 4,
            });
            await interaction.reply("Catégorie créée");
        } else {
            await interaction.reply("La catégorie existe déjà");
        }
    }
}
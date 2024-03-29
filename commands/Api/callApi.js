const { SlashCommandBuilder } = require("discord.js");
require('dotenv').config();
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("meteo")
        .setDescription("Affiche la météo du jour de la ville actuelle.")
        .addStringOption(option => option.setName("ville").setDescription("Ville actuelle").setRequired(true)),
    async execute(interaction) {
        const ville = interaction.options.getString("ville");
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${process.env.API_KEY}&units=metric&lang=fr`;
        const response = await axios.get(url);
        const data = response.data;
        console.log(data)
        const embed = {
            color: 0x9900FF,
            title: `Météo de ${data.name}`,
            description: `Il fait actuellement ${data.main.temp}°C à ${data.name}.`,
            fields: [
                {
                    name: "Température ressentie",
                    value: `${data.main.feels_like}°C`,
                    inline: true
                },
                {
                    name: "Température minimale",
                    value: `${data.main.temp_min}°C`,
                    inline: true
                },
                {
                    name: "Température maximale",
                    value: `${data.main.temp_max}°C`,
                    inline: true
                },
                {
                    name: "temps",
                    value: `${data.weather[0].description}`,
                    inline: true
                },


            ],
            image: {
                url: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
            },
        };
        await interaction.reply({ embeds: [embed] });

    }
}
const { SlashCommandBuilder } = require('discord.js');
const { Events } = require('discord.js');
const { Client, GatewayIntentBits  } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('autometeo')
        .setDescription('Affiche la météo de la ville de votre choix périodiquement.')
        .addStringOption(option => option.setName('ville').setDescription('Ville actuelle').setRequired(true)),
        
    async execute(interaction) {
        interaction.reply({
            content: `${interaction.options.getString('ville')}`,
            ephemeral: true,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 1,
                            label: '8H',
                            custom_id: '8H',
                        },
                        {
                            type: 2,
                            style: 1,
                            label: '12H',
                            custom_id: '12H'
                        },
                        {
                            type: 2,
                            style: 1,
                            label: '16H',
                            custom_id: '16H'
                        },
                        {
                            type: 2,
                            style: 1,
                            label: '20H',
                            custom_id: '20H'
                        }

                    ]
                }
            ]

        })
    }

}

const { SlashCommandBuilder } = require("discord.js");
require('dotenv').config();
const axios = require('axios');
const command = require('../commands/Api/callApi');

describe('Meteo command', () => {
  test('should return the correct weather data', async () => {
    const cityName = 'Paris';
    const mockResponse = {
      data: {
        name: cityName,
        main: {
          temp: 15,
          feels_like: 13,
          temp_min: 12,
          temp_max: 17,
        },
        weather: [
          {
            description: 'light rain',
            icon: '10d',
          },
        ],
      },
    };
    jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);
    const mockInteraction = {
      options: {
        getString: jest.fn().mockReturnValue(cityName),
      },
      reply: jest.fn(),
    };
    await command.execute(mockInteraction);
    expect(mockInteraction.reply).toHaveBeenCalledWith({
      embeds: [
        {
          color: 0x9900FF,
          title: `Météo de ${cityName}`,
          description: `Il fait actuellement 15°C à ${cityName}.`,
          fields: [
            {
              name: "Température ressentie",
              value: "13°C",
              inline: true,
            },
            {
              name: "Température minimale",
              value: "12°C",
              inline: true,
            },
            {
              name: "Température maximale",
              value: "17°C",
              inline: true,
            },
            {
              name: "temps",
              value: "light rain",
              inline: true,
            },
          ],
          image: {
            url: `http://openweathermap.org/img/wn/10d.png`,
          },
        },
      ],
    });
  });
});

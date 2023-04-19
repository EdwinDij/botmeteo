const { SlashCommandBuilder } = require("discord.js");
require('dotenv').config();
const axios = require('axios');
const { execute } = require('../commands/Api/callApi');

jest.mock('axios');

describe('Test unitaire pour la commande "meteo"', () => {
  const mockInteraction = {
    options: {
      getString: jest.fn().mockReturnValue('Paris'),
    },
    reply: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('doit retourner la météo de la ville demandée', async () => {
    const mockResponse = {
      data: {
        name: 'Paris',
        main: { temp: 20 },
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    await execute(mockInteraction);

    expect(mockInteraction.options.getString).toHaveBeenCalledWith('ville');
    expect(axios.get).toHaveBeenCalledWith(`http://api.openweathermap.org/data/2.5/weather?q=Paris&appid=${process.env.API_KEY}&units=metric&lang=fr`);
    expect(mockInteraction.reply).toHaveBeenCalledWith({
      embeds: [{
        color: 0x9900FF,
        title: 'Météo de Paris',
        description: 'Il fait actuellement 20°C à Paris.',
      }],
    });
  });
});

import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class AppService {
  async climaDaCidade(cidade: string) {
    const chavedaapi = 'x7x1/ROfdQInbFu1j60j7g==qDJQLrZgbMHe5Azr';
    const respostaCidade = await fetch(
      'https://api.api-ninjas.com/v1/geocoding?city=' + cidade,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': chavedaapi,
        },
      },
    );
    const objCity = await respostaCidade.json();
    const latitude = objCity[0].latitude;
    const longitude = objCity[0].longitude;

    const respostaClima = await fetch(
      'https://api.api-ninjas.com/v1/weather?lat=' +
        latitude +
        '&lon=' +
        longitude,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': chavedaapi,
        },
      },
    );
    const objClima = await respostaClima.json();

    return JSON.stringify({
      minTemp: objClima.min_temp,
      maxTemp: objClima.max_temp,
      averageTemp: (objClima.min_temp + objClima.max_temp) / 2,
    });
  }
}

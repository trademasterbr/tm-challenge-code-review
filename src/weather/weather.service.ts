import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { WeatherResponseData } from "./weather.response.data";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class WeatherService {

  private rc = {
    headers: {
      'X-Api-Key': 'x7x1/ROfdQInbFu1j60j7g==qDJQLrZgbMHe5Azr',
      'Content-Type': 'application/json'
    }
  };

  constructor(private readonly httpService: HttpService) { }
  
  async getCity(city: any): Promise<WeatherResponseData> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<WeatherResponseData>(`https://api.api-ninjas.com/v1/weather?city=${city.city}`, this.rc).pipe(
          catchError((error: AxiosError) => {
            console.error(error);
            throw error.response?.data || error.message || 'Erro desconhecido ao obter dados do clima.';
          })
        )
      );
      return data;
    } catch(err) {
      throw new InternalServerErrorException({
        descriptionOrOptions: err,
      });
    }
  }

  async getCities(cities: any): Promise<Array<WeatherResponseData>> {
    const errors = [];
    const requests = cities.map(async (city) => {
      try {
        const { data } = await firstValueFrom(
          this.httpService.get<WeatherResponseData>(`https://api.api-ninjas.com/v1/weather?city=${city.city}`, this.rc).pipe(
            catchError((error: AxiosError) => {
              console.error(error);
              throw error.response?.data || error.message || 'Erro desconhecido ao obter dados do clima.';
            })
          )
        );
        return data;
      } catch (err) {
        errors.push(err);
      }
    });

    const results = await Promise.all(requests);
    
    if (errors.length > 0) {
      throw new InternalServerErrorException({
        descriptionOrOptions: errors,
      });
    }

    return results;
  }

  async getMedia(city: any): Promise<string> {
    try {
      const response = await this.getCity(city);
      return `${(response.max_temp + response.min_temp) / 2}`;
    } catch (err) {
      throw new InternalServerErrorException({
        descriptionOrOptions: err,
      });
    }
  }
}

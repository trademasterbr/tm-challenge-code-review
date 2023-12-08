import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { WeatherResponseData } from "./weather.response.data";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError, AxiosHeaders } from "axios";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class WeatherService {

  constructor(private readonly httpService: HttpService) { }
  
  async getCity(city: any): Promise<WeatherResponseData> {
  
    try {
      let rc = {
        headers: {
          'X-Api-Key': 'x7x1/ROfdQInbFu1j60j7g==qDJQLrZgbMHe5Azr',
          'Content-Type': 'application/json'
        }
    };
      const { data } = await firstValueFrom(
        this.httpService.get<WeatherResponseData>(`https://api.api-ninjas.com/v1/weather?city=${city.city}`, rc).pipe(
          catchError((error: AxiosError) => {
            console.log(error.response.data);
            throw error.response.data;
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
    let x: Array<WeatherResponseData>
    cities.array.forEach(async element => {
      try {
        let rc = {
          headers: {
            'X-Api-Key': 'x7x1/ROfdQInbFu1j60j7g==qDJQLrZgbMHe5Azr',
            'Content-Type': 'application/json'
          }
      };
        const { data } = await firstValueFrom(
          this.httpService.get<WeatherResponseData>(`https://api.api-ninjas.com/v1/weather?city=${city.city}`, rc).pipe(
            catchError((error: AxiosError) => {
              console.log(error.response.data);
              throw error.response.data;
            })
          )
        );
        x.push(data);
      } catch(err) {
        throw new InternalServerErrorException({
          descriptionOrOptions: err,
        });
      }
    });
    return x;
  }

  async getMedia(city: any): Promise<string> {
    let response = this.getCity(city);
    return `${(response.max_temp + await response.min_temp) / 2}`
  }
}
import { Injectable, Controller, Inject, Post, HttpCode, Body, Get } from "@nestjs/common";
import { WeatherResponseData } from "./weather.response.data";
import { WeatherService } from "./weather.service";

@Injectable()
@Controller('weather')
export class WeatherController {
  constructor(
    @Inject(WeatherService)
    private readonly service: WeatherService) {}

  @Get('/city')
  @HttpCode(201)
  async createAccessToken(@Body() city: string): Promise<any> {
    return await this.service.getCity(city);
  }

  @Get('/cities')
  @HttpCode(201)
  async getCities(@Body() city: string): Promise<any> {
    return await this.service.getCities(city);
  }

  @Get('/average')
  @HttpCode(201)
  async getAverage(@Body() city: string): Promise<any> {
    const response = this.service.getCity(city);
    return `${(response.max_temp + await response.min_temp) / 2}`
  }
}
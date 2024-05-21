import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import express from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('payed')
   async getHello(@Res() res: express.Response) {
    const { data, contentType } = await this.appService.getHello()
    res.set('Content-Type', contentType)
    res.send(data)
  }

  @Get()
  get() {
    console.log("Hello World!")    
  }
}

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Multer } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('syllabus')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSyllabus(@UploadedFile() file: Express.Multer.File) {
    return this.appService.processSyllabus(file);
  }
}

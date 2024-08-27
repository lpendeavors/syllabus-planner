import { Injectable } from '@nestjs/common';
import { pdfToText } from 'pdf-ts';
import * as mammoth from 'mammoth';
import OpenAI from 'openai';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class AppService {
  private openai = new OpenAI({
    apiKey: process.env['OPEN_AI_KEY'],
  });

  async processSyllabus(file: Express.Multer.File) {
    let text: string = '';

    if (file.mimetype === 'application/pdf') {
      text = await this.processPdf(file.buffer);
    } else if (
      file.mimetype === 'application/msword' ||
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await this.processWord(file.buffer);
    } else if (file.mimetype.startsWith('image/')) {
      text = await this.processImage(file.buffer);
    } else {
      throw new Error('Unsupported file type');
    }

    if (text.length) {
      return this.processText(text);
    }

    throw new Error('No text found in file');
  }

  private async processPdf(buffer: Buffer) {
    const text = await pdfToText(buffer);
    return text;
  }

  private async processWord(buffer: Buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  private async processImage(buffer: Buffer) {
    const { data } = await Tesseract.recognize(buffer, 'eng');
    return data.text;
  }

  private async processText(text: string) {
    const prompt = `
      Given the following syllabus text, extract the following information and provide the response in JSON format:
      1. Lecture and reading schedule (with dates, topics, and readings)
      2. Key dates for exams and assignments (be extra sure not to miss any)
      3. Grading breakdown of assignments

      Notes: Some syllaubi may have date and time and so include both if available.. Dates should be javascript 
      format Date objects with fallback of using string if not possible. If an exam date overlaps with a lecture,
      just include the exam date in the key dates.

      Ensure the JSON format is strictly as follows:

      {
        "courseTitle": "string",
        "courseSubject": "string",
        "courseNumber": "string",
        "instructor": "string",
        "description": "string",
        "lectureSchedule": [
          {
            "date": Date | "string",
            "topic": "string",
            "readings": [
              "string"
            ]
          }
        ],
        "keyDates": {
          "exams": [
            {
              "name": "string",
              "date": Date | "string",
              "coverage": "string",
              "points": number,
            }
          ],
          "assignments": [
            {
              "name": "string",
              "date": Date | "string",
              "points": number,
            }
          ]
        },
        "gradingBreakdown": [
          {
            "component": "string",
            "points": number,
            "percentage": number,
            "dates": [
              Date | "string"
            ]
          }
        ]
      }

      Syllabus Text:
      ${text}
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' },
      n: 1,
    });

    return response.choices[0].message.content;
  }
}

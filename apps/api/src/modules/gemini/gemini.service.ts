import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly client: GoogleGenAI;
  private readonly modelName = 'gemini-2.5-flash';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.client = new GoogleGenAI({ apiKey });
  }

  /**
   * Generate structured JSON output dari Gemini.
   * Menjamin response adalah JSON valid sesuai schema yang diminta.
   */
  async generateJson<T>(prompt: string): Promise<T> {
    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
          maxOutputTokens: 8192,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('Gemini returned empty response');
      }

      return JSON.parse(text) as T;
    } catch (error) {
      this.logger.error('Gemini generateJson error', error);
      throw new InternalServerErrorException(
        'AI gagal generate konten. Coba lagi dalam beberapa saat.',
      );
    }
  }
}

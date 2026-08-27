import {
  Controller,
  Post,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GeneratorService } from './generator.service';
import { GenerateDto } from './dto/generate.dto';
import { GenerateResponseDto } from './dto/generate-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Generator')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/generator')
export class GeneratorController {
  constructor(private generatorService: GeneratorService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate media pembelajaran (Presentasi TV, LKPD, E-Book)',
    description:
      'Kirim konteks pembelajaran + konfigurasi output. AI akan generate semua media yang dipilih secara paralel.',
  })
  @ApiResponse({
    status: 201,
    description: 'Media berhasil di-generate dan disimpan',
    type: GenerateResponseDto,
  })
  @ApiResponse({ status: 403, description: 'Kuota generate habis' })
  async generate(
    @Body() dto: GenerateDto,
    @CurrentUser() user: { id: string; quota: number },
  ) {
    if (user.quota <= 0) {
      throw new ForbiddenException(
        'Kuota generate kamu sudah habis. Hubungi admin untuk tambah kuota.',
      );
    }

    const result = await this.generatorService.generate(dto, user.id);

    return {
      success: true,
      message: 'Media pembelajaran berhasil diracik oleh AI!',
      data: result,
    };
  }
}

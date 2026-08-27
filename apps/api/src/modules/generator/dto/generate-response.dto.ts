import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GeneratorOutputsDto {
  @ApiPropertyOptional({ description: 'Data presentasi TV interaktif (slide, theme, kuis)' })
  presentasi?: Record<string, any> | null;

  @ApiPropertyOptional({ description: 'Data LKPD cetak (soal, petunjuk, identitas, rubrik)' })
  lkpd?: Record<string, any> | null;

  @ApiPropertyOptional({ description: 'Data E-Book web (bab, karakter, kamus, pemantik diskusi)' })
  ebook?: Record<string, any> | null;
}

export class GenerateResultDataDto {
  @ApiProperty({ example: 'cmtbip9es00022b6silmwewdu' })
  projectId: string;

  @ApiProperty({ example: 'Sistem Tata Surya - IPAS Fase B' })
  title: string;

  @ApiProperty({ type: GeneratorOutputsDto })
  outputs: GeneratorOutputsDto;
}

export class GenerateResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Media pembelajaran berhasil diracik oleh AI!' })
  message: string;

  @ApiProperty({ type: GenerateResultDataDto })
  data: GenerateResultDataDto;
}

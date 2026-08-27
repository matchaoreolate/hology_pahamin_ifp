import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectItemDto {
  @ApiProperty({ example: 'cmtbip9es00022b6silmwewdu' })
  id: string;

  @ApiProperty({ example: 'Sistem Tata Surya - IPAS Fase B' })
  title: string;

  @ApiProperty({ example: 'IPAS' })
  subject: string;

  @ApiProperty({ example: 'B' })
  phase: string;

  @ApiProperty({ example: 'Sistem Tata Surya' })
  topic: string;

  @ApiProperty({ example: 'DONE' })
  status: string;

  @ApiProperty({ example: true })
  hasPresentasi: boolean;

  @ApiProperty({ example: true })
  hasLkpd: boolean;

  @ApiProperty({ example: false })
  hasEbook: boolean;

  @ApiProperty({ example: '2026-08-27T12:47:17.474Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-08-27T12:47:17.474Z' })
  updatedAt: string;
}

export class ProjectDetailDto extends ProjectItemDto {
  @ApiProperty({ example: 'cmtbio8pf00002b6sfgtopn0f' })
  userId: string;

  @ApiProperty({ example: 'Peserta didik dapat mengidentifikasi urutan planet...' })
  learningGoal: string;

  @ApiProperty({ example: 2 })
  durationJP: number;

  @ApiPropertyOptional({ example: 'pesisir' })
  geoContext?: string | null;

  @ApiPropertyOptional({ example: 'campuran' })
  classLevel?: string | null;

  @ApiPropertyOptional({ example: 'Benda-benda langit' })
  apersepsi?: string | null;

  @ApiPropertyOptional({ description: 'Data JSON slide presentasi TV' })
  presentationData?: Record<string, any> | null;

  @ApiPropertyOptional({ description: 'Data JSON lembar kerja LKPD' })
  lkpdData?: Record<string, any> | null;

  @ApiPropertyOptional({ description: 'Data JSON bab dan karakter E-Book' })
  ebookData?: Record<string, any> | null;
}

export class ProjectListResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ type: [ProjectItemDto] })
  data: ProjectItemDto[];
}

export class ProjectDetailResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: ProjectDetailDto })
  data: ProjectDetailDto;
}

import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  FaseKelas,
  GeoContext,
  ClassLevel,
  VisualTheme,
  ClassMode,
  LkpdQuestionType,
  EbookNarrativeStyle,
} from './enums';

export class GenerateDto {
  // ── Tahap 1: Profil Konteks ──────────────────
  @ApiProperty({ enum: FaseKelas, example: FaseKelas.B, description: 'Fase A (Kls 1-2), B (Kls 3-4), C (Kls 5-6)' })
  @IsEnum(FaseKelas)
  fase: FaseKelas;

  @ApiProperty({ example: 'IPAS', description: 'Mata pelajaran SD' })
  @IsString()
  @IsNotEmpty()
  mataPelajaran: string;

  @ApiProperty({ example: 'Sistem Tata Surya', description: 'Topik materi spesifik' })
  @IsString()
  @IsNotEmpty()
  topik: string;

  @ApiProperty({
    example: 'Peserta didik dapat mengidentifikasi urutan planet dan perbedaan karakteristiknya.',
    description: 'Tujuan Pembelajaran (TP) dari Modul Ajar / RPP',
  })
  @IsString()
  @IsNotEmpty()
  tujuanPembelajaran: string;

  @ApiProperty({ example: 2, description: 'Alokasi Jam Pelajaran: 1 = 35 mnt, 2 = 70 mnt' })
  @IsInt()
  @Min(1)
  @Max(4)
  durasiJP: number;

  @ApiPropertyOptional({ enum: GeoContext, example: GeoContext.PESISIR, description: 'Latar geografis untuk analogi lokal' })
  @IsOptional()
  @IsEnum(GeoContext)
  geoContext?: GeoContext;

  @ApiPropertyOptional({ enum: ClassLevel, example: ClassLevel.CAMPURAN, description: 'Tingkat kesiapan siswa' })
  @IsOptional()
  @IsEnum(ClassLevel)
  classLevel?: ClassLevel;

  @ApiPropertyOptional({ example: 'Benda-benda langit', description: 'Materi minggu lalu untuk jembatan pemahaman' })
  @IsOptional()
  @IsString()
  apersepsi?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['analogi', 'visual', 'aktivitas_fisik'],
    description: 'Fokus pendekatan: analogi | visual | aktivitas_fisik',
  })
  @IsOptional()
  @IsArray()
  fokusApproach?: string[];

  // ── Tahap 2: Output Selection ──────────────────
  @ApiProperty({ example: true, description: 'Aktifkan Presentasi TV Interaktif' })
  @IsBoolean()
  generatePresentasi: boolean;

  @ApiProperty({ example: true, description: 'Aktifkan LKPD Cetak' })
  @IsBoolean()
  generateLkpd: boolean;

  @ApiProperty({ example: false, description: 'Aktifkan E-Book Berbasis Web' })
  @IsBoolean()
  generateEbook: boolean;

  // ── Tahap 2a: Presentasi Config ──────────────
  @ApiPropertyOptional({ enum: VisualTheme, example: VisualTheme.CUTE_3D })
  @IsOptional()
  @IsEnum(VisualTheme)
  visualTheme?: VisualTheme;

  @ApiPropertyOptional({ enum: ClassMode, example: ClassMode.SEIMBANG })
  @IsOptional()
  @IsEnum(ClassMode)
  classMode?: ClassMode;

  @ApiPropertyOptional({ example: true, description: 'Sisipkan aktivitas fisik / ice breaking' })
  @IsOptional()
  @IsBoolean()
  iceBreaking?: boolean;

  @ApiPropertyOptional({ example: 'Sertakan jembatan keledai tata surya' })
  @IsOptional()
  @IsString()
  instruksiSpesifik?: string;

  // ── Tahap 2b: LKPD Config ────────────────────
  @ApiPropertyOptional({ enum: LkpdQuestionType, example: LkpdQuestionType.PILIHAN_GANDA })
  @IsOptional()
  @IsEnum(LkpdQuestionType)
  lkpdQuestionType?: LkpdQuestionType;

  @ApiPropertyOptional({ example: 10, description: 'Jumlah total soal LKPD' })
  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(30)
  lkpdJumlahSoal?: number;

  @ApiPropertyOptional({ example: 70, description: 'Persentase soal tingkat mudah (0-100)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  lkpdPersenMudah?: number;

  @ApiPropertyOptional({ example: true, description: 'Sertakan lembar rubrik penilaian guru' })
  @IsOptional()
  @IsBoolean()
  lkpdRubrik?: boolean;

  // ── Tahap 2c: E-Book Config ──────────────────
  @ApiPropertyOptional({ enum: EbookNarrativeStyle, example: EbookNarrativeStyle.BUKU_CERITA })
  @IsOptional()
  @IsEnum(EbookNarrativeStyle)
  ebookStyle?: EbookNarrativeStyle;

  @ApiPropertyOptional({ example: true, description: 'Sertakan halaman kamus mini glosarium' })
  @IsOptional()
  @IsBoolean()
  ebookGlosarium?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Sertakan panduan diskusi orang tua di rumah' })
  @IsOptional()
  @IsBoolean()
  ebookPemantikDiskusi?: boolean;
}

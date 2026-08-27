import { IsOptional, IsString, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Sistem Tata Surya - Versi Edit' })
  @IsOptional()
  @IsString()
  title?: string;

  /**
   * Update konten presentasi (JSON object langsung dari FE setelah guru edit)
   */
  @ApiPropertyOptional({ description: 'Update data presentasi TV (JSON)' })
  @IsOptional()
  @IsObject()
  presentationData?: Record<string, any>;

  /**
   * Update konten LKPD
   */
  @ApiPropertyOptional({ description: 'Update data LKPD (JSON)' })
  @IsOptional()
  @IsObject()
  lkpdData?: Record<string, any>;

  /**
   * Update konten E-Book
   */
  @ApiPropertyOptional({ description: 'Update data E-Book (JSON)' })
  @IsOptional()
  @IsObject()
  ebookData?: Record<string, any>;
}

import {
  IsEmail,
  IsString,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Budi Santoso' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'budi@guru.sch.id' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({
    example: 'GuruJuara#2026',
    description:
      'Minimal 8 karakter, wajib kombinasi huruf besar, huruf kecil, angka, dan simbol khusus',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password harus minimal 8 karakter dan mengandung kombinasi huruf besar, huruf kecil, angka, serta karakter khusus/simbol (@$!%*#?&)',
    },
  )
  password: string;

  @ApiPropertyOptional({ example: 'SDN 01 Surabaya' })
  @IsOptional()
  @IsString()
  schoolName?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'budi@guru.sch.id' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @ApiProperty({ example: 'GuruJuara#2026' })
  @IsString()
  password: string;
}

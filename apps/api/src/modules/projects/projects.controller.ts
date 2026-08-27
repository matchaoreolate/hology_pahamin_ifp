import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Header,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ProjectListResponseDto,
  ProjectDetailResponseDto,
} from './dto/project-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Projects')
@Controller('api/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  // ── GET /api/projects ─────────────────────────────────────
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ambil semua projek media ajar milik guru yang login' })
  @ApiResponse({ status: 200, type: ProjectListResponseDto, description: 'Daftar projek guru' })
  async findAll(@CurrentUser() user: { id: string }) {
    const data = await this.projectsService.findAll(user.id);
    return {
      success: true,
      total: data.length,
      data,
    };
  }

  // ── GET /api/projects/:id ─────────────────────────────────
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOperation({ summary: 'Ambil detail 1 projek beserta seluruh data media (presentasi, LKPD, E-Book)' })
  @ApiResponse({ status: 200, type: ProjectDetailResponseDto, description: 'Detail lengkap projek' })
  @ApiResponse({ status: 404, description: 'Projek tidak ditemukan' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    const data = await this.projectsService.findOne(id, user.id);
    return { success: true, data };
  }

  // ── PUT /api/projects/:id ─────────────────────────────────
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOperation({
    summary: 'Update konten projek (guru edit slide / soal / judul)',
    description: 'Partial update — hanya field yang dikirim yang akan diupdate.',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @CurrentUser() user: { id: string },
  ) {
    const data = await this.projectsService.update(id, user.id, dto);
    return {
      success: true,
      message: 'Projek berhasil diupdate.',
      data,
    };
  }

  // ── DELETE /api/projects/:id ──────────────────────────────
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOperation({ summary: 'Hapus projek beserta seluruh data media' })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    const data = await this.projectsService.remove(id, user.id);
    return {
      success: true,
      message: 'Projek berhasil dihapus.',
      data,
    };
  }

  // ── GET /api/projects/:id/ebook/public ────────────────────
  // Endpoint ini TIDAK perlu JWT — akses via QR code orang tua
  @Get(':id/ebook/public')
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOperation({
    summary: 'Akses E-Book publik (tanpa login) — untuk scan QR Code orang tua',
  })
  @ApiResponse({ status: 404, description: 'E-Book tidak ditemukan' })
  async getEbookPublic(@Param('id') id: string) {
    const data = await this.projectsService.getEbookPublic(id);
    return { success: true, data };
  }

  // ── GET /api/projects/:id/lkpd/print ──────────────────────
  // Endpoint HTML siap cetak untuk LKPD
  @Get(':id/lkpd/print')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiOperation({
    summary: 'Tampilan HTML LKPD siap cetak (A4 format) — langsung print via browser',
  })
  @ApiResponse({ status: 200, description: 'Render HTML LKPD siap cetak' })
  async getLkpdPrint(@Param('id') id: string) {
    return this.projectsService.getLkpdPrintHtml(id);
  }
}

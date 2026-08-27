import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { formatProject, parseJsonField } from './helpers/project.mapper';
import { renderLkpdPrintableHtml } from './templates/lkpd.template';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // ── GET semua projek milik guru ─────────────────────────────
  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        subject: true,
        phase: true,
        topic: true,
        status: true,
        hasPresentasi: true,
        hasLkpd: true,
        hasEbook: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // ── GET detail 1 projek ─────────────────────────────────────
  async findOne(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new NotFoundException('Projek tidak ditemukan.');
    if (project.userId !== userId) {
      throw new ForbiddenException('Kamu tidak punya akses ke projek ini.');
    }

    return formatProject(project);
  }

  // ── UPDATE konten projek (guru edit slide/soal) ─────────────
  async update(projectId: string, userId: string, dto: UpdateProjectDto) {
    await this.findOne(projectId, userId); // verify ownership

    const updated = await this.prisma.project.update({
      where: { id: projectId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.presentationData && {
          presentationData: JSON.stringify(dto.presentationData),
        }),
        ...(dto.lkpdData && {
          lkpdData: JSON.stringify(dto.lkpdData),
        }),
        ...(dto.ebookData && {
          ebookData: JSON.stringify(dto.ebookData),
        }),
      },
    });

    return formatProject(updated);
  }

  // ── DELETE projek ────────────────────────────────────────────
  async remove(projectId: string, userId: string) {
    await this.findOne(projectId, userId); // verify ownership
    await this.prisma.project.delete({ where: { id: projectId } });
    return { deleted: true, projectId };
  }

  // ── GET E-Book public (untuk akses via QR, tanpa auth) ──────
  async getEbookPublic(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        subject: true,
        topic: true,
        hasEbook: true,
        ebookData: true,
      },
    });

    if (!project || !project.hasEbook) {
      throw new NotFoundException('E-Book tidak ditemukan.');
    }

    return {
      id: project.id,
      title: project.title,
      subject: project.subject,
      topic: project.topic,
      ebook: parseJsonField(project.ebookData),
    };
  }

  // ── GET LKPD Printable HTML ────────────────────────────────
  async getLkpdPrintHtml(projectId: string): Promise<string> {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: { select: { schoolName: true } },
      },
    });

    if (!project || !project.hasLkpd || !project.lkpdData) {
      throw new NotFoundException('LKPD tidak ditemukan untuk projek ini.');
    }

    const lkpdData = parseJsonField(project.lkpdData);
    if (!lkpdData) throw new NotFoundException('Data LKPD tidak valid.');

    return renderLkpdPrintableHtml(lkpdData as any, project.user?.schoolName);
  }
}

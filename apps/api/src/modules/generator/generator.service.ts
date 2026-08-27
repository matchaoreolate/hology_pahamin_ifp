import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateDto } from './dto/generate.dto';
import {
  buildPresentasiPrompt,
  buildLkpdPrompt,
  buildEbookPrompt,
} from './prompts';

@Injectable()
export class GeneratorService {
  private readonly logger = new Logger(GeneratorService.name);

  constructor(
    private gemini: GeminiService,
    private prisma: PrismaService,
  ) {}

  async generate(dto: GenerateDto, userId: string) {
    this.logger.log(
      `[${userId}] Generating media: presentasi=${dto.generatePresentasi}, lkpd=${dto.generateLkpd}, ebook=${dto.generateEbook}`,
    );

    // ── Jalankan semua AI call secara paralel ──────────────────
    const [presentationData, lkpdData, ebookData] = await Promise.all([
      dto.generatePresentasi
        ? this.gemini.generateJson(buildPresentasiPrompt(dto))
        : Promise.resolve(null),

      dto.generateLkpd
        ? this.gemini.generateJson(buildLkpdPrompt(dto))
        : Promise.resolve(null),

      dto.generateEbook
        ? this.gemini.generateJson(buildEbookPrompt(dto))
        : Promise.resolve(null),
    ]);

    // ── Simpan draft ke DB ─────────────────────────────────────
    const project = await this.prisma.project.create({
      data: {
        userId,
        title: `${dto.topik} - ${dto.mataPelajaran} Fase ${dto.fase}`,
        subject: dto.mataPelajaran,
        phase: dto.fase,
        topic: dto.topik,
        learningGoal: dto.tujuanPembelajaran,
        durationJP: dto.durasiJP,
        geoContext: dto.geoContext,
        classLevel: dto.classLevel,
        apersepsi: dto.apersepsi,

        hasPresentasi: dto.generatePresentasi,
        hasLkpd: dto.generateLkpd,
        hasEbook: dto.generateEbook,

        presentationData: presentationData ? JSON.stringify(presentationData) : null,
        lkpdData: lkpdData ? JSON.stringify(lkpdData) : null,
        ebookData: ebookData ? JSON.stringify(ebookData) : null,

        status: 'DONE',
      },
    });

    // ── Kurangi kuota user ─────────────────────────────────────
    await this.prisma.user.update({
      where: { id: userId },
      data: { quota: { decrement: 1 } },
    });

    return {
      projectId: project.id,
      title: project.title,
      outputs: {
        presentasi: presentationData,
        lkpd: lkpdData,
        ebook: ebookData,
      },
    };
  }
}

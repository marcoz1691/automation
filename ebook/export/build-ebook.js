#!/usr/bin/env node
/**
 * InmoSmart AI — Generador de ebook PDF/HTML
 * Uso:
 *   node build-ebook.js              → PDF completo + Canva + todos los países
 *   node build-ebook.js --pais ecuador → PDF enfocado Ecuador (mercado principal)
 *   node build-ebook.js --pdf        → Solo PDF
 *   node build-ebook.js --canva      → Solo paquete Canva
 */

const fs = require('fs');
const path = require('path');
const { mdToPdf } = require('md-to-pdf');

const ROOT = path.join(__dirname, '..');
const CONTENIDO = path.join(ROOT, 'contenido');
const EXPORT = __dirname;
const CANVA_DIR = path.join(EXPORT, 'canva-paginas');

const MAIN_FILES = [
  '00-portada.md',
  '01-introduccion.md',
  '02-capitulo-1.md',
  '03-capitulo-2.md',
  '04-capitulo-3.md',
  '05-capitulo-4.md',
  '06-capitulo-5.md',
  '07-capitulo-6.md',
  '08-capitulo-7.md',
  '09-capitulo-8.md',
  '10-capitulo-9.md',
  '11-capitulo-10.md',
  '12-capitulo-11.md',
  '13-capitulo-12.md',
  '14-capitulo-13.md',
  '15-capitulo-14.md',
  '16-conclusion.md',
  '17-preguntas-frecuentes.md',
  '18-glosario.md',
];

const RECURSOS_ANEXO = [
  { file: '../recursos/checklists.md', title: 'Anexo A — Checklists' },
  { file: '../recursos/plantillas.md', title: 'Anexo B — Plantillas' },
  { file: '../recursos/prompts-ia.md', title: 'Anexo C — Prompts de IA (110)' },
  { file: '../recursos/mensajes-whatsapp.md', title: 'Anexo D — Mensajes WhatsApp' },
  { file: '../recursos/casos-practicos.md', title: 'Anexo E — Casos prácticos simulados' },
];

/** Ecuador primero — mercado principal */
const ADAPTACIONES = [
  { file: '../adaptaciones/ecuador.md', title: 'Anexo F — Adaptación Ecuador ⭐ (mercado principal)', code: 'ecuador' },
  { file: '../adaptaciones/mexico.md', title: 'Anexo G — Adaptación México', code: 'mexico' },
  { file: '../adaptaciones/colombia.md', title: 'Anexo H — Adaptación Colombia', code: 'colombia' },
  { file: '../adaptaciones/peru.md', title: 'Anexo I — Adaptación Perú', code: 'peru' },
  { file: '../adaptaciones/chile.md', title: 'Anexo J — Adaptación Chile', code: 'chile' },
];

function readFile(relPath) {
  const full = path.isAbsolute(relPath) ? relPath : path.join(EXPORT, relPath);
  if (!fs.existsSync(full)) return '';
  return fs.readFileSync(full, 'utf8');
}

function stripMetaBlock(content) {
  return content.replace(/^#\s+Capítulo[\s\S]*?---\n\n/m, '').trim();
}

function getPaisArg(args) {
  const idx = args.indexOf('--pais');
  if (idx === -1) return 'all';
  return args[idx + 1] || 'all';
}

function buildMarkdown({ includeRecursos = true, pais = 'all' } = {}) {
  const parts = [];

  parts.push(`---
title: Vende tu Propiedad Más Rápido con Inteligencia Artificial
author: InmoSmart AI
---

`);

  for (const file of MAIN_FILES) {
    const content = readFile(path.join(CONTENIDO, file));
    if (content) {
      parts.push('\n\n---\n\n');
      parts.push(stripMetaBlock(content));
    }
  }

  if (includeRecursos) {
    parts.push('\n\n# Recursos adicionales\n\n');
    for (const anexo of RECURSOS_ANEXO) {
      const content = readFile(anexo.file);
      if (content) {
        parts.push(`\n\n---\n\n## ${anexo.title}\n\n`);
        parts.push(content.replace(/^#\s+.+\n\n/m, ''));
      }
    }

    const adaptaciones =
      pais === 'all'
        ? ADAPTACIONES
        : ADAPTACIONES.filter((a) => a.code === pais);

    if (adaptaciones.length) {
      parts.push('\n\n# Adaptaciones por país\n\n');
      for (const anexo of adaptaciones) {
        const content = readFile(anexo.file);
        if (content) {
          parts.push(`\n\n---\n\n## ${anexo.title}\n\n`);
          parts.push(content.replace(/^#\s+.+\n\n/m, ''));
        }
      }
    }
  }

  return parts.join('');
}

function buildCanvaPages() {
  if (!fs.existsSync(CANVA_DIR)) fs.mkdirSync(CANVA_DIR, { recursive: true });

  let index = 0;

  for (const file of MAIN_FILES) {
    const content = readFile(path.join(CONTENIDO, file));
    if (!content) continue;
    index++;
    const name = file.replace('.md', '');
    const header = `# Paquete Canva — ${name}

> **Instrucciones:** Crear página A4 (210×297 mm) en Canva. Copiar secciones una por una.
> **Paleta:** Azul #1B3A5C · Dorado #C9A962 · Gris #F4F6F8 · Texto #2D3748
> **Mercado principal:** Ecuador · Precios en USD
> **Fuentes:** Montserrat Bold (títulos) · Open Sans (cuerpo)

---

`;
    fs.writeFileSync(
      path.join(CANVA_DIR, `${name}-canva.md`),
      header + stripMetaBlock(content),
      'utf8'
    );
  }

  // Adaptación Ecuador para Canva
  const ecuador = readFile('../adaptaciones/ecuador.md');
  if (ecuador) {
    fs.writeFileSync(
      path.join(CANVA_DIR, 'adaptacion-ecuador-canva.md'),
      `# Paquete Canva — Adaptación Ecuador (mercado principal)\n\n${ecuador}`,
      'utf8'
    );
  }

  const resumenRecursos = `# Paquete Canva — Recursos premium

Los recursos completos están en /recursos/. Para Canva:
1. Exportar checklists como páginas tipo «lista con iconos»
2. Exportar plantillas como páginas editables duplicables
3. Prompts: fuente monospace 9-10 pt en cajas grises (#F4F6F8)
4. Adaptación Ecuador: ver adaptacion-ecuador-canva.md

Consultar guia-canva.md para especificaciones detalladas.
`;
  fs.writeFileSync(path.join(CANVA_DIR, 'recursos-canva-indice.md'), resumenRecursos, 'utf8');

  return index;
}

async function generatePdf(mdPath, pdfPath) {
  const cssPath = path.join(EXPORT, 'estilos-ebook.css');
  await mdToPdf(
    { path: mdPath },
    {
      dest: pdfPath,
      stylesheet: [cssPath],
      pdf_options: {
        format: 'A4',
        margin: { top: '20mm', bottom: '25mm', left: '22mm', right: '22mm' },
        printBackground: true,
      },
      launch_options: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
    }
  );
}

async function main() {
  const args = process.argv.slice(2);
  const htmlOnly = args.includes('--html-only');
  const generatePdfFlag = args.includes('--pdf') || args.length === 0;
  const canvaFlag = args.includes('--canva') || args.length === 0;
  const pais = getPaisArg(args);

  console.log('📘 InmoSmart AI — Generador de ebook');
  console.log(`   Mercado principal: Ecuador 🇪🇨\n`);

  // Markdown completo (todos los países)
  const mdCompleto = buildMarkdown({ includeRecursos: true, pais: 'all' });
  const mdCompletoPath = path.join(EXPORT, 'ebook-completo.md');
  fs.writeFileSync(mdCompletoPath, mdCompleto, 'utf8');
  console.log(`✓ Markdown completo: ${mdCompletoPath} (${mdCompleto.split('\n').length} líneas)`);

  // Markdown Ecuador (mercado principal)
  const mdEcuador = buildMarkdown({ includeRecursos: true, pais: 'ecuador' });
  const mdEcuadorPath = path.join(EXPORT, 'ebook-ecuador.md');
  fs.writeFileSync(mdEcuadorPath, mdEcuador, 'utf8');
  console.log(`✓ Markdown Ecuador: ${mdEcuadorPath} (${mdEcuador.split('\n').length} líneas)`);

  // Núcleo sin anexos
  const mdCore = buildMarkdown({ includeRecursos: false });
  const mdCorePath = path.join(EXPORT, 'ebook-nucleo.md');
  fs.writeFileSync(mdCorePath, mdCore, 'utf8');
  console.log(`✓ Núcleo sin anexos: ${mdCorePath}`);

  if (canvaFlag) {
    const count = buildCanvaPages();
    console.log(`✓ Paquete Canva: ${count} capítulos + adaptación Ecuador`);
  }

  if (generatePdfFlag && !htmlOnly) {
    const builds =
      pais === 'ecuador'
        ? [{ md: mdEcuadorPath, pdf: 'InmoSmart-AI-Ebook-Ecuador.pdf' }]
        : [
            { md: mdEcuadorPath, pdf: 'InmoSmart-AI-Ebook-Ecuador.pdf' },
            { md: mdCompletoPath, pdf: 'InmoSmart-AI-Ebook-Completo.pdf' },
          ];

    for (const { md, pdf } of builds) {
      const pdfPath = path.join(EXPORT, pdf);
      console.log(`⏳ Generando ${pdf}...`);
      try {
        await generatePdf(md, pdfPath);
        const stats = fs.statSync(pdfPath);
        console.log(`✓ ${pdf} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      } catch (err) {
        console.error(`✗ Error en ${pdf}:`, err.message);
      }
    }
  }

  console.log('\n✅ Exportación completada.');
}

main().catch(console.error);

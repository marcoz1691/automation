#!/usr/bin/env node
/**
 * InmoSmart AI — Generador de ebook PDF/HTML
 * Uso: node build-ebook.js [--html-only] [--pdf] [--canva]
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

const RECursos_ANEXO = [
  { file: '../recursos/checklists.md', title: 'Anexo A — Checklists' },
  { file: '../recursos/plantillas.md', title: 'Anexo B — Plantillas' },
  { file: '../recursos/prompts-ia.md', title: 'Anexo C — Prompts de IA (110)' },
  { file: '../recursos/mensajes-whatsapp.md', title: 'Anexo D — Mensajes WhatsApp' },
  { file: '../recursos/casos-practicos.md', title: 'Anexo E — Casos prácticos simulados' },
  { file: '../adaptaciones/mexico.md', title: 'Anexo F — Adaptación México' },
];

function readFile(relPath) {
  const full = path.isAbsolute(relPath) ? relPath : path.join(EXPORT, relPath);
  if (!fs.existsSync(full)) return '';
  return fs.readFileSync(full, 'utf8');
}

function stripMetaBlock(content) {
  return content.replace(/^#\s+Capítulo[\s\S]*?---\n\n/m, '').trim();
}

function buildMarkdown(includeAnexos = true) {
  const parts = [];

  parts.push(`---
title: Vende tu Propiedad Más Rápido con Inteligencia Artificial
author: InmoSmart AI
---

`);

  for (const file of MAIN_FILES) {
    const content = readFile(path.join(CONTENIDO, file));
    if (content) {
      parts.push(`\n\n---\n\n`);
      parts.push(stripMetaBlock(content));
    }
  }

  if (includeAnexos) {
    parts.push(`\n\n# Recursos adicionales\n\n`);
    for (const anexo of RECursos_ANEXO) {
      const content = readFile(anexo.file);
      if (content) {
        parts.push(`\n\n---\n\n## ${anexo.title}\n\n`);
        parts.push(content.replace(/^#\s+.+\n\n/m, ''));
      }
    }
  }

  return parts.join('');
}

function buildCanvaPages(md) {
  if (!fs.existsSync(CANVA_DIR)) fs.mkdirSync(CANVA_DIR, { recursive: true });

  const chapters = md.split(/\n---\n/);
  let index = 0;

  for (const file of MAIN_FILES) {
    const content = readFile(path.join(CONTENIDO, file));
    if (!content) continue;
    index++;
    const name = file.replace('.md', '');
    const header = `# Paquete Canva — ${name}

> **Instrucciones:** Crear página A4 (210×297 mm) en Canva. Copiar secciones una por una.
> **Paleta:** Azul #1B3A5C · Dorado #C9A962 · Gris #F4F6F8 · Texto #2D3748
> **Fuentes:** Montserrat Bold (títulos) · Open Sans (cuerpo)

---

`;
    fs.writeFileSync(
      path.join(CANVA_DIR, `${name}-canva.md`),
      header + stripMetaBlock(content),
      'utf8'
    );
  }

  // Recursos resumidos para Canva
  const resumenRecursos = `# Paquete Canva — Recursos premium

Los recursos completos están en /recursos/. Para Canva:
1. Exportar checklists como páginas tipo «lista con iconos»
2. Exportar plantillas como páginas editables duplicables
3. Prompts: usar fuente monospace 9-10 pt en cajas grises (#F4F6F8)

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
  const pdfOnly = args.includes('--pdf') || args.length === 0;
  const canvaOnly = args.includes('--canva');

  console.log('📘 InmoSmart AI — Generador de ebook\n');

  const md = buildMarkdown(true);
  const mdPath = path.join(EXPORT, 'ebook-completo.md');
  fs.writeFileSync(mdPath, md, 'utf8');
  console.log(`✓ Markdown combinado: ${mdPath} (${md.split('\n').length} líneas)`);

  if (canvaOnly || args.length === 0) {
    const count = buildCanvaPages(md);
    console.log(`✓ Paquete Canva: ${count} capítulos en ${CANVA_DIR}`);
  }

  if (pdfOnly && !htmlOnly) {
    const pdfPath = path.join(EXPORT, 'InmoSmart-AI-Ebook-Completo.pdf');
    console.log('⏳ Generando PDF (puede tardar varios minutos)...');
    try {
      await generatePdf(mdPath, pdfPath);
      const stats = fs.statSync(pdfPath);
      console.log(`✓ PDF generado: ${pdfPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (err) {
      console.error('✗ Error generando PDF:', err.message);
      console.log('  Tip: El markdown combinado está disponible para importar manualmente.');
      process.exit(1);
    }
  }

  // Versión sin anexos (más liviana para lectura principal)
  const mdCore = buildMarkdown(false);
  const mdCorePath = path.join(EXPORT, 'ebook-nucleo.md');
  fs.writeFileSync(mdCorePath, mdCore, 'utf8');
  console.log(`✓ Núcleo sin anexos: ${mdCorePath}`);

  console.log('\n✅ Exportación completada.');
}

main().catch(console.error);

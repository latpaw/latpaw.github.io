#!/usr/bin/env node
/**
 * 自动扫描 ai/ 目录下的页面，并将尚未收录的新页面自动追加到根目录 index.html。
 *
 * 扫描规则：
 * 1. 子目录 ai/<dir>/：优先检测 ai/<dir>/index.html（链接 /ai/<dir>/），
 *    其次检测 ai/<dir>/dist/index.html（链接 /ai/<dir>/dist/）。
 * 2. 顶层文件 ai/*.html：自动收录，跳过匹配 IGNORE_PATTERNS 或含 <meta name="index-hide" content="true"> 的页面。
 * 3. 已存在于 index.html 中的链接保持原样不覆盖，方便手动微调文案与图标。
 *
 * 新页面可选自定义元信息（写入该页面 <head> 中）：
 *   <meta name="index-title" content="自定义展示标题">
 *   <meta name="index-desc" content="自定义一句话描述">
 *   <meta name="index-icon" content="🚀">
 *   <meta name="index-tag" content="Interactive">
 *   <meta name="index-hide" content="true">   <!-- 不自动收录到首页 -->
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const AI_DIR = path.join(ROOT_DIR, 'ai');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');
const MARKER = '<!-- AUTO-ENTRIES:END -->';

const IGNORE_FILES = new Set([
  'ai-intercom-wiring.html'
]);

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'assets',
  'media',
  'images',
  'img'
]);

const CHECK_ONLY = process.argv.includes('--check');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodeHtmlEntities(str) {
  return String(str)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMeta(html, name) {
  const re1 = new RegExp(`<meta\\b[^>]*name=["']${name}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
  const re2 = new RegExp(`<meta\\b[^>]*content=["']([^"']*)["'][^>]*name=["']${name}["'][^>]*>`, 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? decodeHtmlEntities(m[1]) : '';
}

function extractTagText(html, tag) {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = html.match(re);
  if (!m) return '';
  return decodeHtmlEntities(m[1].replace(/<[^>]+>/g, ' '));
}

function parsePageMeta(filePath, fallbackName, isDirApp) {
  const html = fs.readFileSync(filePath, 'utf8');
  const hide = extractMeta(html, 'index-hide').toLowerCase();
  if (hide === 'true' || hide === '1' || hide === 'yes') {
    return null;
  }

  let title = extractMeta(html, 'index-title') || extractTagText(html, 'title') || extractTagText(html, 'h1') || fallbackName;
  // 去掉过长的副标题后缀（若含 " · " 且长度超过 28）
  if (title.length > 28 && title.includes(' · ')) {
    title = title.split(' · ')[0].trim();
  }

  let desc =
    extractMeta(html, 'index-desc') ||
    extractMeta(html, 'description') ||
    extractTagText(html, 'p') ||
    `查看 ${title}`;
  if (desc.length > 90) {
    desc = `${desc.slice(0, 88)}…`;
  }

  const icon = extractMeta(html, 'index-icon') || (isDirApp ? '✨' : '📄');
  const tag = extractMeta(html, 'index-tag') || (isDirApp ? 'Interactive' : 'Page');

  return { title, desc, icon, tag };
}

function discoverPages() {
  if (!fs.existsSync(AI_DIR)) return [];
  const entries = fs.readdirSync(AI_DIR, { withFileTypes: true });
  const found = [];

  for (const ent of entries) {
    if (ent.name.startsWith('.')) continue;

    if (ent.isDirectory()) {
      if (IGNORE_DIRS.has(ent.name)) continue;
      const directIndex = path.join(AI_DIR, ent.name, 'index.html');
      const distIndex = path.join(AI_DIR, ent.name, 'dist', 'index.html');
      let targetFile = null;
      let href = null;

      if (fs.existsSync(directIndex)) {
        targetFile = directIndex;
        href = `/ai/${ent.name}/`;
      } else if (fs.existsSync(distIndex)) {
        targetFile = distIndex;
        href = `/ai/${ent.name}/dist/`;
      }

      if (targetFile && href) {
        const meta = parsePageMeta(targetFile, ent.name, true);
        if (meta) found.push({ href, ...meta });
      }
    } else if (ent.isFile() && ent.name.endsWith('.html')) {
      if (IGNORE_FILES.has(ent.name) || ent.name === 'index.html') continue;
      const targetFile = path.join(AI_DIR, ent.name);
      const href = `/ai/${ent.name}`;
      const meta = parsePageMeta(targetFile, ent.name.replace(/\.html$/i, ''), false);
      if (meta) found.push({ href, ...meta });
    }
  }

  return found.sort((a, b) => a.href.localeCompare(b.href));
}

function renderEntryCard({ href, icon, title, tag, desc }) {
  return [
    `      <a class="entry" href="${escapeHtml(href)}">`,
    `        <div class="icon">${escapeHtml(icon)}</div>`,
    `        <div class="body">`,
    `          <div class="title">${escapeHtml(title)}<span class="pill">${escapeHtml(tag)}</span></div>`,
    `          <div class="desc">${escapeHtml(desc)}</div>`,
    `        </div>`,
    `        <div class="arrow">→</div>`,
    `      </a>`
  ].join('\n');
}

function main() {
  if (!fs.existsSync(INDEX_PATH)) {
    console.error('未找到根目录 index.html:', INDEX_PATH);
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');
  if (!indexHtml.includes(MARKER)) {
    console.error(`index.html 缺少自动插入标记 ${MARKER}`);
    process.exit(1);
  }

  const existingHrefs = new Set();
  for (const m of indexHtml.matchAll(/<a\b[^>]*class=["']entry["'][^>]*href=["']([^"']+)["']/gi)) {
    existingHrefs.add(m[1].trim());
  }

  const discovered = discoverPages();
  const missing = discovered.filter((p) => !existingHrefs.has(p.href));

  if (missing.length === 0) {
    console.log(`[auto-index] index.html 已包含全部 ${discovered.length} 个 ai/ 页面，无需更新。`);
    process.exit(0);
  }

  if (CHECK_ONLY) {
    console.log(`[auto-index] 发现 ${missing.length} 个尚未收录到 index.html 的页面：`);
    for (const p of missing) console.log(`  + ${p.href} (${p.title})`);
    process.exit(1);
  }

  const snippet = missing.map(renderEntryCard).join('\n\n') + '\n\n      ' + MARKER;
  const updated = indexHtml.replace(`      ${MARKER}`, snippet);
  fs.writeFileSync(INDEX_PATH, updated, 'utf8');

  console.log(`[auto-index] 已自动新增 ${missing.length} 个页面到 index.html：`);
  for (const p of missing) {
    console.log(`  + ${p.href} — ${p.title}`);
  }
}

main();

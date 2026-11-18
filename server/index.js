import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const DB = path.join(__dirname, 'data.json');
const RESERVED = ['api', 'assets'];

let links = fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB, 'utf8')) : [];
const save = () => fs.writeFileSync(DB, JSON.stringify(links, null, 2));
const view = (l) => ({ id: l.id, slug: l.slug, url: l.url, title: l.title, campaign: l.campaign,
  clicks: l.clicks, unique: l.visitors.length, createdAt: l.createdAt, shortUrl: `${BASE_URL}/${l.slug}` });
const randomSlug = () => crypto.randomBytes(5).toString('base64url').replace(/[-_]/g, 'x').slice(0, 6);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/links', (req, res) => res.json(links.map(view)));

app.post('/api/links', (req, res) => {
  const { url, slug, campaign } = req.body || {};
  let parsed;
  try {
    parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
  } catch {
    return res.status(400).json({ code: 'invalidUrl' });
  }
  if (slug && !/^[\w-]{1,24}$/.test(slug))
    return res.status(400).json({ code: 'invalidSlug' });
  if (slug && (RESERVED.includes(slug) || links.some((l) => l.slug === slug)))
    return res.status(409).json({ code: 'slugTaken' });

  let finalSlug = slug;
  while (!finalSlug || links.some((l) => l.slug === finalSlug)) finalSlug = randomSlug();

  const link = {
    id: crypto.randomUUID(), slug: finalSlug, url: parsed.href,
    title: parsed.hostname + (parsed.pathname.length > 1 ? parsed.pathname : ''),
    campaign: (campaign || '').trim(), clicks: 0, visitors: [], createdAt: new Date().toISOString(),
  };
  links.unshift(link);
  save();
  res.status(201).json(view(link));
});

app.delete('/api/links/:id', (req, res) => {
  const before = links.length;
  links = links.filter((l) => l.id !== req.params.id);
  if (links.length === before) return res.status(404).json({ code: 'notFound' });
  save();
  res.status(204).end();
});

// Раздача собранного клиента (после npm run build в корне проекта)
const dist = path.join(__dirname, '../dist');
if (fs.existsSync(dist)) app.use(express.static(dist));

// Редирект по короткой ссылке + подсчёт кликов
app.get('/:slug', (req, res, next) => {
  const link = links.find((l) => l.slug === req.params.slug);
  if (!link) return next();
  link.clicks += 1;
  const visitor = crypto.createHash('sha256').update(req.ip + (req.get('user-agent') || '')).digest('hex').slice(0, 16);
  if (!link.visitors.includes(visitor)) link.visitors.push(visitor);
  save();
  res.redirect(302, link.url);
});

app.listen(PORT, () => console.log(`API: ${BASE_URL}`));

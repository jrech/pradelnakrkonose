import type { APIRoute } from 'astro';

const site = 'https://www.pradelnakrkonose.cz';
const paths = [
  '/',
  '/sluzby-hotely/',
  '/sluzby-penziony/',
  '/sluzby-chaty/',
  '/sluzby-gastro/',
  '/kontakt/',
  '/o-nas/',
  '/llm-info/',
  '/ochrana-osobnich-udaju/',
];

export const GET: APIRoute = () => {
  const urls = paths.map((path) => `  <url><loc>${site}${path}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

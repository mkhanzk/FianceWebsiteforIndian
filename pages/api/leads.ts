import type { NextApiRequest, NextApiResponse } from 'next';
import { checkRateLimit } from '../../lib/rateLimit';
import fs from 'fs';
import path from 'path';

const LEAD_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

const saveLead = (payload: Record<string, string>) => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'leads.json');
    const existing = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    existing.push({ ...payload, createdAt: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  } catch (error) {
    console.error('Lead save failed', error);
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const allowed = checkRateLimit(ip, LEAD_LIMIT, WINDOW_MS);
  if (!allowed) {
    return res.status(429).json({ message: 'Too many requests. Try again later.' });
  }

  const { name, email, phone } = req.body as { name?: string; email?: string; phone?: string };
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (name.length < 2 || phone.length < 8) {
    return res.status(400).json({ message: 'Invalid input values' });
  }

  saveLead({ name, email, phone });

  return res.status(200).json({ message: 'Lead captured', nextStep: 'Send to CRM or Google Sheets.' });
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { checkRateLimit } from '../../lib/rateLimit';
import fs from 'fs';
import path from 'path';

const LEAD_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
};

const saveLead = (payload: LeadPayload) => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'leads.json');
    const existing = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    existing.push({ ...payload, createdAt: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  } catch (error) {
    console.error('Lead save failed', error);
  }
};

const forwardLead = async (payload: LeadPayload) => {
  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (!webhookUrl) return;

  const webhookSecret = process.env.LEADS_WEBHOOK_SECRET;
  const targetUrl = new URL(webhookUrl);
  if (webhookSecret) {
    targetUrl.searchParams.set('secret', webhookSecret);
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(webhookSecret ? { 'x-webhook-secret': webhookSecret } : {})
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('Lead webhook response', response.status);
    }
  } catch (error) {
    console.error('Lead forward failed', error);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const allowed = checkRateLimit(ip, LEAD_LIMIT, WINDOW_MS);
  if (!allowed) {
    return res.status(429).json({ message: 'Too many requests. Try again later.' });
  }

  const { name, email, phone, pageUrl, referrer } = req.body as {
    name?: string;
    email?: string;
    phone?: string;
    pageUrl?: string;
    referrer?: string;
  };

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (name.length < 2 || phone.length < 8) {
    return res.status(400).json({ message: 'Invalid input values' });
  }

  const payload: LeadPayload = {
    name,
    email,
    phone,
    pageUrl,
    referrer,
    userAgent: req.headers['user-agent'] || ''
  };

  saveLead(payload);
  await forwardLead(payload);

  return res.status(200).json({ message: 'Lead captured', nextStep: 'Send to CRM or Google Sheets.' });
}

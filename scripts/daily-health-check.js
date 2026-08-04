#!/usr/bin/env node

/**
 * Daily Health Check & Report Generator
 * Runs at 8 AM daily to check website status and generate summary report
 * Reports on: page availability, registrations by tier, partnership/sponsorship inquiries
 */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://iipxtvptxjqwjxkayxar.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WEBSITE_URL = 'https://summit.yalinetwork.ng';
const REPORT_EMAIL = process.env.REPORT_EMAIL || 'yalinetworknig@gmail.com';

// Pages to check
const PAGES_TO_CHECK = [
  '/',
  '/about',
  '/schedule',
  '/tracks',
  '/sponsors',
  '/contact',
  '/register',
  '/faq'
];

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Email transporter (using your Gmail or preferred service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Check if a page is accessible
 */
async function checkPageHealth(path) {
  return new Promise((resolve) => {
    const url = new URL(path, WEBSITE_URL).toString();
    https.get(url, { timeout: 5000 }, (res) => {
      resolve({
        path,
        status: res.statusCode,
        healthy: res.statusCode === 200,
        timestamp: new Date().toISOString()
      });
    }).on('error', (err) => {
      resolve({
        path,
        status: 'ERROR',
        healthy: false,
        error: err.message,
        timestamp: new Date().toISOString()
      });
    });
  });
}

/**
 * Get registration statistics by tier
 */
async function getRegistrationStats() {
  const { data, error } = await supabase
    .from('registrations')
    .select('attendee_type, count', { count: 'exact' })
    .group('attendee_type');

  if (error) {
    console.error('Error fetching registrations:', error);
    return null;
  }

  // Count by tier/type
  const stats = {};
  const totalCount = await supabase
    .from('registrations')
    .select('id', { count: 'exact', head: true });

  return {
    byType: data || [],
    total: totalCount?.count || 0,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get recent sponsorship inquiries
 */
async function getSponsorshipInquiries() {
  const today = new Date();
  today.setDate(today.getDate() - 1); // Last 24 hours

  const { data, error, count } = await supabase
    .from('sponsor_inquiries')
    .select('*', { count: 'exact' })
    .gt('created_at', today.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sponsor inquiries:', error);
    return null;
  }

  return {
    inquiries: data || [],
    count: count || 0,
    contactEmail: 'partnership@yalinetwork.ng',
    timestamp: new Date().toISOString()
  };
}

/**
 * Get recent contact submissions
 */
async function getContactSubmissions() {
  const today = new Date();
  today.setDate(today.getDate() - 1); // Last 24 hours

  const { data, error, count } = await supabase
    .from('contact_submissions')
    .select('*', { count: 'exact' })
    .gt('created_at', today.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact submissions:', error);
    return null;
  }

  return {
    submissions: data || [],
    count: count || 0,
    contactEmail: 'summit@yalinetwork.ng',
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate HTML report
 */
function generateHTMLReport(pageHealth, regStats, sponsorInquiries, contactSubmissions) {
  const allHealthy = pageHealth.every(p => p.healthy);
  const healthStatus = allHealthy ? '✓ HEALTHY' : '⚠ ISSUES DETECTED';

  return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #0A1128; color: white; padding: 20px; border-radius: 8px; }
        .section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-left: 4px solid #00D9FF; }
        .healthy { color: #22c55e; }
        .unhealthy { color: #ef4444; }
        .page-list { list-style: none; padding: 0; }
        .page-item { padding: 8px; margin: 5px 0; background: white; border-radius: 4px; }
        .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status-ok { background: #dcfce7; color: #22c55e; }
        .status-error { background: #fee2e2; color: #ef4444; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f0f0f0; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌍 AIDIFILN 2026 - Daily Health Check Report</h1>
        <p>Generated: ${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Africa/Lagos' })} WAT</p>
        <p class="${allHealthy ? 'healthy' : 'unhealthy'}"><strong>Status: ${healthStatus}</strong></p>
    </div>

    <div class="section">
        <h2>📊 Website Pages Status</h2>
        <ul class="page-list">
            ${pageHealth.map(p => `
                <li class="page-item">
                    <strong>${p.path}</strong>
                    <span class="status-badge ${p.healthy ? 'status-ok' : 'status-error'}">
                        ${p.healthy ? '✓ ' + p.status : '✗ ' + (p.error || p.status)}
                    </span>
                </li>
            `).join('')}
        </ul>
    </div>

    <div class="section">
        <h2>📋 Registration Summary</h2>
        <p><strong>Total Registrations:</strong> ${regStats?.total || 0}</p>
        ${regStats?.byType && regStats.byType.length > 0 ? `
            <table>
                <tr><th>Attendee Type</th><th>Count</th></tr>
                ${regStats.byType.map(t => `
                    <tr>
                        <td>${t.attendee_type}</td>
                        <td>${t.count || 0}</td>
                    </tr>
                `).join('')}
            </table>
        ` : '<p>No registration data available</p>'}
    </div>

    <div class="section">
        <h2>🤝 Partnership & Sponsorship Inquiries (Last 24h)</h2>
        <p><strong>New Inquiries:</strong> ${sponsorInquiries?.count || 0}</p>
        <p><strong>Contact Email:</strong> <a href="mailto:${sponsorInquiries?.contactEmail}">${sponsorInquiries?.contactEmail}</a></p>
        ${sponsorInquiries?.inquiries && sponsorInquiries.inquiries.length > 0 ? `
            <table>
                <tr><th>Company</th><th>Contact</th><th>Email</th><th>Preferred Tier</th><th>Budget</th><th>Timeline</th></tr>
                ${sponsorInquiries.inquiries.map(i => `
                    <tr>
                        <td>${i.company_name}</td>
                        <td>${i.contact_name}</td>
                        <td><a href="mailto:${i.email}">${i.email}</a></td>
                        <td>${i.preferred_tier}</td>
                        <td>${i.budget_range}</td>
                        <td>${i.decision_timeline}</td>
                    </tr>
                `).join('')}
            </table>
        ` : '<p>No new sponsorship inquiries in the last 24 hours</p>'}
    </div>

    <div class="section">
        <h2>💬 General Contact Messages (Last 24h)</h2>
        <p><strong>New Messages:</strong> ${contactSubmissions?.count || 0}</p>
        <p><strong>Contact Email:</strong> <a href="mailto:${contactSubmissions?.contactEmail}">${contactSubmissions?.contactEmail}</a></p>
        ${contactSubmissions?.submissions && contactSubmissions.submissions.length > 0 ? `
            <table>
                <tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th></tr>
                ${contactSubmissions.submissions.map(s => `
                    <tr>
                        <td>${s.name}</td>
                        <td><a href="mailto:${s.email}">${s.email}</a></td>
                        <td>${s.subject}</td>
                        <td>${s.message.substring(0, 100)}...</td>
                    </tr>
                `).join('')}
            </table>
        ` : '<p>No new contact messages in the last 24 hours</p>'}
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
        <p>This automated report was generated by the AIDIFILN Daily Health Check system.</p>
        <p>For issues or inquiries, contact: <strong>info@summit.yalinetwork.ng</strong></p>
    </div>
</body>
</html>
  `;
}

/**
 * Send email report
 */
async function sendReport(htmlContent) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: REPORT_EMAIL,
      subject: `[AIDIFILN] Daily Health Check Report - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
      text: 'HTML report attached. Please view in HTML-compatible email client.'
    });
    console.log('✓ Report sent successfully to', REPORT_EMAIL);
  } catch (error) {
    console.error('✗ Error sending email:', error);
  }
}

/**
 * Main function
 */
async function runHealthCheck() {
  console.log('🔍 Starting daily health check...');

  try {
    // Check all pages in parallel
    const pageHealthPromises = PAGES_TO_CHECK.map(checkPageHealth);
    const pageHealth = await Promise.all(pageHealthPromises);

    // Get stats
    const regStats = await getRegistrationStats();
    const sponsorInquiries = await getSponsorshipInquiries();
    const contactSubmissions = await getContactSubmissions();

    // Generate and send report
    const htmlReport = generateHTMLReport(pageHealth, regStats, sponsorInquiries, contactSubmissions);
    await sendReport(htmlReport);

    console.log('✓ Health check completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Health check failed:', error);
    process.exit(1);
  }
}

// Run the health check
runHealthCheck();

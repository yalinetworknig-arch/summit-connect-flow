# AIDIFILN Daily Health Check Setup

This automated daily health check monitors the website and sends you a comprehensive report every morning at 8 AM (Lagos WAT).

## What's Included in the Report

- ✓ **Website Pages Status** - Checks all main pages (Home, About, Schedule, Tracks, Sponsors, Contact, Register, FAQ)
- 📊 **Registration Summary** - Total registrations by attendee type
- 🤝 **Sponsorship Inquiries** - New partnership/sponsorship inquiries from the last 24 hours
- 💬 **Contact Messages** - New general contact messages from the last 24 hours

## Email Addresses Monitored

- **Sponsorships**: partnership@yalinetwork.ng
- **General Inquiries**: summit@yalinetwork.ng

---

## Setup Options

### Option 1: GitHub Actions (Recommended - No server needed)

#### Step 1: Create GitHub Workflow File

Create `.github/workflows/daily-health-check.yml`:

```yaml
name: Daily Health Check

on:
  schedule:
    - cron: '0 7 * * *'  # 7 AM UTC = 8 AM Lagos time (WAT is UTC+1)
  workflow_dispatch:  # Allow manual trigger

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install --save-dev nodemailer
      
      - name: Run health check
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          REPORT_EMAIL: ${{ secrets.REPORT_EMAIL }}
          SMTP_HOST: ${{ secrets.SMTP_HOST }}
          SMTP_PORT: ${{ secrets.SMTP_PORT }}
          SMTP_USER: ${{ secrets.SMTP_USER }}
          SMTP_PASS: ${{ secrets.SMTP_PASS }}
        run: node scripts/daily-health-check.js
```

#### Step 2: Add GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|--------|-------|
| `SUPABASE_URL` | `https://iipxtvptxjqwjxkayxar.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `REPORT_EMAIL` | adikwusamson113@gmail.com |
| `SMTP_HOST` | smtp.gmail.com |
| `SMTP_PORT` | 587 |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASS` | Your Gmail app password |

**Note:** For Gmail, generate an [App Password](https://myaccount.google.com/apppasswords) for more security.

---

### Option 2: Linux/Mac Cron Job

#### Step 1: Install Dependencies

```bash
cd /path/to/summit-connect-flow
npm install --save-dev nodemailer
```

#### Step 2: Create Cron Job

Edit your crontab:
```bash
crontab -e
```

Add this line (runs at 8 AM Lagos time daily):
```bash
0 7 * * * cd /path/to/summit-connect-flow && VITE_SUPABASE_URL=https://iipxtvptxjqwjxkayxar.supabase.co SUPABASE_SERVICE_ROLE_KEY=your_key REPORT_EMAIL=adikwusamson113@gmail.com SMTP_HOST=smtp.gmail.com SMTP_PORT=587 SMTP_USER=your_email@gmail.com SMTP_PASS=your_app_password node scripts/daily-health-check.js >> /var/log/health-check.log 2>&1
```

---

### Option 3: Windows Task Scheduler

#### Step 1: Install Dependencies

```bash
npm install --save-dev nodemailer
```

#### Step 2: Create Batch File

Create `health-check.bat`:
```batch
@echo off
cd C:\path\to\summit-connect-flow

set VITE_SUPABASE_URL=https://iipxtvptxjqwjxkayxar.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=your_key
set REPORT_EMAIL=adikwusamson113@gmail.com
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_USER=your_email@gmail.com
set SMTP_PASS=your_app_password

node scripts/daily-health-check.js
```

#### Step 3: Schedule with Task Scheduler

1. Open **Task Scheduler** (Windows)
2. Create **Basic Task**
3. **Trigger**: Daily at 8:00 AM
4. **Action**: Run batch file created above

---

## Email Configuration

### Using Gmail (Recommended)

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "Less secure app access" OR create an **App Password**:
   - Enable 2-Factor Authentication
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
   - Use this as `SMTP_PASS`

### Using Other Email Providers

Update the SMTP settings in the script or environment:
- **SendGrid**: `SMTP_HOST=smtp.sendgrid.net`, `SMTP_PORT=587`
- **Mailgun**: `SMTP_HOST=smtp.mailgun.org`, `SMTP_PORT=587`
- **AWS SES**: Configure via AWS credentials

---

## Manual Testing

Before scheduling, test the script locally:

```bash
VITE_SUPABASE_URL=https://iipxtvptxjqwjxkayxar.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your_key \
REPORT_EMAIL=adikwusamson113@gmail.com \
SMTP_HOST=smtp.gmail.com \
SMTP_PORT=587 \
SMTP_USER=your_email@gmail.com \
SMTP_PASS=your_app_password \
node scripts/daily-health-check.js
```

---

## Report Details

### Pages Checked
- `/` (Home)
- `/about` (About)
- `/schedule` (Schedule)
- `/tracks` (Tracks)
- `/sponsors` (Sponsors)
- `/contact` (Contact)
- `/register` (Register)
- `/faq` (FAQ)

### Data Queried
- Registration counts by attendee type
- Last 24 hours of sponsorship inquiries
- Last 24 hours of contact submissions

### Report Format
HTML email with styled sections, tables, and clickable email links for follow-up

---

## Troubleshooting

### Report Not Arriving

1. **Check email spam folder** - Gmail might filter automated emails
2. **Verify SMTP credentials** - Test with: `npm install nodemailer && node -e "..."`
3. **Check script logs** - Review GitHub Actions or cron logs
4. **Test manually** - Run the script directly with environment variables

### SMTP Connection Errors

```
Error: connect ECONNREFUSED
```
- Verify `SMTP_HOST` and `SMTP_PORT` are correct
- Check Gmail app password (not account password)
- Ensure firewall isn't blocking SMTP port

### Supabase Connection Errors

```
Error: Invalid API key
```
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Ensure it's the SERVICE ROLE key, not the public key
- Check tables exist: `sponsor_inquiries`, `contact_submissions`, `registrations`

---

## Next Steps

1. Choose your scheduling method (GitHub Actions recommended)
2. Set up environment variables/secrets
3. Test the script manually
4. Deploy the scheduled job
5. Check your email inbox at 8 AM daily for reports

---

## Support

If you need to modify the script:
- Update pages checked in `PAGES_TO_CHECK` array
- Adjust report timezone in the `toLocaleString` call
- Change email recipient in environment variables
- Modify email template in `generateHTMLReport()` function

For questions, contact: **info@summit.yalinetwork.ng**

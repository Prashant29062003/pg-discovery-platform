# Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Database Schema
- [x] Schema updated with new tables (guests, safetyAudits)
- [x] Relations properly defined
- [x] Migrations pushed to Neon PostgreSQL

### ✅ Project Setup
- [x] All dependencies installed
- [x] Environment variables configured locally
- [x] Code tested locally with `bun dev`
- [x] Git repository with clean commit history

---

## 🚀 Deployment Option 1: Vercel (RECOMMENDED)

### Why Vercel?
- ✅ Zero-config Next.js deployment
- ✅ Auto-scaling and CDN globally
- ✅ Free tier available
- ✅ Perfect integration with Neon PostgreSQL
- ✅ Supports Clerk and Cloudinary seamlessly

### Step 1: Prepare GitHub Repository

```bash
# Make sure all changes are committed
cd /d/pg-discovery-platform
git status  # Should show "nothing to commit"
git log     # Verify clean history
```

### Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Select your `pg-discovery-platform` repository**
5. **Configure Project:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `.` (default)
   - Build Command: `bun run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `bun install` (auto-detected)

### Step 3: Add Environment Variables

In Vercel dashboard → Project Settings → Environment Variables, add:

```bash
# Database
DATABASE_URL=postgresql://[YOUR_NEON_CONNECTION_STRING]

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[YOUR_CLERK_PUBLIC_KEY]
CLERK_SECRET_KEY=[YOUR_CLERK_SECRET_KEY]
CLERK_WEBHOOK_SECRET=[YOUR_CLERK_WEBHOOK_SECRET]

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=***REMOVED***
CLOUDINARY_API_KEY=[YOUR_CLOUDINARY_API_KEY]
CLOUDINARY_API_SECRET=[YOUR_CLOUDINARY_API_SECRET]

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Step 4: Deploy

Click **"Deploy"** button - Vercel will:
1. Build your Next.js app
2. Run `bun run build`
3. Deploy to global CDN
4. Provide production URL

### Step 5: Verify Deployment

```bash
# Check deployment status
Visit: https://your-project.vercel.app

# Check logs
In Vercel dashboard → Deployments → view logs
```

---

## 🚀 Deployment Option 2: Railway (Alternative)

### Why Railway?
- ✅ Simpler than Vercel
- ✅ Better pricing at scale
- ✅ Direct Neon integration
- ✅ Same ease of deployment

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

### Step 2: Connect Repository

1. Click "Deploy from GitHub"
2. Select `pg-discovery-platform` repository
3. Railway auto-detects Next.js

### Step 3: Add Environment Variables

Railway → Project → Variables → Add:

```
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_APP_URL
NODE_ENV=production
```

### Step 4: Deploy

Click "Deploy" - Railway handles everything.

---

## 🔐 Security Checklist

### Before Going Live

- [ ] All secrets in `.env.local` (never committed)
- [ ] Verify `.gitignore` includes `.env*`
- [ ] Enable HTTPS (auto on Vercel/Railway)
- [ ] Set Clerk webhook domain to production URL
- [ ] Test Clerk authentication on production
- [ ] Verify Cloudinary works on production
- [ ] Test database connections to Neon
- [ ] Run `npm audit` - fix vulnerabilities
- [ ] Enable authentication for admin routes
- [ ] Test form submissions end-to-end

### Database Security

```bash
# Verify Neon SSL is enabled
# In .env DATABASE_URL should include ?sslmode=require

# Check connection from production
# Vercel will automatically connect to Neon with correct credentials
```

---

## 📊 Monitor Production

### Vercel Dashboard
- Real-time analytics
- Function logs
- Performance metrics
- Error tracking

### Neon Dashboard
- Database performance
- Connection pool status
- Backup status
- Query analytics

### Clerk Dashboard
- User sign-ups
- Authentication logs
- Session management

---

## 🔄 Post-Deployment Tasks

### After Successful Deployment

1. **Test all features:**
   ```bash
   - Browse PGs list
   - Test search functionality
   - Test authentication (sign in/up)
   - Test admin PG creation
   - Test image upload to Cloudinary
   - Submit enquiry form
   ```

2. **Set up monitoring:**
   - Enable Vercel analytics
   - Configure error alerts
   - Set up uptime monitoring

3. **Custom Domain (Optional):**
   - Vercel → Project Settings → Domains
   - Add your custom domain
   - Update DNS records
   - SSL certificate auto-provisioned

4. **Environment-specific URLs:**
   ```bash
   # Update in code if needed:
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   
   # Clerk authentication will use this URL
   # Cloudinary upload will reference this
   ```

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Verify Neon connection
# Check DATABASE_URL in Vercel environment variables
# Format should be: postgresql://user:password@host:port/dbname?sslmode=require

# Test locally first:
bun run db:push
```

### Authentication Not Working

```bash
# Verify in Vercel environment:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set
- CLERK_SECRET_KEY is set
- Clerk domain is set to production URL

# In Clerk dashboard:
- Applications → Settings → URLs → Update with production URL
```

### Images Not Uploading

```bash
# Verify Cloudinary env vars:
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=***REMOVED***
- CLOUDINARY_API_KEY is correct
- CLOUDINARY_API_SECRET is correct

# Test upload endpoint: /api/upload
```

### Database Migrations Not Applied

```bash
# If new migrations aren't applied:
1. Verify DATABASE_URL in .env.production
2. Run: bun run db:push
3. Check Neon dashboard for applied migrations
```

---

## 📈 Performance Optimization

### Already Configured

- ✅ Next.js Image Optimization
- ✅ Cloudinary image compression (5 profiles)
- ✅ Database indexing (city, gender, audit status)
- ✅ Clerk session caching
- ✅ Vercel edge functions support

### Monitor

- Page load times: Vercel Analytics
- Database query performance: Neon dashboard
- API response times: Vercel logs
- Image optimization: Cloudinary dashboard

---

## 🚀 Continuous Deployment

### Auto-Deploy on Push

**Vercel (default):**
- Every push to main → auto-deploys
- Pull requests → preview deployments
- Rollback available for previous versions

**Settings:**
Vercel → Project Settings → Git → Auto-Deploy

---

## 💾 Backup & Recovery

### Database Backups

**Neon handles automatically:**
- Daily backups
- 7-day retention
- Point-in-time recovery available
- Automated backups to prevent data loss

**Manual backup:**
```bash
# Create snapshot in Neon dashboard
# Neon → Project → Branches → Create branch from backup
```

### Application Rollback

**Vercel:**
1. Go to Deployments tab
2. Click previous deployment
3. Click three dots → "Redeploy"

---

## 📞 Support & Monitoring

### Recommended Services (Free Tier)

- **Uptime Monitoring:** [Uptime Robot](https://uptimerobot.com) (free)
- **Error Tracking:** Vercel built-in
- **Log Monitoring:** Vercel logs (free)
- **Analytics:** Vercel Analytics (free)

### Emergency Contacts

- **Vercel Status:** [status.vercel.com](https://status.vercel.com)
- **Neon Status:** Check Neon dashboard
- **Clerk Status:** Check Clerk dashboard

---

## 🎯 Success Metrics

Once deployed, track these metrics:

✅ **Uptime:** >99.9%
✅ **Response Time:** <500ms
✅ **Database Queries:** <100ms average
✅ **Image Load Time:** <2s
✅ **Authentication Success:** >99%
✅ **Zero authentication errors**
✅ **All forms submitting successfully**

---

## 📝 New Tables Added to Schema

### `guests` table
```sql
- id (primary key)
- bedId (foreign key → beds)
- name
- phone
- email
- checkInDate
- checkOutDate
- isActive
- createdAt
- updatedAt
- Indexes: bed_id, is_active
```

### `safetyAudits` table
```sql
- id (primary key)
- pgId (foreign key → pgs)
- auditDate
- status (PASSED, FAILED, PENDING)
- notes
- auditor
- issues (array)
- resolvedAt
- createdAt
- updatedAt
- Indexes: pg_id, status, audit_date
```

---

## ✅ Final Checklist Before Going Live

- [ ] All environment variables set in Vercel
- [ ] Database migrations applied to Neon
- [ ] Authentication tested on production URL
- [ ] Image uploads working (Cloudinary)
- [ ] All forms submitting successfully
- [ ] Admin routes protected
- [ ] Error pages customized
- [ ] Analytics enabled
- [ ] Backup plan documented
- [ ] Team members have access to Vercel/Neon dashboards

---

**Last Updated:** January 27, 2026
**Status:** Ready for Production ✅

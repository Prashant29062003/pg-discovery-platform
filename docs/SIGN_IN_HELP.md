# Sign-In Troubleshooting Guide

## Error: "Couldn't find your account"

If you're getting a **422 error** and seeing "Couldn't find your account", follow these steps:

### Step 1: Verify Account Exists in Clerk
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click **Users** in the sidebar
3. Look for your email address in the list
4. If not there → **Create a new user** in Clerk Dashboard directly:
   - Click **+ Create User**
   - Enter email and password
   - Click Create

### Step 2: Verify Email is Correct
- Make sure you're using the EXACT same email you signed up with
- Check for typos (spaces, extra characters, different case)
- Emails are case-insensitive, but must match

### Step 3: Verify Password
- Passwords are case-sensitive
- Make sure Caps Lock is not on
- Try resetting password first:
  1. Go to `/sign-in` 
  2. Click "Forgot password?"
  3. Enter email and reset your password
  4. Try signing in again with the new password

### Step 4: Set Your Role (For Owner)
After successful sign-in:

**Option A: Use Bootstrap Page (Recommended)**
1. Go to `/admin/bootstrap`
2. Sign up at `/sign-up?role=owner&bootstrap=true`
3. Verify your email
4. Copy your Clerk User ID from Dashboard
5. Paste it and click "Set as Owner"

**Option B: Clerk Dashboard (Manual)**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Users
2. Find your user
3. Scroll to "User Metadata" section
4. In **Public Metadata**, add:
```json
{
  "role": "owner"
}
```
5. Click Save

### Step 5: Try Sign-In Again
1. Go to `/sign-in`
2. Enter your email
3. Enter your password
4. If owner (role set), you'll be redirected to `/admin`
5. If visitor, you'll be redirected to `/pgs`

## Common Issues

| Issue | Solution |
|-------|----------|
| "Couldn't find your account" | Check email spelling, create user in Clerk Dashboard |
| Sign-in succeeds but wrong redirect | Check your role in Clerk metadata (Public Metadata) |
| Can't create owner account | Use `/sign-up?role=owner&bootstrap=true` or set role manually |
| Forgot password | Use "Forgot password?" link, reset, and try again |
| Email verification failed | Check spam folder, check email in Clerk Dashboard |

## Quick Links

- **Sign In:** http://localhost:3000/sign-in
- **Create Owner Account:** http://localhost:3000/sign-up?role=owner&bootstrap=true
- **Bootstrap Setup:** http://localhost:3000/admin/bootstrap
- **Clerk Dashboard:** https://dashboard.clerk.com
- **Manage Users:** http://localhost:3000/admin/users (after sign-in as owner)

## Still Having Issues?

Check browser console (F12 → Console tab) for detailed error messages and share the error with the development team.

# 🚀 Setting Up Gemini AI for Misa Misa

## Get Your FREE Google Gemini API Key

Follow these simple steps to get Misa Misa powered by real AI:

### Step 1: Go to Google AI Studio
Visit: **https://makersuite.google.com/app/apikey**

### Step 2: Sign In
- Use your Google account (Gmail)
- If you don't have one, create a free Google account

### Step 3: Create API Key
1. Click **"Create API Key"** button
2. Choose **"Create API key in new project"** (recommended)
3. Wait a few seconds for the key to be generated
4. **Copy the API key** (it looks like: `AIzaSyC...`)

### Step 4: Add to Environment File
1. Open the `.env.local` file in your project
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key
3. Save the file

**Example:**
```bash
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
```

### Step 5: Restart the Server
```bash
npm run dev
```

## 🎉 That's It!

Misa Misa is now powered by Google's Gemini AI and will have much more engaging, intelligent conversations!

## 💡 Important Notes

- **100% FREE**: Gemini has a generous free tier
- **No Credit Card Required**: Just a Google account
- **Rate Limits**: 60 requests per minute (more than enough for personal use)
- **Fallback**: If API fails, Misa will use built-in responses

## 🔒 Security

- Keep your API key private
- Never commit the `.env.local` file to public repositories
- The key is only used client-side for this demo

---

### Troubleshooting

**Q: Misa isn't responding with AI?**
A: Check that your API key is correctly set in `.env.local` and restart the server

**Q: Getting API errors?**
A: Make sure your API key is valid and you haven't exceeded rate limits

**Q: Can't access Google AI Studio?**
A: Try using a VPN or different browser. Some regions might have restrictions.

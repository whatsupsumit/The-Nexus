# Selenium Tests Aur GitHub Actions - Setup Guide

Hinglish mein complete guide hai Selenium tests aur GitHub Actions ko setup karne ke liye.

---

## 📦 Kya Install Kiya Gaya Hai?

Humne yeh packages install kiye hain:
- **selenium-webdriver** - Browser ko control karne ke liye
- **chromedriver** - Chrome browser ke saath kaam karne ke liye
- **mocha** - Test framework (tests run karne ke liye)

```bash
npm install --save-dev selenium-webdriver chromedriver mocha
```

---

## 📁 Project Structure

```
the-nexus/
├── tests/                          # Saare test files yahan hain
│   ├── login.test.js              # Login page ke tests
│   └── neuralchat.test.js         # Neural Chat/Gemini AI ke tests
│
├── .github/                        # GitHub Actions workflows
│   └── workflows/
│       ├── test.yml               # Selenium tests run karne ke liye
│       └── build.yml              # Build verification ke liye
│
├── package.json                    # npm scripts update ki gayi hain
├── TMDB_API_GUIDE.md              # API Key vs Access Token guide
└── TESTING_GUIDE.md               # Yeh file (testing guide)
```

---

## 🧪 Tests Kaise Run Karein?

### Local Machine Par Run Karo

#### Pehle - Dev Server Start Karo
Tests run karne se pehle React app ko start karna zaroori hai:

```bash
# Terminal 1 mein
npm start
```

App `http://localhost:3001` par open hoga.

#### Phir - Tests Run Karo

```bash
# Terminal 2 mein (dusre terminal mein)
npm test
```

Yeh command **saare tests** run karega (login aur neural chat dono).

#### Watch Mode Mein Run Karo (Optional)

```bash
npm run test:watch
```

Watch mode mein tests automatically re-run honge jab bhi code change hoga.

---

## 📝 Tests Kya Check Karte Hain?

### 1. Login Tests (`tests/login.test.js`)

✅ **Test 1:** Login page load ho raha hai ya nahi
- Browser URL check karta hai
- Page title verify karta hai

✅ **Test 2:** Login form ke saare elements visible hain
- Email input field dhoondta hai
- Password input field dhoondta hai
- Sign In button dhoondta hai

✅ **Test 3:** Empty form submit par validation error aata hai
- Bina email/password ke submit karte hain
- Browser ki validation message check karte hain

✅ **Test 4:** Sign Up tab par switch ho sakta hai (optional)
- Sign Up button dhoondta hai
- Click karke form change check karta hai
- Confirm password field verify karta hai

### 2. Neural Chat Tests (`tests/neuralchat.test.js`)

✅ **Test 1:** Neural Chat page load hota hai
- URL check karta hai (`/neural-chat`)
- Page successfully open ho raha hai verify karta hai

✅ **Test 2:** Message input aur send button milte hain
- Input box (textarea/input field) dhoondta hai
- Send button dhoondta hai
- Dono visible hain verify karta hai

✅ **Test 3:** AI response milta hai (Main Test!)
- Test message type karta hai: "Suggest me an action movie"
- Send button par click karta hai
- **30 seconds wait** karta hai AI response ke liye
- Response mein movie-related content check karta hai
- Pass hoga agar AI ne proper response diya

✅ **Test 4:** Quick prompt buttons check (optional)
- Quick suggestion buttons dhoondta hai
- Agar available hain to unki details print karta hai

---

## ⚙️ GitHub Actions Kaise Kaam Karta Hai?

### Setup Instructions (Ek Baar Karna Hai)

#### Step 1: GitHub Secrets Add Karo

GitHub Actions ko API keys chahiye. Yeh steps follow karo:

1. **GitHub repository par jao** (browser mein)
2. **Settings** tab par click karo
3. **Secrets and variables** → **Actions** par jao
4. **New repository secret** par click karo

Yeh **3 secrets** add karo:

| Secret Name | Value | Kahan Se Milega? |
|-------------|-------|------------------|
| `GEMINI_API_KEY` | Tumhara Gemini API key | Google AI Studio |
| `TMDB_API_KEY` | Tumhara TMDB API key | TMDB website Settings |
| `TMDB_ACCESS_TOKEN` | Tumhara TMDB access token | TMDB website Settings |

#### Step 2: Push Code To GitHub

```bash
git add .
git commit -m "Added Selenium tests aur GitHub Actions"
git push origin main
```

Jaise hi push hoga, GitHub Actions **automatically** run ho jayega!

---

## 🚀 GitHub Actions Workflows

Humne **2 workflows** banaye hain:

### 1. Test Workflow (`.github/workflows/test.yml`)

**Kab Run Hota Hai?**
- Har push par `main` ya `master` branch mein
- Har pull request par

**Kya Karta Hai?**
1. Code checkout karta hai (download)
2. Node.js install karta hai (v18)
3. Dependencies install karta hai (`npm ci`)
4. Chrome browser install karta hai
5. React app background mein start karta hai
6. Selenium tests run karta hai
7. Agar test fail ho to screenshots upload karta hai

**Kaise Dekhen Results?**
- GitHub repository → **Actions** tab
- Latest workflow run par click karo
- Test results aur logs dekh sakte ho

### 2. Build Workflow (`.github/workflows/build.yml`)

**Kab Run Hota Hai?**
- Har push par
- Har pull request par

**Kya Karta Hai?**
1. Code checkout karta hai
2. Dependencies install karta hai
3. Production build banata hai (`npm run build`)
4. Build size check karta hai
5. Build folder upload karta hai (artifact ke roop mein)
6. Success/failure message print karta hai

**Kyun Zaroori Hai?**
- Production build verify karta hai ki koi error to nahi
- Vercel par deployment se pehle confirm karta hai sab theek hai

---

## 🐛 Troubleshooting (Problems Ka Solution)

### Problem 1: Tests Fail Ho Rahe Hain - "Element not found"

**Solution:**
- Check karo ki `npm start` se dev server chal raha hai
- URL verify karo: `http://localhost:3001`
- Port change karo agar 3001 busy hai

### Problem 2: AI Response Test Fail - Timeout Error

**Solution:**
- Gemini API key check karo `.env` file mein
- Internet connection stable hai verify karo
- Timeout badha do `neuralchat.test.js` mein:
  ```javascript
  this.timeout(90000); // 90 seconds
  ```

### Problem 3: GitHub Actions Fail - Missing Secrets

**Solution:**
- GitHub Secrets properly set kiye hain check karo
- Secret names **exact same** hone chahiye:
  - `GEMINI_API_KEY`
  - `TMDB_API_KEY`
  - `TMDB_ACCESS_TOKEN`

### Problem 4: Chrome Driver Version Mismatch

**Solution:**
```bash
npm install chromedriver@latest --save-dev
```

### Problem 5: Tests Pass Locally But Fail On GitHub Actions

**Solution:**
- GitHub Actions mein Chrome version alag ho sakta hai
- Headless mode mein UI elements differently render ho sakte hain
- Wait times badha do:
  ```javascript
  await driver.wait(until.elementLocated(...), 20000); // 20 seconds
  ```

---

## 📊 Test Results Kaise Samjhen?

### Successful Test Run
```
✓ Login page successfully load ho gaya
✓ Email input field mil gaya
✓ Password input field mil gaya
✓ Sign In button mil gaya
✓ Empty form par validation error aa gaya
✓ Neural Chat page successfully load ho gaya
✓ Message input box mil gaya
✓ Send button mil gaya
✓ Test message type ho gaya
✓ Send button par click ho gaya
✓ AI response mil gaya!
✓ Test pass ho gaya - AI ne proper response diya

6 passing (45s)
```

### Failed Test Run
```
1) Login Page Tests
   Login page load hona chahiye:
     Error: Email input field nahi mila
     Timeout of 10000ms exceeded
```

**Iska Matlab:** Test fail ho gaya kyunki element expected time mein nahi mila.

---

## 🎯 Next Steps

### Local Testing
1. `npm start` se app run karo
2. `npm test` se tests run karo
3. Console output dekho - pass/fail status

### GitHub Actions
1. Code push karo GitHub par
2. Actions tab mein jao
3. Workflow run status dekho
4. Green checkmark (✓) = Success
5. Red X (✗) = Failure

### Vercel Deployment
- GitHub Actions sirf **testing aur build verification** ke liye hai
- Actual deployment **Vercel** automatically karega
- Vercel dashboard mein deployment status dekh sakte ho

---

## 📚 Additional Resources

- **Selenium Docs:** https://www.selenium.dev/documentation/
- **Mocha Docs:** https://mochajs.org/
- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **TMDB API Guide:** Dekho `TMDB_API_GUIDE.md`

---

## ✅ Checklist

Setup complete hai ya nahi check karo:

- [ ] Selenium packages install ho gaye (`npm test` run hota hai)
- [ ] Login test locally pass ho raha hai
- [ ] Neural Chat test locally pass ho raha hai
- [ ] GitHub Secrets add kar diye (3 secrets)
- [ ] Code GitHub par push ho gaya
- [ ] GitHub Actions workflows run ho rahe hain
- [ ] Actions tab mein green checkmarks dikh rahe hain
- [ ] Vercel deployment working hai

---

**🎉 Congratulations!** Tumne successfully Selenium tests aur GitHub Actions setup kar liye!

Koi problem aaye to comments mein puccho ya documentation padho.

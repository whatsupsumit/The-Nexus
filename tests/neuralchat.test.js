// Selenium WebDriver ko import karte hain - yeh browser ko control karta hai
const { Builder, By, until, Key } = require('selenium-webdriver');
// Chrome browser ke liye driver import kar rahe hain
require('chromedriver');
// Mocha testing framework ke assert function ko import karte hain - yeh test pass/fail check karta hai
const assert = require('assert');
// Mocha ke test functions ko import karte hain
const { describe, it, before, after } = require('mocha');

// Test suite ka naam - "Neural Chat / Gemini AI Tests"
describe('Neural Chat / Gemini AI Tests', function() {
    // Timeout 60 seconds set kar rahe hain kyunki AI responses slow hote hain
    this.timeout(60000);
    
    // 'driver' variable mein browser instance store karenge
    let driver;
    
    // Har test se pehle yeh function run hoga - browser ko start karega
    before(async function() {
        // Chrome browser ko headless mode mein start karte hain (bina window dikhaaye)
        // Agar browser window dekhna hai to '--headless' hata do
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(
                require('selenium-webdriver/chrome')
                    .Options()
                    .addArguments('--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage')
            )
            .build();
    });
    
    // Har test ke baad yeh function run hoga - browser ko band karega
    after(async function() {
        // Driver ko quit karte hain (browser band karna)
        if (driver) {
            await driver.quit();
        }
    });
    
    // Test 1: Check karo ki Neural Chat page load ho raha hai
    it('Neural Chat page load hona chahiye', async function() {
        // Neural Chat page par jao
        await driver.get('http://localhost:3001/neural-chat');
        
        // Page ka URL check karo ki sahi hai ya nahi
        const currentUrl = await driver.getCurrentUrl();
        assert.ok(
            currentUrl.includes('/neural-chat'),
            'Neural Chat page nahi khula, URL sahi nahi hai'
        );
        console.log('✓ Neural Chat page successfully load ho gaya');
    });
    
    // Test 2: Message input box aur send button check karo
    it('Message input box aur send button visible hone chahiye', async function() {
        // Neural Chat page par jao
        await driver.get('http://localhost:3001/neural-chat');
        
        // Input box ko dhundo - textarea, input, ya contentEditable div ho sakta hai
        // 15 seconds tak wait karo page load hone ke liye
        let inputElement;
        try {
            // Pehle textarea ya input field dhoondo
            inputElement = await driver.wait(
                until.elementLocated(By.css('textarea, input[type="text"], input[placeholder*="message"], input[placeholder*="Message"]')),
                15000,
                'Message input box nahi mila'
            );
        } catch (error) {
            // Agar nahi mila to contentEditable div dhoondo
            inputElement = await driver.wait(
                until.elementLocated(By.css('div[contenteditable="true"]')),
                5000,
                'Message input box (textarea ya contentEditable) nahi mila'
            );
        }
        
        // Check karo ki input visible hai
        const inputVisible = await inputElement.isDisplayed();
        assert.strictEqual(inputVisible, true, 'Input box visible nahi hai');
        console.log('✓ Message input box mil gaya');
        
        // Send button ko dhundo - button jisme "Send" text ho ya send icon ho
        const sendButton = await driver.wait(
            until.elementLocated(By.css('button[type="submit"], button:has(svg), button')),
            10000,
            'Send button nahi mila'
        );
        
        // Check karo ki button visible hai
        const buttonVisible = await sendButton.isDisplayed();
        assert.strictEqual(buttonVisible, true, 'Send button visible nahi hai');
        console.log('✓ Send button mil gaya');
    });
    
    // Test 3: Message bhejne par Gemini AI ka response aana chahiye
    it('Message bhejne par AI response milna chahiye', async function() {
        // Neural Chat page par jao
        await driver.get('http://localhost:3001/neural-chat');
        
        // Input box ko wait karo aur dhundo
        const inputElement = await driver.wait(
            until.elementLocated(By.css('textarea, input[type="text"], div[contenteditable="true"]')),
            15000
        );
        
        // Input box mein message type karo - simple movie recommendation request
        const testMessage = 'Suggest me an action movie';
        await inputElement.clear(); // Pehle input ko clear karo
        await inputElement.sendKeys(testMessage); // Message type karo
        console.log('✓ Test message type ho gaya:', testMessage);
        
        // Thoda wait karo (1 second) message type hone ke baad
        await driver.sleep(1000);
        
        // Send button ko dhundo aur click karo
        // Sabse last wala button dhundo jo visible ho (usually send button hai)
        const buttons = await driver.findElements(By.css('button'));
        let sendButton = null;
        
        // Saare buttons mein se visible button dhundo
        for (let btn of buttons) {
            const isVisible = await btn.isDisplayed();
            if (isVisible) {
                sendButton = btn;
            }
        }
        
        // Agar button mila to click karo
        if (sendButton) {
            await sendButton.click();
            console.log('✓ Send button par click ho gaya');
        } else {
            // Agar button nahi mila to Enter key press karo
            await inputElement.sendKeys(Key.RETURN);
            console.log('✓ Enter key press karke message bheja');
        }
        
        // AI response ka wait karo - 30 seconds max
        // Response message ko dhundo jo "action" ya "movie" word contain kare
        console.log('⏳ AI response ka wait kar rahe hain (30 seconds max)...');
        
        try {
            // Wait karo ki response element appear ho jaye
            // Response usually div, p, ya span mein aata hai jo message container mein hota hai
            await driver.wait(async () => {
                // Saare text elements dhundo jo visible hain
                const elements = await driver.findElements(By.css('div, p, span'));
                
                // Har element check karo ki usme response text hai ya nahi
                for (let elem of elements) {
                    try {
                        const text = await elem.getText();
                        const isVisible = await elem.isDisplayed();
                        
                        // Agar element visible hai aur usme movie related text hai
                        if (isVisible && text && text.length > 50) {
                            // Check karo ki text mein movie recommendation words hain
                            const lowerText = text.toLowerCase();
                            if (lowerText.includes('movie') || 
                                lowerText.includes('action') || 
                                lowerText.includes('film') ||
                                lowerText.includes('recommend')) {
                                console.log('✓ AI response mil gaya!');
                                return true;
                            }
                        }
                    } catch (e) {
                        // Agar kisi element ko read nahi kar sake to skip karo
                        continue;
                    }
                }
                return false;
            }, 30000, 'AI response 30 seconds mein nahi aaya');
            
            console.log('✓ Test pass ho gaya - AI ne proper response diya');
            
        } catch (error) {
            // Agar response nahi mila to bhi page ka screenshot le lo debug ke liye
            console.log('⚠️ AI response expected time mein nahi aaya');
            
            // Page ka poora text print karo debugging ke liye
            const bodyText = await driver.findElement(By.css('body')).getText();
            console.log('Page content:', bodyText.substring(0, 500)); // First 500 chars
            
            // Test fail kar do with proper message
            assert.fail('AI response 30 seconds mein nahi aaya. Ho sakta hai API key invalid ho ya network issue ho.');
        }
    });
    
    // Test 4: Quick prompt buttons check karo (agar hain to)
    it('Quick prompt buttons check karna (agar available hain)', async function() {
        // Neural Chat page par jao
        await driver.get('http://localhost:3001/neural-chat');
        
        try {
            // Quick prompt buttons ko dhundo - usually yeh suggestion chips hote hain
            const quickPrompts = await driver.findElements(
                By.css('button:not([type="submit"]), .quick-prompt, .suggestion-chip')
            );
            
            // Agar quick prompts mil gaye
            if (quickPrompts.length > 0) {
                console.log(`✓ ${quickPrompts.length} quick prompt buttons mile`);
                
                // Pehle quick prompt par click karo (agar visible hai)
                for (let prompt of quickPrompts) {
                    const isVisible = await prompt.isDisplayed();
                    if (isVisible) {
                        const text = await prompt.getText();
                        if (text && text.length > 5) {
                            console.log(`ℹ Quick prompt mila: "${text}"`);
                            break;
                        }
                    }
                }
            } else {
                console.log('ℹ Quick prompt buttons nahi mile (optional feature)');
            }
        } catch (error) {
            console.log('ℹ Quick prompts check nahi kar paye:', error.message);
            // Yeh test fail nahi karenge kyunki optional feature hai
        }
    });
});

// Voice Assistant implementation - User ke voice commands ko recognize karne ke liye
// Web Speech API use karta hai jo browser mein built-in hai
// Neural Chat mein voice input ke liye use hota hai

export class VoiceAssistant {
  constructor() {
    // Voice recognition object (null se start, bad mein initialize hoga)
    this.recognition = null;
    // Text-to-speech ke liye browser ka speech synthesis API
    this.synthesis = window.speechSynthesis;
    // Flag to track agar voice listening active hai ya nahi
    this.isListening = false;
    // Callback function jab voice input milta hai
    this.onResult = null;
    // Speech recognition setup karte hain
    this.setupSpeechRecognition();
  }

  setupSpeechRecognition() {
    // Check karte hain ki browser speech recognition support karta hai ya nahi
    if ('webkitSpeechRecognition' in window) {
      // Speech recognition object create karte hain
      this.recognition = new window.webkitSpeechRecognition();
      // continuous = false means ek baar bolne ke baad stop ho jayega
      this.recognition.continuous = false;
      // interimResults = false means sirf final result chahiye, beech ke nahi
      this.recognition.interimResults = false;
      // Language English (US) set kar rahe hain
      this.recognition.lang = 'en-US';

      // Jab voice input recognize ho jaye to yeh function call hoga
      this.recognition.onresult = (event) => {
        // User ne jo bola uska text extract karte hain
        const transcript = event.results[0][0].transcript;
        // Agar callback function set hai to usko call karte hain recognized text ke saath
        if (this.onResult) {
          this.onResult(transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  // Voice listening start karne ka function
  // callback = jab text recognize ho jaye to kya karna hai
  startListening(callback) {
    // Agar recognition supported nahi hai to error dikha do
    if (!this.recognition) {
      console.error('Speech recognition not supported');
      return;
    }

    // Callback function save karte hain result ke liye
    this.onResult = callback;
    // Listening flag true kar dete hain
    this.isListening = true;
    // Voice recognition start kar dete hain
    this.recognition.start();
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
  }

  // Text ko voice mein convert karke bol dena (text-to-speech)
  // AI response ko user ko voice mein sunane ke liye use hota hai
  speak(text) {
    // Agar text-to-speech supported nahi hai to error
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Agar koi pehle se bol raha hai to usko cancel kar do
    this.synthesis.cancel();

    // Speech utterance create karte hain (yeh text bolega)
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // English language
    utterance.rate = 1.0; // Normal speed (1.0 = normal, 2.0 = fast, 0.5 = slow)
    utterance.pitch = 1.0; // Normal pitch (voice ki height)
    
    // Text ko bol do
    this.synthesis.speak(utterance);
  }
}
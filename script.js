
const statusText = document.getElementById("status");
const output = document.getElementById("output");
const micButton = document.getElementById("micButton");
const circle = document.getElementById("circle");

function speak(message) {
  output.textContent = message;
  speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(message);
  speech.lang = "en-IN";
  speech.rate = 1;
  speechSynthesis.speak(speech);
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    statusText.textContent = "LISTENING...";
    micButton.textContent = "🎙 LISTENING...";
    circle.classList.add("listening");
  };

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    output.textContent = "You said: " + command;
    runCommand(command);
  };

  recognition.onend = () => {
    statusText.textContent = "SYSTEM ONLINE";
    micButton.textContent = "🎙 START LISTENING";
    circle.classList.remove("listening");
  };

  recognition.onerror = (event) => {
    output.textContent = "Microphone error: " + event.error;
  };

} else {
  micButton.disabled = true;
  output.textContent = "Speech recognition is not supported in this browser.";
}

micButton.addEventListener("click", () => {
  if (recognition) {
    recognition.start();
  }
});

function runCommand(command) {

  if (command.includes("hello") || command.includes("jarvis")) {
    speak("Hello! I am JARVIS. Ready to assist you.");
  }

  else if (command.includes("time")) {
    tellTime();
  }

  else if (command.includes("battery")) {
    checkBattery();
  }

  else if (command.includes("youtube")) {
    speak("Opening YouTube");
    openYouTube();
  }

  else if (command.includes("google")) {
    speak("Opening Google");
    window.open("https://www.google.com", "_blank");
  }

  else if (command.includes("search")) {
    const search = command.replace("search", "").trim();
    if (search) {
      speak("Searching Google for " + search);
      window.open(
        "https://www.google.com/search?q=" +
        encodeURIComponent(search), "_blank"
      );
    }
  }

  else {
    speak("Sorry, I don't understand that command yet.");
  }
}

function tellTime() {
  const time = new Date().toLocaleTimeString("en-IN");
  speak("The current time is " + time);
}

async function checkBattery() {
  if (!navigator.getBattery) {
    speak("Battery information is not supported.");
    return;
  }

  try {
    const battery = await navigator.getBattery();
    speak("Your battery is " +
      Math.round(battery.level * 100) + " percent.");
  } catch {
    speak("I cannot access battery information.");
  }
}

function openYouTube() {
  window.open("https://www.youtube.com", "_blank");
}

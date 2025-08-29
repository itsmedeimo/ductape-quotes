async function loadConfig() {
  const response = await fetch("data/config.yaml");
  const text = await response.text();
  return jsyaml.load(text);
}

async function loadQuotes() {
  const response = await fetch("data/quotes.yaml");
  const text = await response.text();
  return jsyaml.load(text);
}

function pickRandomQuote(quotes) {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

async function init() {
  try {
    const config = await loadConfig();
    const quotes = await loadQuotes();

    // Apply config
    document.title = config.siteTitle;
    document.getElementById("site-title").textContent = config.siteTitle;
    document.getElementById("site-description").textContent = config.siteDescription;
    document.getElementById("footer").textContent = config.footer;

    // Show random quote or fallback
    if (quotes && quotes.length > 0) {
      const quote = pickRandomQuote(quotes);
      document.getElementById("quote").textContent = `"${quote.quote}"`;
      document.getElementById("author").textContent = `– ${quote.author}`;
    } else {
      document.getElementById("quote").textContent = "No quotes available.";
      document.getElementById("author").textContent = "";
    }
  } catch (err) {
    console.error("Error loading site:", err);
    document.getElementById("quote").textContent = "No quotes available.";
    document.getElementById("author").textContent = "";
  }
}

init();

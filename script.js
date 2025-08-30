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

function getQuoteIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.has("quote") ? parseInt(params.get("quote"), 10) : null;
}

function pickRandomQuote(quotes, excludeId = null) {
  let newId;
  do {
    newId = Math.floor(Math.random() * quotes.length);
  } while (excludeId !== null && quotes.length > 1 && newId === excludeId);
  return newId;
}

function updateURL(id) {
  const newURL = `${window.location.pathname}?quote=${id}`;
  history.replaceState(null, "", newURL);
}

function displayQuote(quotes, id) {
  if (id < 0 || id >= quotes.length) {
    document.getElementById("quote").textContent = "No quotes available.";
    document.getElementById("author").textContent = "";
    return;
  }

  const quote = quotes[id];
  document.getElementById("quote").textContent = `"${quote.quote}"`;
  document.getElementById("author").textContent = `– ${quote.author}`;
  updateURL(id);

  // 🎲 New quote dynamically
  document.getElementById("new-quote-btn").onclick = () => {
    const newId = pickRandomQuote(quotes, id);
    displayQuote(quotes, newId);
  };

  // 📋 Share (copies URL with ?quote=id)
  const shareBtn = document.getElementById("share-btn");
  shareBtn.onclick = () => {
    const shareURL = window.location.href;
    navigator.clipboard.writeText(shareURL).then(() => {
      shareBtn.textContent = "✅";
      setTimeout(() => (shareBtn.textContent = "📋"), 1500);
    });
  };
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

    if (quotes && quotes.length > 0) {
      let id;

      // 👇 Only use ?quote=ID if user navigated via link, not just a refresh
      const navType = performance.getEntriesByType("navigation")[0]?.type;
      if (navType === "navigate") {
        id = getQuoteIdFromURL();
      }

      if (id === null || isNaN(id) || id < 0 || id >= quotes.length) {
        id = pickRandomQuote(quotes);
      }

      displayQuote(quotes, id);
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

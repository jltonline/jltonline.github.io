function selectedLanguage() {
  let lang = "en";
  if (navigator.language.startsWith('de')) { lang = "de" };
  const saved_language = window.localStorage.getItem('lang');
  console.log('Saved language is', lang)
  if (saved_language != null) {
    lang = saved_language;
  }
  const params = new URLSearchParams(window.location.search);
  if (params.get("lang") === "de") {
    lang = "de";
  }
  console.log('Determined language', lang)
  return lang;
}

function normalizeLanguage() {
  const lang = selectedLanguage();
  document.documentElement.lang = lang;
  window.localStorage.setItem('lang', lang)
  console.log('Saved language', lang)
}

function switchLanguage(lang) {
  const params = new URLSearchParams(window.location.search);
  params.set('lang', lang)
  const newURL = new URL(window.location);
  newURL.search = params;
  window.history.pushState(undefined, undefined, newURL.toString());
  document.documentElement.lang = lang;
  localStorage.setItem('lang', lang);
  console.log('Saved language', lang)
}



/** Converts the given HTML text to a node tree */
function textToHtml(text) {
  if (!!window.DOMParser) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html')
      return doc.getRootNode();
    } catch (error) {
      console.error('Error parsing html', error);
    }
  }
  const container = document.createElement('div');
  container.innerHTML = text;
  return container;
}

/** Moves all children from the sourceURL’s body node to the current document */
function fetchFrame(sourceURL) {
  const framePromise = fetch(sourceURL).then(response => response.text());
  
  async function insertFrame() {
    const frameDoc = textToHtml(await framePromise);
    const frameBody = frameDoc.getElementsByTagName('body')[0];
    const ourBody = document.getElementsByTagName('body')[0];
    ourBody.append(...frameBody.children);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insertFrame)
  } else {
    insertFrame();
  }
}

normalizeLanguage();
fetchFrame('/frame.html');

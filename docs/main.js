const characterInputEl = document.getElementById("character-input");
const whitespaceExclude = document.getElementById("whitespace-checkbox");
const characterCountEl = document.getElementsByClassName("character-count")[0];
const wordsCountEl = document.getElementsByClassName("words-count")[0];
const sentencesCountEl = document.getElementsByClassName("sentences-count")[0];
const readingTimeEl = document.getElementById("reading-time");

characterInputEl.addEventListener("input", (e) => {
  const data = countCharacters(e.target.value);
  characterCountEl.innerText = data.characterCount;
  wordsCountEl.innerText = data.wordCount;
  sentencesCountEl.innerText = data.sentenceCount;

  if (data.readingTime > 60) {
    readingTimeEl.innerText = (data.readingTime / 60).toFixed(2) + " Minutes";
  } else {
    readingTimeEl.innerText = data.readingTime + " Seconds";
  }
});

const countCharacters = function (inputText) {
  const characterCount = whitespaceExclude.checked
    ? inputText.replace(/\s/g, "").length
    : inputText.length;

  // Initialize Segmentor
  const sentenceSegmenter = new Intl.Segmenter("en", {
    granularity: "sentence",
  });
  const wordSegmenter = new Intl.Segmenter("en", { granularity: "word" });

  // Count sentences
  const sentences = [...sentenceSegmenter.segment(inputText)].filter(
    (s) => s.segment.trim() !== ""
  );

  // Count words
  const words = [...wordSegmenter.segment(inputText)].filter((s) => {
    // segment.segment is the actual substring
    // Remove segments that are just punctuation or whitespace
    return /\p{L}/u.test(s.segment); // Checks if it has any letter (Unicode property)
  });

  // Reading time
  const wordsLength = inputText.trim().split(/\s+/).length;
  const minutesToRead = wordsLength / 200;
  const readingTime = Math.ceil(minutesToRead * 60);

  return {
    characterCount,
    wordCount: words.length,
    sentenceCount: sentences.length,
    readingTime,
  };
};

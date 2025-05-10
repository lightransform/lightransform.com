let mapping = {};

fetch('walkman.tsv')
  .then(response => response.text())
  .then(data => {
    data.split('\n').forEach(line => {
      const [unicode, chanakya] = line.trim().split('\t');
      if (unicode && chanakya) mapping[unicode] = chanakya;
    });
  });

function convertText(text) {
  return text.split('').map(char => mapping[char] || char).join('');
}

document.getElementById('imageUpload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const output = document.getElementById('outputText');
  output.value = 'Processing...';

  const reader = new FileReader();
  reader.onload = async () => {
    const result = await Tesseract.recognize(reader.result, 'hin', {
      logger: m => console.log(m)
    });
    const unicodeText = result.data.text;
    const convertedText = convertText(unicodeText);
    output.value = convertedText;
  };
  reader.readAsDataURL(file);
});

function copyToClipboard() {
  const text = document.getElementById('outputText').value;
  navigator.clipboard.writeText(text);
}

function clearText() {
  document.getElementById('outputText').value = '';
}

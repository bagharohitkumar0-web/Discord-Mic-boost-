document.getElementById('saveBtn').addEventListener('click', async () => {
    const gain = document.getElementById('gain').value;
    const fileInput1 = document.getElementById('fileInput').files[0];
    const fileInput2 = document.getElementById('fileInput2').files[0];
    const eqText = document.getElementById('eqText').value;
    const vstPlugin = document.getElementById('vstPlugin').value;

    let combinedText = eqText;

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsText(file);
        });
    };

    if (fileInput1) combinedText += '\n' + await readFile(fileInput1);
    if (fileInput2) combinedText += '\n' + await readFile(fileInput2);

    chrome.storage.local.set({
        gain: gain,
        filterText: combinedText,
        vstPlugin: vstPlugin
    }, () => {
        const status = document.getElementById('status');
        status.textContent = 'Settings saved. Reload Discord tab.';
        setTimeout(() => status.textContent = '', 3000);
    });
});

chrome.storage.local.get(['gain', 'filterText', 'vstPlugin'], (result) => {
    if (result.gain) {
        document.getElementById('gain').value = result.gain;
        document.getElementById('gainValue').textContent = result.gain + ' dB';
    }
    if (result.filterText) document.getElementById('eqText').value = result.filterText;
    if (result.vstPlugin) document.getElementById('vstPlugin').value = result.vstPlugin;
});

document.getElementById('gain').addEventListener('input', (e) => {
    document.getElementById('gainValue').textContent = e.target.value + ' dB';
});

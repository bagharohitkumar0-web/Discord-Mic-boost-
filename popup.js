document.getElementById('apply').addEventListener('click', function() {
const extraBoost = document.getElementById('extraBoost').value;
const filterText = document.getElementById('filterText').value;
const vstDetails = document.getElementById('vstDetails').value;
const fileInput1 = document.getElementById('fileInput1').files[0];
const fileInput2 = document.getElementById('fileInput2').files[0];
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
if (tabs && tabs.length > 0 && tabs[0].id) {
chrome.tabs.sendMessage(tabs[0].id, {
type: 'APPLY_EQ_SETTINGS',
payload: { extraBoost, filterText, vstDetails }
}, function(response) {
if (chrome.runtime.lastError) {
console.error("Error sending message:", chrome.runtime.lastError);
} else {
alert('Settings applied!');
}
});
}
});
});
document.getElementById('extraBoost').addEventListener('input', function() {
document.getElementById('gainVal').textContent = this.value + ' dB';
});
document.getElementById('fileInput1').addEventListener('change', function() {
const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
document.getElementById('fileName1').textContent = fileName;
});
document.getElementById('fileInput2').addEventListener('change', function() {
const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
document.getElementById('fileName2').textContent = fileName;
});

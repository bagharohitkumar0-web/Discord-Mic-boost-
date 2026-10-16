chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
if (request.type === 'UPDATE_EQ') {
window.postMessage({ type: 'DISCORD_EQ_UPDATE', payload: request.payload}, '*');
sendResponse({status: 'ok'});
}
});

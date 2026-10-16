(function() {
'use strict';
let audioCtx = null;
let gainNode = null;
let eqNodes = [];
const BASS_FREQ = 100;
const MID_FREQ = 1000;
const TREBLE_FREQ = 3000;
window.DISCORD_EQ_CONFIG = { gain: 2.0, bass: 0, mid: 0, treble: 0 };
const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
navigator.mediaDevices.getUserMedia = async function(...args) {
const stream = await originalGetUserMedia(...args);
if (stream.getAudioTracks().length === 0) return stream;
try {
if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaStreamSource(stream);
gainNode = audioCtx.createGain();
gainNode.gain.value = window.DISCORD_EQ_CONFIG.gain;
const bassFilter = audioCtx.createBiquadFilter();
bassFilter.type = 'lowshelf';
bassFilter.frequency.value = BASS_FREQ;
bassFilter.gain.value = window.DISCORD_EQ_CONFIG.bass;
const midFilter = audioCtx.createBiquadFilter();
midFilter.type = 'peaking';
midFilter.frequency.value = MID_FREQ;
midFilter.Q.value = 1.0;
midFilter.gain.value = window.DISCORD_EQ_CONFIG.mid;
const trebleFilter = audioCtx.createBiquadFilter();
trebleFilter.type = 'highshelf';
trebleFilter.frequency.value = TREBLE_FREQ;
trebleFilter.gain.value = window.DISCORD_EQ_CONFIG.treble;
eqNodes = [bassFilter, midFilter, trebleFilter];
source.connect(bassFilter);
bassFilter.connect(midFilter);
midFilter.connect(trebleFilter);
trebleFilter.connect(gainNode);
const destination = audioCtx.createMediaStreamDestination();
gainNode.connect(destination);
const processedStream = destination.stream;
stream.getVideoTracks().forEach(track => processedStream.addTrack(track));
return processedStream;
} catch (err) {
console.error("[Discord EQ Extension] Audio processing failed:", err);
return stream;
}
};
window.addEventListener("message", (event) => {
if (event.source !== window || !event.data || event.data.type !== "DISCORD_EQ_UPDATE") return;
const { gain, bass, mid, treble } = event.data.payload;
window.DISCORD_EQ_CONFIG = { gain, bass, mid, treble };
if (gainNode) gainNode.gain.value = gain;
if (eqNodes.length === 3) {
eqNodes[0].gain.value = bass;
eqNodes[1].gain.value = mid;
eqNodes[2].gain.value = treble;
}
});
})();

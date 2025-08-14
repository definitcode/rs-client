console.log('Only2004 content script loaded');

// Example: send a message to the preload bridge
window.postMessage({ type: 'RS_NATIVE_GET_VERSION' }, '*');

window.addEventListener('message', (e) => {
  if (e.data?.type === 'RS_NATIVE_VERSION') {
    console.log('Native client version:', e.data.data);
  }
});

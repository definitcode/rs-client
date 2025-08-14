const pluginList = document.getElementById('plugin-list');
const pluginContent = document.getElementById('plugin-content');
const plugins = {};

window.pluginAPI.onRegisterPlugin((plugin) => {
  // Convert the string back into a function
  const createContent = new Function(`return ${plugin.createContent}`)();

  // Store plugin
  plugins[plugin.name] = { createContent };

  // Add to plugin menu/list
  const li = document.createElement('li');
  li.textContent = plugin.name;
  li.style.cursor = 'pointer';
  li.addEventListener('click', () => {
    pluginContent.innerHTML = ''; // Clear previous plugin
    pluginContent.appendChild(createContent());
  });
  pluginList.appendChild(li);
});

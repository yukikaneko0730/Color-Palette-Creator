// app.js
const colorPicker = document.getElementById('colorPicker');
const currentColorText = document.getElementById('currentColorText');
const addFavoriteBtn = document.getElementById('addFavorite');
const favoriteColorsContainer = document.getElementById('favoriteColors');
const addGradientBtn = document.getElementById('addGradient');
const gradientColorsContainer = document.getElementById('gradientColors');
const gradientPreview = document.getElementById('gradientPreview');
const gradientAngleSlider = document.getElementById('gradientAngle');
const clearGradientBtn = document.getElementById('clearGradient');
const savePaletteBtn = document.getElementById('savePalette');
const paletteList = document.getElementById('paletteList');
const hueSlider = document.getElementById('hueSlider');
const saturationSlider = document.getElementById('saturationSlider');
const lightnessSlider = document.getElementById('lightnessSlider');
const randomColorBtn = document.getElementById('randomColor');

const modalOverlay = document.getElementById('modalOverlay');
const modalInput = document.getElementById('modalInput');
const modalSave = document.getElementById('modalSave');
const modalCancel = document.getElementById('modalCancel');

let favorites = JSON.parse(localStorage.getItem('favorite-colors')) || [];
let gradientColors = [];
let palettes = JSON.parse(localStorage.getItem('favorite-palettes')) || [];

const updateCurrentColor = (color) => {
  colorPicker.value = color;
  currentColorText.textContent = color;
};

const renderFavorites = () => {
  favoriteColorsContainer.innerHTML = '';
  favorites.forEach(color => {
    const div = document.createElement('div');
    div.className = 'color-box';
    div.style.background = color;
    div.onclick = () => updateCurrentColor(color);
    const code = document.createElement('div');
    code.className = 'color-code';
    code.textContent = color;
    div.appendChild(code);
    const delBtn = document.createElement('button');
    delBtn.className = 'icon-button delete-button';
    delBtn.setAttribute('aria-label', 'Delete');
    delBtn.innerHTML = '❌';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      favorites = favorites.filter(c => c !== color);
      localStorage.setItem('favorite-colors', JSON.stringify(favorites));
      renderFavorites();
    };
    div.appendChild(delBtn);
    favoriteColorsContainer.appendChild(div);
  });
};

const renderGradient = () => {
  gradientColorsContainer.innerHTML = '';
  gradientColors.forEach((color, index) => {
    const div = document.createElement('div');
    div.className = 'color-box';
    div.style.background = color;
    const code = document.createElement('div');
    code.className = 'color-code';
    code.textContent = color;
    div.appendChild(code);
    const delBtn = document.createElement('button');
    delBtn.className = 'icon-button delete-button';
    delBtn.setAttribute('aria-label', 'Delete');
    delBtn.innerHTML = '❌';
    delBtn.onclick = () => {
      gradientColors.splice(index, 1);
      renderGradient();
      renderGradientPreview();
    };
    div.appendChild(delBtn);
    gradientColorsContainer.appendChild(div);
  });
};

const renderGradientPreview = () => {
  gradientPreview.style.background = `linear-gradient(${gradientAngleSlider.value}deg, ${gradientColors.join(', ')})`;
};

const renderPalettes = () => {
  paletteList.innerHTML = '';
  palettes.forEach((p, index) => {
    const div = document.createElement('div');
    div.className = 'palette-card';
    div.style.textAlign = 'center';

    const titleWrapper = document.createElement('div');
    titleWrapper.style.display = 'flex';
    titleWrapper.style.justifyContent = 'center';
    titleWrapper.style.alignItems = 'center';
    titleWrapper.style.gap = '0.5rem';

    const title = document.createElement('h3');
    title.textContent = p.name;
    title.style.margin = '0';

    const editIcon = document.createElement('button');
    editIcon.className = 'icon-button edit-button';
    editIcon.setAttribute('aria-label', 'Edit');
    editIcon.innerHTML = '✏️';
    editIcon.onclick = () => {
      const newName = prompt('Rename palette:', p.name);
      if (newName) {
        palettes[index].name = newName;
        localStorage.setItem('favorite-palettes', JSON.stringify(palettes));
        renderPalettes();
      }
    };

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-button delete-button';
    delBtn.setAttribute('aria-label', 'Delete');
    delBtn.innerHTML = '❌';
    delBtn.onclick = () => {
      palettes.splice(index, 1);
      localStorage.setItem('favorite-palettes', JSON.stringify(palettes));
      renderPalettes();
    };

    titleWrapper.appendChild(title);
    titleWrapper.appendChild(editIcon);
    titleWrapper.appendChild(delBtn);

    const colorRow = document.createElement('div');
    colorRow.className = 'color-list';
    colorRow.style.justifyContent = 'center';

    p.colors.forEach(c => {
      const wrapper = document.createElement('div');
      wrapper.className = 'palette-color';
      const box = document.createElement('div');
      box.className = 'palette-color-box';
      box.style.background = c;
      box.onclick = () => updateCurrentColor(c);
      const code = document.createElement('div');
      code.className = 'palette-color-code';
      code.textContent = c;
      wrapper.appendChild(box);
      wrapper.appendChild(code);
      colorRow.appendChild(wrapper);
    });

    div.appendChild(titleWrapper);
    div.appendChild(colorRow);
    paletteList.appendChild(div);
  });
};

const openModal = () => {
  modalOverlay.style.display = 'flex';
  modalInput.value = '';
  modalInput.focus();
};

const closeModal = () => {
  modalOverlay.style.display = 'none';
};

modalSave.onclick = () => {
  const name = modalInput.value.trim();
  if (name && gradientColors.length > 0) {
    palettes.push({ name, colors: [...gradientColors] });
    localStorage.setItem("favorite-palettes", JSON.stringify(palettes));
    renderPalettes();
    gradientColors = [];
    renderGradient();
    renderGradientPreview();
    closeModal();
  }
};

modalCancel.onclick = closeModal;

savePaletteBtn.onclick = () => {
  if (gradientColors.length === 0) return;
  openModal();
};

addFavoriteBtn.onclick = () => {
  if (!favorites.includes(colorPicker.value)) {
    favorites.push(colorPicker.value);
    localStorage.setItem('favorite-colors', JSON.stringify(favorites));
    renderFavorites();
  }
};

addGradientBtn.onclick = () => {
  gradientColors.push(colorPicker.value);
  renderGradient();
  renderGradientPreview();
};

clearGradientBtn.onclick = () => {
  gradientColors = [];
  renderGradient();
  renderGradientPreview();
};

randomColorBtn.onclick = () => {
  const rand = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  updateCurrentColor(rand);
};

colorPicker.addEventListener('input', (e) => updateCurrentColor(e.target.value));

updateCurrentColor(colorPicker.value);
renderFavorites();
renderGradient();
renderGradientPreview();
renderPalettes();

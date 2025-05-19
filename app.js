/* app.js */
document.addEventListener('DOMContentLoaded', () => {
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
        div.title = color;
        div.onclick = () => updateCurrentColor(color);
        const delBtn = document.createElement('button');
        delBtn.textContent = '❌';
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
        const delBtn = document.createElement('button');
        delBtn.textContent = '❌';
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
      palettes.forEach(p => {
        const div = document.createElement('div');
        div.className = 'palette-card';
        const title = document.createElement('h3');
        title.textContent = p.name;
        title.onclick = () => {
          const newName = prompt('New name?', p.name);
          if (newName) {
            p.name = newName;
            localStorage.setItem('favorite-palettes', JSON.stringify(palettes));
            renderPalettes();
          }
        };
        const del = document.createElement('button');
        del.textContent = '❌';
        del.onclick = () => {
          palettes = palettes.filter(pl => pl !== p);
          localStorage.setItem('favorite-palettes', JSON.stringify(palettes));
          renderPalettes();
        };
        div.appendChild(title);
        div.appendChild(del);
        p.colors.forEach(c => {
          const cBox = document.createElement('div');
          cBox.className = 'color-box';
          cBox.style.background = c;
          div.appendChild(cBox);
        });
        paletteList.appendChild(div);
      });
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
  
    savePaletteBtn.onclick = () => {
      const name = prompt("Palette name?");
      if (!name) return;
      palettes.push({ name, colors: [...gradientColors] });
      localStorage.setItem("favorite-palettes", JSON.stringify(palettes));
      renderPalettes();
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
  });
  
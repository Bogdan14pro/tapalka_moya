
/* ... existing CSS ... */document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  function showTab(tabId) {
    tabContents.forEach(tab => {
      tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('onclick').match(/'(\w+-tab)'/)[1];
      showTab(targetTab);

      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
  let dragonsss = 0;
  let dragonsssPerClick = 1;
  let dragonsssPerSecond = 0;
  let upgradeClickCost = 10; 
  let buyMinerCost = 50; 
  const maxEnergy = 8000;
  let currentEnergy = maxEnergy;
  let rage = 0;
  let maxRage = getRandomRage();
  let isRageActive = false;
  let isUpdatingRage = false;
  let lastClickTime = Date.now();

  // DOM elements
  const dragonsssElement = document.getElementById('dragonsss');
  const dragonsssPerClickElement = document.getElementById('dragonsssPerClick');
  const dragonsssPerSecondElement = document.getElementById('dragonsssPerSecond');
  const mineButton = document.getElementById('mineButton');
  const energyBar = document.getElementById('energyBar');
  const energyText = document.getElementById('energyText');
  const rageBar = document.getElementById('rageBar');
  const rageText = document.getElementById('rageText');
  const upgradeClickButton = document.getElementById('upgradeClick');
  const buyMinerButton = document.getElementById('buyMiner');
  const upgradeClickCostElement = document.getElementById('upgradeClickCost');
  const buyMinerCostElement = document.getElementById('buyMinerCost');
  const sparksContainer = document.getElementById('sparksContainer');
  const dragonImage = document.querySelector('.mine-button img');
  dragonImage.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });
  
  function updateDragonsss() {
    dragonsssElement.textContent = `Dragonsss: ${dragonsss}`;
    dragonsssPerClickElement.textContent = `Dragonsss per Click: ${dragonsssPerClick}`;
    dragonsssPerSecondElement.textContent = `Dragonsss per Second: ${dragonsssPerSecond}`;
    upgradeClickCostElement.textContent = `Upgrade Click Cost: ${upgradeClickCost} Dragonsss`;
    buyMinerCostElement.textContent = `Buy Miner Cost: ${buyMinerCost} Dragonsss`;
  }

  function updateEnergyBar() {
    const energyPercentage = (currentEnergy / maxEnergy) * 100;
    energyBar.style.width = `${energyPercentage}%`;
    energyText.textContent = `${currentEnergy}/${maxEnergy}`;
  }

  function updateRageBar() {
    const ragePercentage = (rage / maxRage) * 100;
    rageBar.style.width = `${ragePercentage}%`;
    rageText.textContent = `${rage}/${maxRage}`;
  }

  function getRandomRage() {
    return Math.floor(Math.random() * 556) + 555; 
  }

  function addDragonsss(amount) {
    dragonsss += amount;
    updateDragonsss();
  }

  function createSpark() {
    const spark = document.createElement('div');
    spark.classList.add('spark');
    sparksContainer.appendChild(spark);

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * (window.innerWidth / 2); 
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    spark.style.setProperty('--x', `${x}px`);
    spark.style.setProperty('--y', `${y}px`);
    spark.style.left = '50%';
    spark.style.top = '50%';
    spark.style.transform = 'translate(-50%, -50%)';

    spark.addEventListener('animationend', () => {
      spark.remove();
    });
  }

  function startSparks() {
    const sparkInterval = setInterval(() => {
      if (isRageActive) {
        createSpark();
      } else {
        clearInterval(sparkInterval);
      }
    }, 100);
  }

  function activateRageMode() {
    isRageActive = true;
    isUpdatingRage = true;
    mineButton.querySelector('img').src = 'dragonsssRot.png';
    document.body.classList.add('shake-screen');
    startSparks(); 
    setTimeout(() => {
      isRageActive = false;
      rage = 0;
      maxRage = getRandomRage();
      updateRageBar();
      mineButton.querySelector('img').src = 'dragonsss.png';
      document.body.classList.remove('shake-screen');
      isUpdatingRage = false;
    }, 15000);
  }

  function createFloatingText(text, x, y) {
    const floatingText = document.createElement('div');
    floatingText.classList.add('floating-text');
    floatingText.textContent = text;
    floatingText.style.left = `${x}px`;
    floatingText.style.top = `${y}px`;
    document.body.appendChild(floatingText);

    floatingText.addEventListener('animationend', () => {
      floatingText.remove();
    });
  }

  function onMineButtonClick(event) {
    if (currentEnergy > 0) {
      currentEnergy -= 1;
      updateEnergyBar();

      let amountToAdd = dragonsssPerClick;
      if (isRageActive) {
        amountToAdd *= 1024;
      }
      addDragonsss(amountToAdd);

      createFloatingText(`+${amountToAdd}`, event.clientX, event.clientY);

      if (!isRageActive && !isUpdatingRage) {
        rage++;
        updateRageBar();

        if (rage >= maxRage) {
          activateRageMode();
        }
      }
      lastClickTime = Date.now();
    }
  }

  mineButton.addEventListener('click', onMineButtonClick);

  upgradeClickButton.addEventListener('click', () => {
    if (dragonsss >= upgradeClickCost) {
      dragonsss -= upgradeClickCost;
      dragonsssPerClick += 1;
      upgradeClickCost *= 2; 
      updateDragonsss();
    }
  });

  buyMinerButton.addEventListener('click', () => {
    if (dragonsss >= buyMinerCost) {
      dragonsss -= buyMinerCost;
      dragonsssPerSecond += 1;
      buyMinerCost *= 2; 
      updateDragonsss();
    }
  });

  setInterval(() => {
    addDragonsss(dragonsssPerSecond);
    const currentTime = Date.now();
    if (currentTime - lastClickTime >= 3000 && rage > 0) {
      const reduceAmount = Math.min(rage, 5); 
      rage -= reduceAmount;
      updateRageBar();
      lastClickTime = currentTime;
    }
  }, 1000);

  updateDragonsss();
  updateEnergyBar();
  updateRageBar();
});

const gameOfLife = function() {
  const btnGenerate = document.querySelector('.btn-generate');
  const btnStart = document.querySelector('.btn-start');
  const btnStop = document.querySelector('.btn-stop');
  const btnSave = document.querySelector('.btn-save');
  const btnLoad = document.querySelector('.btn-load');
  const editRows = document.querySelector('.table-rows-count');
  const editCols = document.querySelector('.table-cols-count');
  const editHeight = document.querySelector('.cell-height');
  const editWidth = document.querySelector('.cell-width');
  const editSpeed = document.querySelector('.speed');
  const editRel = document.querySelector('.alive-to-empty');

  let gamesCells;
  
  const options = {
    _SPEEDCONST: 1050,
    rowsValue: 35,
    colsValue: 35,
    cellHeight: 10,
    cellWidth: 10,
    gameRatio: 1,
    gameSpeed: 50,
    isRunning: false,
    gameTimer: 0,
  };
  
  //===========================SET SIZES===================================
  const setSizes = function(event) {
    if (event) {
      const target = event.target;
      
      if (target === editHeight) options.cellHeight = target.value;
      if (target === editWidth) options.cellWidth = target.value;
    }

    gamesCells.forEach((item) => {
      item.style.height = options.cellHeight + 'px';
      item.style.width = options.cellWidth + 'px';
    });
  };
  
  //=========================SET ALIVE TO EMPTY===========================
  const setRel = function(event) {
    const target = event.target;

    options.gameRatio = target.value;
  };

  //=======================CHANGE-STATUS-OF-CELL===========================
  const toggleLive = function toggleLiveOnCell(event) {
    const target = event.target;

    if (!target.closest('.cell')) return;

    target.classList.toggle('alive');
  };

  //========================RENDER CUSTOM MAP=============================
  const renderMap = function(event) {

    let table = document.getElementById('table-of-life');
    if (table) table.remove();

    const container = document.querySelector('.container');
    let i, j;

    if (event) {
      const target = event.target;
      if (target === editRows) options.rowsValue = target.value;
      if (target === editCols) options.colsValue = target.value;
    }

    table = document.createElement('TABLE');
    table.setAttribute('id', 'table-of-life');

    for (i = 0; i < options.rowsValue; i += 1) {
      let newTr = document.createElement('TR');
      
      for (j = 0; j < options.colsValue; j += 1) {
        let newTd = document.createElement('TD');
        newTd.classList.add('cell');
        newTr.append(newTd);
      }

      table.append(newTr);
    }

    container.prepend(table);
    rows = [...table.rows];
    gamesCells = [...document.querySelectorAll('.cell')];

    setSizes();

    table.addEventListener('click', toggleLive, false);
  };

  //==========================SET OPTIONS==================================
  const setOptions = function(savedOptions) {
    Object.keys(options).forEach((key) => {
      if (key !== 'isRunning' && key !== 'gameTimer') options[key] = parseInt(savedOptions[key]);
    });
  };

  //===========================SAVE GAME===================================
  const saveGame = function() {
    const savedMap = [];

    gamesCells.forEach((cell) => {
      if (cell.classList.contains('alive')) {
        savedMap.push(1);
      } else savedMap.push(0);
    });

    try {
      const optionsJSON = JSON.stringify(options);
      localStorage.setItem('savedOptions', optionsJSON);
      const savedMapJSON = JSON.stringify(savedMap);
      localStorage.setItem('savedMap', savedMapJSON); 
    } catch (error) {
      console.log(`Can't write to local storage! ${error}`);
    }
  };

  //===========================LOAD GAME===================================
  const loadMap = function() {
    let savedMap = [];

    try {
      savedMap = JSON.parse(localStorage.getItem('savedMap'));
      savedMap.forEach((cell, index) => {
        if (parseInt(cell) === 1) gamesCells[index].classList.add('alive');
      });
    } catch (error) {
      console.log(`Can't read local storage! ${error}`);
    }
  };

  const loadOptions = function(event) {
    let savedOptions = {};
  
    try {
      savedOptions = JSON.parse(localStorage.getItem('savedOptions'));
      setOptions(savedOptions);

      editRows.value = options.rowsValue;
      editCols.value = options.colsValue;
      editHeight.value = options.cellHeight;
      editWidth.value = options.cellWidth;
      editSpeed.value = options._SPEEDCONST - options.gameSpeed;
      editRel.value = options.gameRatio;
    } catch (error) {
      console.log(`Can't read local storage! ${error}`);
    }

    if (event) { 
      renderMap();
      loadMap();
    }
  };
  
  //========================MAP-GENERATOR=================================
  const generateMap = function() {
    let randNum;

    gamesCells.forEach((item) => {
      item.classList.remove('alive');
      randNum = Math.round(Math.random() * options.gameRatio);
      if (randNum === 1) item.classList.add('alive');
    });
  };

  //==============================START GAME===============================
  const getAliveNum = function(index) {
    const neighborhood = {};
    let liveCount = 0;

    if (index - options.colsValue < 0) {
      neighborhood.topCenter = gamesCells.length - options.colsValue + index;
    } else neighborhood.topCenter = index - options.colsValue;

    if (index + options.colsValue >= gamesCells.length) {
      neighborhood.bottomCenter = options.colsValue - gamesCells.length % index;
    } else neighborhood.bottomCenter = index + options.colsValue;

    if (index % options.colsValue === 0) {
      neighborhood.topLeft = neighborhood.bottomCenter + (options.colsValue - 1);
      neighborhood.bottomLeft = index + (options.colsValue - 1);
    } else {
      neighborhood.topLeft = neighborhood.topCenter - 1;
      neighborhood.bottomLeft = neighborhood.bottomCenter - 1;
    }

    if (index % options.colsValue === options.colsValue - 1) {
      neighborhood.topRight = index - (options.colsValue - 1);
      neighborhood.bottomRight = neighborhood.topCenter - (options.colsValue - 1);
    } else {
      neighborhood.topRight = neighborhood.topCenter + 1;
      neighborhood.bottomRight = neighborhood.bottomCenter + 1;
    }

    if (index === 0) {
      neighborhood.centerLeft = gamesCells.length - 1;
    } else neighborhood.centerLeft = index - 1;

    if (index === gamesCells.length - 1) {
      neighborhood.centerRight = 0;
    } else neighborhood.centerRight = index + 1;

    Object.keys(neighborhood).forEach((key) => {
      if (gamesCells[neighborhood[key]].classList.contains('alive')) liveCount += 1;
    });

    return liveCount;
  };

  const isItWillLive = function(index) {
    return (!gamesCells[index].classList.contains('alive') && (getAliveNum(index) === 3));
  };

  const isItStillAlive = function(index) {
    return (gamesCells[index].classList.contains('alive') && (getAliveNum(index) === 2 || getAliveNum(index) === 3));
  };

  const calcOneStep = function() {
    const maskArray = [];

    gamesCells.forEach((cell, index) => {
      if (isItWillLive(index)) {
        maskArray.push(1);
      } else if (isItStillAlive(index)) {
        maskArray.push(1);
      } else maskArray.push(0);
    });
    
    gamesCells.forEach((cell, index) => {
      if (parseInt(maskArray[index]) === 1) {
        cell.classList.add('alive');
      } else cell.classList.remove('alive');
    });
  };
  
  const start = function startGameOfLife(event) {
    if (event && options.isRunning) return;

    calcOneStep();
    options.gameTimer = setInterval(calcOneStep, options.gameSpeed);
    options.isRunning = true;
  };

  const stop = function stopGameOfLife() {
    clearInterval(options.gameTimer);
    options.isRunning = false;
  };

  const setSpeed = function(event) {
    const target = event.target;

    clearInterval(options.gameTimer);

    options.gameSpeed = options._SPEEDCONST - target.value;
    if (options.isRunning) start();
  };

  renderMap();
  
  btnGenerate.addEventListener('click', generateMap, false);
  btnStart.addEventListener('click', start, false);
  btnStop.addEventListener('click', stop, false);
  btnSave.addEventListener('click', saveGame, false);
  btnLoad.addEventListener('click', loadOptions, false);
  editRows.addEventListener('blur', renderMap, false);
  editCols.addEventListener('blur', renderMap, false);
  editHeight.addEventListener('blur', setSizes, false);
  editWidth.addEventListener('blur', setSizes, false);
  editSpeed.addEventListener('change', setSpeed, false);
  editRel.addEventListener('blur', setRel, false);
};

  gameOfLife();

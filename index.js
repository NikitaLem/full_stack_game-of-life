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
    const gamesCells = [...document.querySelectorAll('.cell')];

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

    setSizes();

    table.addEventListener('click', toggleLive, false);
  };

  //==========================SET OPTIONS==================================
  const setOptions = function(savedOptions) {
    Object.keys(options).forEach((key) => {
      options[key] = savedOptions[key];
    });
  };

  //===========================SAVE GAME===================================
  const saveGame = function() {
    const gamesCells = [...document.querySelectorAll('.cell')];
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
    const gamesCells = [...document.querySelectorAll('.cell')];
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
    const gamesCells = [...document.querySelectorAll('.cell')];
    let randNum;

    gamesCells.forEach((item) => {
      item.classList.remove('alive');
      randNum = Math.round(Math.random() * options.gameRatio);
      if (randNum === 1) item.classList.add('alive');
    });
  };

  //==============================START GAME===============================
  const calcOneStep = function() {
    const table = document.getElementById('table-of-life');
    const rows = [...table.rows];
    let i, j;
    let liveCount;
    const maskArray = [];
    const gamesCells = [...document.querySelectorAll('.cell')];

    const getAliveNum = function(row, col) {
      let controlRow, controlCol;
      liveCount = 0;
      
      for (let k = -1; k < 2; k += 1) {
        for (let l = -1; l < 2; l += 1) {
          if (k === 0 && l === 0) continue;

          if (row === 0 && k === -1) {
            controlRow = options.rowsValue - 1; 
          } else if ((row === options.rowsValue - 1) && k === 1) {
            controlRow = 0;
          } else {
            controlRow = row + k;
          }
          
          if (col === 0 && l === -1) {
            controlCol = options.colsValue - 1; 
            } else if ((col === options.colsValue - 1) && l === 1) {
              controlCol = 0;
            } else {
              controlCol = col + l;
            }

          if (rows[controlRow].cells[controlCol].classList.contains('alive')) liveCount += 1;
        }
      }

      return liveCount;
    };

    const isItWillLive = function(indexRow, indexCol) {
      return (!rows[indexRow].cells[indexCol].classList.contains('alive') && (getAliveNum(indexRow, indexCol) === 3));
    };

    const isItStillAlive = function(indexRow, indexCol) {
      return (rows[indexRow].cells[indexCol].classList.contains('alive') && (getAliveNum(indexRow, indexCol) === 2 || getAliveNum(indexRow, indexCol) === 3));
    };

    for (i = 0; i < rows.length; i += 1) {
      for (j = 0; j < rows[i].cells.length; j += 1) {
        
        if (isItWillLive(i, j)) {
          maskArray.push(1);
        } else if (isItStillAlive(i, j)) {
          maskArray.push(1);
        } else maskArray.push(0);
      }
    }
    
    gamesCells.forEach((cell, index) => {
      if (parseInt(maskArray[index]) === 1) {
        cell.classList.add('alive');
      } else cell.classList.remove('alive');
    });
  };
  
  const start = function startGameOfLife() {
    if (!options.isRunning) {
      calcOneStep();
      options.gameTimer = setInterval(calcOneStep, options.gameSpeed);
      options.isRunning = true;
    } else return;
  };

  const stop = function stopGameOfLife() {
    clearInterval(options.gameTimer);
    options.isRunning = false;
  };

  const setSpeed = function(event) {
    const target = event.target;

    clearInterval(options.gameTimer);

    options.gameSpeed = options._SPEEDCONST - target.value;
    console.log(options.gameSpeed + ' ' + target.value);
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

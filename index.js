(function() {
    const btnGenerate = document.querySelector('.btn-generate');
    const btnStart = document.querySelector('.btn-start');
    const btnStop = document.querySelector('.btn-stop');
    const editRows = document.querySelector('.table-rows-count');
    const editCols = document.querySelector('.table-cols-count');
    const editHeight = document.querySelector('.cell-height');
    const editWidth = document.querySelector('.cell-width');
    const editSpeed = document.querySelector('.speed');
    const editRel = document.querySelector('.alive-to-empty');
  
    const options = {
      rowsValue: 35,
      colsValue: 35,
      cellHeight: 10,
      cellWidth: 10,
      gameRatio: 1,
      gameSpeed: 50,
      isRunning: false,
    };
    
    let gameTimer;
  
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
  
      for (i = 0; i < rows.length; i += 1) {
        for (j = 0; j < rows[i].cells.length; j += 1) {
          getAliveNum(i, j);
  
          if (!rows[i].cells[j].classList.contains('alive') && (liveCount === 3)) {
            rows[i].cells[j].classList.toggle('alive');
          } else if (rows[i].cells[j].classList.contains('alive') && (liveCount < 2 || liveCount > 3)) {
            rows[i].cells[j].classList.toggle('alive');
          }
        }
      }
    };
  
    const start = function startGameOfLife() {
      calcOneStep();
      gameTimer = setInterval(calcOneStep, options.gameSpeed);
      options.isRunning = true;
    };
  
    const stop = function stopGameOfLife() {
      clearInterval(gameTimer);
      options.isRunning = false;
    };
  
    const setSpeed = function(event) {
      const target = event.target;
  
      clearInterval(gameTimer);
  
      options.gameSpeed = target.value;
      if (options.isRunning) start();
    };
  
    renderMap();
  
    btnGenerate.addEventListener('click', generateMap, false);
    btnStart.addEventListener('click', start, false);
    btnStop.addEventListener('click', stop, false);
    editRows.addEventListener('blur', renderMap, false);
    editCols.addEventListener('blur', renderMap, false);
    editHeight.addEventListener('blur', setSizes, false);
    editWidth.addEventListener('blur', setSizes, false);
    editSpeed.addEventListener('change', setSpeed, false);
    editRel.addEventListener('blur', setRel, false);
  }());
  
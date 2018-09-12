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
  
    let isRunning = false;
    let gameSpeed = 50;
    let gameTimer;
    let rowsValue = 35;
    let colsValue = 35;
    let gameRatio = 1;
  
    //===========================SET SIZES===================================
    const setSizes = function(event) {
      const target = event.target;
  
      const gamesCells = [...document.querySelectorAll('.cell')];
  
      if (target === editHeight) {
        gamesCells.forEach((item) => {
          item.style.height = target.value + 'px';
        });
      }
  
      if (target === editWidth) {
        gamesCells.forEach((item) => {
          item.style.width = target.value + 'px';
        });
      }
    };
  
    //=========================SET ALIVE TO EMPTYL===========================
    const setRel = function(event) {
      const target = event.target;
  
      gameRatio = target.value;
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
        if (target === editRows) rowsValue = target.value;
        if (target === editCols) colsValue = target.value;
      }
  
      table = document.createElement('TABLE');
      table.setAttribute('id', 'table-of-life');
  
      for (i = 0; i < rowsValue; i += 1) {
        let newTr = document.createElement('TR');
        
        for (j = 0; j < colsValue; j += 1) {
          let newTd = document.createElement('TD');
          newTd.classList.add('cell');
          newTr.append(newTd);
        }
  
        table.append(newTr);
      }
  
      container.prepend(table);
  
      table.addEventListener('click', toggleLive, false);
    };
  
    //========================MAP-GENERATOR=================================
    const generateMap = function() {
      const gamesCells = [...document.querySelectorAll('.cell')];
      let randNum;
  
      gamesCells.forEach((item) => {
        item.classList.remove('alive');
        randNum = Math.round(Math.random() * gameRatio);
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
        liveCount = 0;
    
        if (rows[row - 1].cells[col - 1].classList.contains('alive')) liveCount += 1;
        if (rows[row - 1].cells[col].classList.contains('alive')) liveCount += 1;
        if (rows[row - 1].cells[col + 1].classList.contains('alive')) liveCount += 1;
        if (rows[row].cells[col - 1].classList.contains('alive')) liveCount += 1;
        if (rows[row].cells[col + 1].classList.contains('alive')) liveCount += 1;
        if (rows[row + 1].cells[col - 1].classList.contains('alive')) liveCount += 1;
        if (rows[row + 1].cells[col].classList.contains('alive')) liveCount += 1;
        if (rows[row + 1].cells[col + 1].classList.contains('alive')) liveCount += 1;
  
        return liveCount;
      };
  
      for (i = 1; i < rows.length - 1; i += 1) {
        for (j = 1; j < rows[i].cells.length - 1; j += 1) {
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
      gameTimer = setInterval(calcOneStep, gameSpeed);
      isRunning = true;
    };
  
    const stop = function stopGameOfLife() {
      clearInterval(gameTimer);
      isRunning = false;
    };
  
    const setSpeed = function(event) {
      const target = event.target;
  
      clearInterval(gameTimer);
  
      gameSpeed = target.value;
      if (isRunning) start();
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
  
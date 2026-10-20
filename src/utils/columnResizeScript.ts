export const COLUMN_RESIZE_SCRIPT = `<script id="uni-designer-resizer">
(function() {
  function getCellAtColumnIndex(row, targetColIndex) {
    let currentColIndex = 0;
    const children = row.children;
    for (let j = 0; j < children.length; j++) {
      const rCell = children[j];
      if (rCell.tagName.toLowerCase() === 'col' || rCell.tagName.toLowerCase() === 'colgroup') continue;
      const colspan = parseInt(rCell.getAttribute('colspan')) || 1;
      if (currentColIndex === targetColIndex) {
        return rCell;
      }
      if (targetColIndex >= currentColIndex && targetColIndex < currentColIndex + colspan) {
        return rCell;
      }
      currentColIndex += colspan;
    }
    return null;
  }

  function initResizers() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (table.getAttribute('data-uni-resizable')) return;
      table.setAttribute('data-uni-resizable', 'true');
      
      if (!table.style.width && !table.getAttribute('width')) {
        table.style.width = '100%';
      }
      table.style.tableLayout = 'fixed';

      const rows = table.querySelectorAll('tr');
      let targetRow = null;
      let maxCells = 0;
      rows.forEach(row => {
        const cellCount = row.children.length;
        if (cellCount > maxCells) {
          maxCells = cellCount;
          targetRow = row;
        }
      });
      if (!targetRow) return;
      const cells = targetRow.children;
      if (!cells || cells.length === 0) return;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.tagName.toLowerCase() === 'col' || cell.tagName.toLowerCase() === 'colgroup') continue;
        
        cell.style.position = 'relative';

        const resizer = document.createElement('div');
        resizer.className = 'uni-col-resizer';
        cell.appendChild(resizer);

        let pageX = 0;
        let curCellWidth = 0;
        let tableWidth = 0;
        
        // Calculate the grid column index for this cell
        let colIndex = 0;
        for (let j = 0; j < i; j++) {
          colIndex += parseInt(cells[j].getAttribute('colspan')) || 1;
        }

        resizer.addEventListener('mousedown', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          resizer.classList.add('resizing');
          pageX = e.pageX;
          curCellWidth = cell.offsetWidth;
          tableWidth = table.offsetWidth || 800;
          
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
          const diffX = e.pageX - pageX;
          const newWidthPx = Math.max(25, curCellWidth + diffX);
          const tWidth = tableWidth || 1;
          const pct = Math.min(99, Math.max(1, Math.round((newWidthPx / tWidth) * 100)));
          
          const colGroup = table.querySelector('colgroup');
          let updated = false;
          if (colGroup) {
            const cols = colGroup.querySelectorAll('col');
            if (cols && cols[colIndex]) {
              cols[colIndex].style.width = pct + '%';
              cols[colIndex].setAttribute('width', pct + '%');
              updated = true;
            }
          }
          if (!updated) {
            const trs = table.querySelectorAll('tr');
            trs.forEach(row => {
              const cellAtCol = getCellAtColumnIndex(row, colIndex);
              if (cellAtCol) {
                cellAtCol.style.width = pct + '%';
                cellAtCol.setAttribute('width', pct + '%');
              }
            });
          }
        }

        function onMouseUp(e) {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          resizer.classList.remove('resizing');
          
          const diffX = e.pageX - pageX;
          const newWidthPx = Math.max(25, curCellWidth + diffX);
          const tWidth = tableWidth || 1;
          const pct = Math.min(99, Math.max(1, Math.round((newWidthPx / tWidth) * 100)));
          
          const colGroup = table.querySelector('colgroup');
          let targetElement = cell;
          if (colGroup) {
            const cols = colGroup.querySelectorAll('col');
            if (cols && cols[colIndex]) {
              targetElement = cols[colIndex];
            }
          }

          const xsltId = targetElement.getAttribute('data-xslt-id');
          if (xsltId) {
            const cellIds = [];
            if (!colGroup) {
              const trs = table.querySelectorAll('tr');
              trs.forEach(row => {
                const cellAtCol = getCellAtColumnIndex(row, colIndex);
                if (cellAtCol && cellAtCol.getAttribute('data-xslt-id')) {
                  cellIds.push(cellAtCol.getAttribute('data-xslt-id'));
                }
              });
            }
            window.parent.postMessage({
              source: 'xslt-column-resized',
              xsltId: xsltId,
              xsltIds: cellIds,
              widthPct: pct + '%'
            }, '*');
          }
        }
      }
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initResizers();
  } else {
    document.addEventListener('DOMContentLoaded', initResizers);
  }
  window.addEventListener('load', initResizers);
})();
</script>`;
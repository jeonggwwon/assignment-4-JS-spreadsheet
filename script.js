// 필요한 변수 생성
const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

class Cell {
  // instance를 만들 때 가장 먼저 실행됨 -> constructor
  // ()안에 기본값 설정
  constructor(
    isHeader,
    disabled,
    data,
    row,
    column,
    rowName,
    columnName,
    active = false
  ) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.rowName = rowName;
    this.column = column;
    this.columnName = columnName;
    this.active = active;
  }
}
// csv 파일 만들기
exportBtn.onclick = function (e) {
  let csv = "";
  // spreadsheet 순회
  for (let i = 0; i < spreadsheet.length; i++) {
    if (i === 0) continue; // 첫번째 띄움 방지
    csv +=
      spreadsheet[i]
        .filter((item) => !item.isHeader)
        // 헤더 데이터는 필요 없으므로
        .map((item) => item.data)
        // 객체에서 data만 필요하므로
        .join(",") + "\r\n";
  }
  console.log("csv: ", csv);

  const csvObj = new Blob([csv]);
  const csvUrl = URL.createObjectURL(csvObj); // 다운로드 URL 생성
  console.log("csvUrl", csvUrl);

  const a = document.createElement("a");
  a.href = csvUrl;
  a.download = "spreadsheet name.csv";
  a.click(); // 강제 클릭
};
initSpreadsheet();

function initSpreadsheet() {
  // 스프레드 시트 생성
  for (let i = 0; i < ROWS; i++) {
    let spreadsheetRow = [];
    for (let j = 0; j < COLS; j++) {
      // 기본값
      let cellData = "";
      let isHeader = false;
      let disabled = false;

      // 모든 row 첫 번째 column에 숫자 넣기, 헤더 설정
      if (j == 0) {
        cellData = i;
        isHeader = true;
        disabled = true;
      }
      // 첫번째 row에 순서대로 알파벳 넣기, 헤더 설정
      if (i == 0) {
        cellData = alphabets[j - 1];
        isHeader = true;
        disabled = true;
      }
      // 첫 번째 row의 첫번째 column은 ""
      if (!cellData) {
        cellData = "";
      }
      const rowName = i;
      const columnName = alphabets[j - 1];

      const cell = new Cell(
        isHeader,
        disabled,
        cellData,
        i,
        j,
        rowName,
        columnName,
        false
      );
      spreadsheetRow.push(cell);
    }
    spreadsheet.push(spreadsheetRow);
  }
  drawSheet();
  console.log(spreadsheet);
}

// Row * Col 만큼 실행해야함 -> drawSheet
function createCellEl(cell) {
  // 요소 생성
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  // 셀 구분 (id)
  cellEl.id = "cell_" + cell.row + cell.column;
  // 셀 value를 input값인 data로 설정
  cellEl.value = cell.data;
  cellEl.disabled = cell.disabled;
  if (cell.isHeader) {
    cellEl.classList.add("header");
  }
  cellEl.onclick = () => handleCellClick(cell);
  // 셀 수정값 저장
  cellEl.onchange = (e) => handleOnChange(e.target.value, cell);
  return cellEl;
}

function handleOnChange(data, cell) {
  cell.data = data;
}

function handleCellClick(cell) {
  clearHeaderActiveStates();
  const columnHeader = spreadsheet[0][cell.column];
  const rowHeader = spreadsheet[cell.row][0];
  const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
  const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);
  // css에 의해 헤더에 lightblue 색이 입혀짐
  columnHeaderEl.classList.add("active");
  rowHeaderEl.classList.add("active");
  console.log("clicked cell", columnHeaderEl, rowHeaderEl);
  document.querySelector("#cell-status").innerHTML =
    cell.columnName + cell.rowName;
}

// 새로 클릭하면 이전 cell의 헤더에 색 지우기
function clearHeaderActiveStates() {
  const headers = document.querySelectorAll(".header");
  headers.forEach((header) => {
    header.classList.remove("active");
  });
}

function getElFromRowCol(row, col) {
  return document.querySelector("#cell_" + row + col);
}

function drawSheet() {
  // cell을 row*col 만큼 생성하여 스프레드 시트(spreadSheetContainer)에 추가
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";
    for (let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];
      rowContainerEl.append(createCellEl(cell));
    }
    // 행을 스프레트 시트에 넣어준다.
    spreadSheetContainer.append(rowContainerEl);
  }
}

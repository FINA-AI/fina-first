import { render, screen } from "@testing-library/react";
import TestGrid, { columns, testData } from "./TestGrid";

let rowEditFunction;
let rowDeleteFunction;
let rowDownloadFunction;

beforeAll(() => {
  rowEditFunction = jest.fn();
  rowDeleteFunction = jest.fn();
  rowDownloadFunction = jest.fn();

  render(
    <TestGrid
      rowEditFunction={rowEditFunction}
      rowDeleteFunction={rowDeleteFunction}
      rowDownloadFunction={rowDownloadFunction}
    />
  );
});

test("Grid click", () => {
  let editBtn = screen.getByTestId(`rowEditFunction-0`);
  let deleteBtn = screen.getByTestId(`rowDeleteFunction-0`);
  let downloadBtn = screen.getByTestId(`rowDownloadFunction-0`);

  editBtn.click();
  expect(rowEditFunction).toHaveBeenCalled();

  deleteBtn.click();
  expect(rowDeleteFunction).toHaveBeenCalled();

  downloadBtn.click();
  expect(rowDownloadFunction).toHaveBeenCalled();
});

test("Grid styles", () => {
  let header = screen.getByTestId(`${columns[0].headerName}-header`);
  const headerStyle = window.getComputedStyle(header);
  expect(headerStyle.minWidth).toEqual("400px");
});

test("Grid value are same in grid and in data", () => {
  for (let column of columns) {
    for (let i = 0; i < testData.length; i++) {
      let elementName = screen.getByTestId(`${column.headerName}-${i}-value`);
      let val = testData[i][column.field];
      if (typeof val == "number") {
        expect(parseInt(elementName.innerHTML)).toEqual(
          testData[i][column.field]
        );
      } else {
        expect(elementName.innerHTML).toEqual(testData[i][column.field]);
      }
    }
  }
});

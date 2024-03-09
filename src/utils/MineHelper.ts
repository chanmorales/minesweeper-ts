import { Coordinates } from "../types/Game";

class MineHelper {
  /**
   * Generate the minefield
   *
   * @param width - the field's width
   * @param height - the field's height
   * @param bombs - the number of bombs
   * @param initialX - the x-coordinate of the initial click
   * @param initialY - the y-coordinate of the initial click
   */
  public generateField(
    width: number,
    height: number,
    bombs: number,
    initialX: number,
    initialY: number
  ): number[][] {
    // Available fields for a mine to be placed
    const availableFields: number[] = Array.from(
      { length: width * height },
      (_, index) => index + 1
    );

    // Make the initial selection as well as its neighbors mine free by removing them from the
    // available fields
    const initialAndNeighbors: number[] = this.getInitialAndNeighborIndices(
      initialX,
      initialY,
      width,
      height
    );

    // Remove the initial and neighbors from the available fields
    initialAndNeighbors.forEach((element: number) => {
      const index = availableFields.indexOf(element);
      if (index !== -1) availableFields.splice(index, 1);
    });

    return this.generateMines(width, height, bombs, availableFields);
  }

  /**
   *
   * @param width
   * @param height
   * @param bombs
   * @param availableFields
   * @private
   */
  private generateMines(
    width: number,
    height: number,
    bombs: number,
    availableFields: number[]
  ): number[][] {
    // Initialize to all zero's
    const mineField: number[][] = [];
    for (let i = 0; i < height; i++) {
      mineField.push(new Array(width).fill(0));
    }

    let generatedMines = 0;
    while (generatedMines < bombs) {
      // Generate a random index between 0 and available fields size
      const mineIdx = Math.floor(Math.random() * availableFields.length);

      // Set the value on generated index as mine.
      const { row, col } = this.indexToCoordinate(
        availableFields[mineIdx],
        width
      );
      mineField[row][col] = -1;

      // Increment the mine counter
      generatedMines++;

      // Remove mine index from available fields
      availableFields.splice(mineIdx, 1);

      /*
       * Increment the bomb count of the neighboring cells
       */
      if (col > 0) {
        // Left
        if (mineField[row][col - 1] !== -1) mineField[row][col - 1]++;

        // Upper Left
        if (row > 0 && mineField[row - 1][col - 1] !== -1)
          mineField[row - 1][col - 1]++;

        // Lower Left
        if (row < height - 1 && mineField[row + 1][col - 1] !== -1)
          mineField[row + 1][col - 1]++;
      }

      if (col < width - 1) {
        // Right
        if (mineField[row][col + 1] !== -1) mineField[row][col + 1]++;

        // Upper Left
        if (row > 0 && mineField[row - 1][col + 1] !== -1)
          mineField[row - 1][col + 1]++;

        // Lower Left
        if (row < height - 1 && mineField[row + 1][col + 1] !== -1)
          mineField[row + 1][col + 1]++;
      }

      // Up
      if (row > 0 && mineField[row - 1][col] !== -1) mineField[row - 1][col]++;

      // Down
      if (row < height - 1 && mineField[row + 1][col] !== -1)
        mineField[row + 1][col]++;
    }

    return mineField;
  }

  /**
   * Get the index of the initial click and its neighbors based on its coordinates
   *
   * @param row - the row of the initial click
   * @param col - the col of the initial click
   * @param width - the width
   * @param height - the height
   */
  private getInitialAndNeighborIndices(
    row: number,
    col: number,
    width: number,
    height: number
  ): number[] {
    const initialAndNeighborIndices: number[] = [];

    // Add the cell itself
    initialAndNeighborIndices.push(this.coordinateToIndex(row, col, width));

    /*
     * Upper left, left and lower left
     */
    if (col > 0) {
      initialAndNeighborIndices.push(
        this.coordinateToIndex(row, col - 1, width)
      );

      if (row > 0) {
        initialAndNeighborIndices.push(
          this.coordinateToIndex(row - 1, col - 1, width)
        );
      }

      if (row < height - 1) {
        initialAndNeighborIndices.push(
          this.coordinateToIndex(row + 1, col - 1, width)
        );
      }
    }

    /*
     * Upper right, right and lower right
     */
    if (col < width - 1) {
      initialAndNeighborIndices.push(
        this.coordinateToIndex(row, col + 1, width)
      );

      if (row > 0) {
        initialAndNeighborIndices.push(
          this.coordinateToIndex(row - 1, col + 1, width)
        );
      }

      if (row < height - 1) {
        initialAndNeighborIndices.push(
          this.coordinateToIndex(row + 1, col + 1, width)
        );
      }
    }

    // Up
    if (row > 0) {
      initialAndNeighborIndices.push(
        this.coordinateToIndex(row - 1, col, width)
      );
    }

    // Down
    if (row < height - 1) {
      initialAndNeighborIndices.push(
        this.coordinateToIndex(row + 1, col, width)
      );
    }

    return initialAndNeighborIndices;
  }

  /**
   * Converts coordinate to index
   *
   * @param row - the row
   * @param col - the col
   * @param width - the width
   */
  private coordinateToIndex(row: number, col: number, width: number): number {
    return row * width + col + 1;
  }

  /**
   * Converts index to coordinates
   *
   * @param index the index
   * @param width the width
   */
  private indexToCoordinate(index: number, width: number): Coordinates {
    const row = Math.floor((index - 1) / width);
    const col = (index - 1) % width;

    return { row: row, col: col };
  }
}

const mineHelper = new MineHelper();
export default mineHelper;
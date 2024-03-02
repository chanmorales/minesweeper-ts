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
    let availableFields: number[] = Array.from(
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
    let mineField: number[][] = [];
    for (let i = 0; i < height; i++) {
      mineField.push(new Array(width).fill(0));
    }

    let generatedMines = 0;
    while (generatedMines < bombs) {
      // Generate a random index between 0 and available fields size
      const mineIdx = Math.floor(Math.random() * availableFields.length);

      // Set the value on generated index as mine.
      const { x, y } = this.indexToCoordinate(availableFields[mineIdx], width);
      mineField[x][y] = -1;

      // Increment the mine counter
      generatedMines++;

      // Remove mine index from available fields
      availableFields.splice(mineIdx, 1);

      /*
       * Increment the bomb count of the neighboring cells
       */
      if (y > 0) {
        // Left
        if (mineField[x][y - 1] !== -1) mineField[x][y - 1]++;

        // Upper Left
        if (x > 0 && mineField[x - 1][y - 1] !== -1) mineField[x - 1][y - 1]++;

        // Lower Left
        if (x < height - 1 && mineField[x + 1][y - 1] !== -1)
          mineField[x + 1][y - 1]++;
      }

      if (y < width - 1) {
        // Right
        if (mineField[x][y + 1] !== -1) mineField[x][y + 1]++;

        // Upper Left
        if (x > 0 && mineField[x - 1][y + 1] !== -1) mineField[x - 1][y + 1]++;

        // Lower Left
        if (x < height - 1 && mineField[x + 1][y + 1] !== -1)
          mineField[x + 1][y + 1]++;
      }

      // Up
      if (x > 0 && mineField[x - 1][y] !== -1) mineField[x - 1][y]++;

      // Down
      if (x < height - 1 && mineField[x + 1][y] !== -1) mineField[x + 1][y]++;
    }

    return mineField;
  }

  /**
   * Get the index of the initial click and its neighbors based on its coordinates
   *
   * @param x - the x-coordinate of the initial click
   * @param y - the y-coordinate of the initial click
   * @param width - the width
   * @param height - the height
   */
  private getInitialAndNeighborIndices(
    x: number,
    y: number,
    width: number,
    height: number
  ): number[] {
    let initialAndNeighborIndices: number[] = [];

    // Add the cell itself
    initialAndNeighborIndices.push(this.coordinateToIndex(x, y, width));

    /*
     * Upper left, left and lower left
     */
    if (y > 0) {
      initialAndNeighborIndices.push(this.coordinateToIndex(x, y - 1, width));

      if (x > 0) {
        initialAndNeighborIndices.push(
          this.coordinateToIndex(x - 1, y - 1, width)
        );
      }

      if (x < height - 1) {
        initialAndNeighborIndices.push(
          this.coordinateToIndex(x + 1, y - 1, width)
        );
      }
    }

    /*
     * Upper right, right and lower right
     */
    if (y < width - 1) {
      initialAndNeighborIndices.push(this.coordinateToIndex(x, y + 1, width));

      if (x > 0) {
        initialAndNeighborIndices.push(
          this.coordinateToIndex(x - 1, y + 1, width)
        );
      }

      if (x < height - 1) {
        initialAndNeighborIndices.push(
          this.coordinateToIndex(x + 1, y + 1, width)
        );
      }
    }

    // Up
    if (x > 0) {
      initialAndNeighborIndices.push(this.coordinateToIndex(x - 1, y, width));
    }

    // Down
    if (x < height - 1) {
      initialAndNeighborIndices.push(this.coordinateToIndex(x + 1, y, width));
    }

    return initialAndNeighborIndices;
  }

  /**
   * Converts coordinate to index
   *
   * @param x - the x-coordinate
   * @param y - the y-coordinate
   * @param width - the width
   */
  private coordinateToIndex(x: number, y: number, width: number): number {
    return x * width + y + 1;
  }

  /**
   * Converts index to coordinates
   *
   * @param index the index
   * @param width the width
   */
  private indexToCoordinate(index: number, width: number): Coordinates {
    const x = Math.floor((index - 1) / width);
    const y = (index - 1) % width;

    return { x, y };
  }
}

const mineHelper = new MineHelper();
export default mineHelper;
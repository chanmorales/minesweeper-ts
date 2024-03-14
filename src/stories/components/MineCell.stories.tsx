import MineCell from "../../components/MineCell";
import { Meta, StoryObj } from "@storybook/react";
import { FieldState } from "../../types/Game";
import { MineFieldContext } from "../../store/MineFieldStore";

interface MineCellMeta {
  bombs: number;
  fieldState: FieldState;
}

const meta: Meta<MineCellMeta> = {
  title: "Component/Mine Cell",
  render: ({ bombs, fieldState }) => {
    return (
      <div
        style={{
          backgroundColor: "#282c34",
          padding: "5px",
          width: "fit-content",
        }}>
        <MineFieldContext.Provider
          value={{
            state: {
              mineField: [[bombs]],
              fieldState: [[fieldState]],
              flagCount: 0,
            },
            dispatch: () => console.log("dispatch"),
          }}>
          <MineCell
            x={0}
            y={0}
            onExplore={() => console.log("Explored...")}
            onUpdateFlag={() => console.log("Flagged / Unflagged...")}
          />
        </MineFieldContext.Provider>
      </div>
    );
  },
  args: {
    bombs: 0,
    fieldState: FieldState.UNEXPLORED,
  },
  argTypes: {
    fieldState: {
      options: [0, 1, 2],
      control: {
        type: "select",
        labels: ["Unexplored", "Flagged", "Opened"],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

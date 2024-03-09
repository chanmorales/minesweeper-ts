import MineCell from "../../components/MineCell";
import { Meta, StoryObj } from "@storybook/react";
import { FieldState } from "../../types/Game";

interface MineCellMeta {
  bombs: number;
  fieldState: FieldState;
}

const meta: Meta<MineCellMeta> = {
  title: "Component/Mine Cell",
  render: ({ bombs, fieldState }) => (
    <div
      style={{
        backgroundColor: "#282c34",
        padding: "5px",
        width: "fit-content",
      }}>
      <MineCell
        x={0}
        y={0}
        bombs={bombs}
        fieldState={fieldState}
        onExplore={() => console.log("Explored...")}
        onUpdateFlag={() => console.log("Flagged / Unflagged...")}
      />
    </div>
  ),
  args: {
    bombs: 0,
    fieldState: FieldState.UNEXPLORED,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
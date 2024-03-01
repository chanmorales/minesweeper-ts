import MineCell from "../../components/MineCell";
import { Meta, StoryObj } from "@storybook/react";

interface MineCellMeta {
  bombs: number;
}

const meta: Meta<MineCellMeta> = {
  title: "Component/Mine Cell",
  render: ({ bombs }) => (
    <div
      style={{
        backgroundColor: "#282c34",
        padding: "5px",
        width: "fit-content",
      }}>
      <MineCell bombs={bombs} />
    </div>
  ),
  args: {
    bombs: 0,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
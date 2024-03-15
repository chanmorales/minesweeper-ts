import { Meta, StoryObj } from "@storybook/react";
import GameOverDialog from "../../components/dialogs/GameOverDialog";
import { Button } from "antd";
import { useState } from "react";
import "antd/es/style/";

interface GameOverDialogMeta {
  isExploded: boolean;
}

const meta: Meta<GameOverDialogMeta> = {
  title: "Common/Dialog/Game Over",
  render: ({ isExploded }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Game Over</Button>
        <GameOverDialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          isExploded={isExploded}
        />
      </>
    );
  },
  args: {
    isExploded: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

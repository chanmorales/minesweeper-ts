import { Meta, StoryObj } from "@storybook/react";
import SelectGameDifficultyDialog from "../../components/dialogs/SelectGameDifficultyDialog";
import { useState } from "react";
import { Button } from "antd";

const meta: Meta = {
  title: "Common/Dialog/Select Game Difficulty",
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Select Difficulty</Button>
        <SelectGameDifficultyDialog
          open={isOpen}
          onDifficultySelect={() => {
            console.log("difficulty selected");
            setIsOpen(false);
          }}
        />
      </>
    );
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

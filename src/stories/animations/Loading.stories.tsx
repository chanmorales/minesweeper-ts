import { Meta, StoryObj } from "@storybook/react";
import Loading from "../../common/animations/Loading";

const meta: Meta = {
  title: "Animations/Loading",
  render: () => <Loading />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

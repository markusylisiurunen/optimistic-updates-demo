import { Box, Button, Card, Flex, Heading, IconButton, Select, Switch, Text, TextField } from "@radix-ui/themes";
import { X } from "lucide-react";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import {
  createBubbleAction,
  createColorAction,
  deleteBubbleAction,
  deleteColorAction,
  setBubbleColorIdAction,
  setBubbleDescriptionAction,
  setBubbleSizeAction,
  setColorColorAction,
  setColorNameAction,
} from "./actions";
import {
  useAPI,
  useBlockingExecuteAction,
  useInputExecuteAction,
  useObjectPool,
  useOptimisticExecuteAction,
  useRequestDataOnMount,
} from "./hooks";
import { BubbleModel, ColorModel, TeamModel } from "./models";

type ColorProps = { color: ColorModel };
const _Color: React.FC<ColorProps> = ({ color }) => {
  const deleteColor = useOptimisticExecuteAction(deleteColorAction);
  const setColor = useInputExecuteAction(setColorColorAction, color.color, (value) => [color, value]);
  const setName = useInputExecuteAction(setColorNameAction, color.name, (value) => [color, value]);
  return (
    <Flex align="center" gap="2">
      <Box width="6" height="6" style={{ background: color.color, borderRadius: "var(--radius-2)" }} />
      <TextField.Input {...setColor.getInputProps()} />
      <Box grow="1">
        <TextField.Input {...setName.getInputProps()} />
      </Box>
      <IconButton
        variant="surface"
        color="gray"
        onClick={() => {
          deleteColor.execute(color);
        }}
      >
        <X size="16" />
      </IconButton>
    </Flex>
  );
};
const Color = observer(_Color);

type AddColorProps = { team: TeamModel };
const _AddColor: React.FC<AddColorProps> = ({ team }) => {
  const createColor = useOptimisticExecuteAction(createColorAction);
  const { register, handleSubmit } = useForm<{ color: string; name: string }>();
  return (
    <>
      <Heading size="3" weight="medium" mt="4" mb="2">
        Add color
      </Heading>
      <Flex gap="2">
        <TextField.Input {...register("color", { required: true, pattern: /^#[0-9a-f]{6}$/i })} placeholder="#ffd700" />
        <Box grow="1">
          <TextField.Input {...register("name", { required: true })} placeholder="Tangerine Tango" />
        </Box>
        <Button
          onClick={handleSubmit((data) => {
            createColor.execute({
              id: crypto.randomUUID(),
              teamId: team.id,
              name: data.name,
              color: data.color,
            });
          })}
        >
          Add color
        </Button>
      </Flex>
    </>
  );
};
const AddColor = observer(_AddColor);

type ColorListProps = { team: TeamModel };
const _ColorList: React.FC<ColorListProps> = ({ team }) => {
  return (
    <Card>
      <Heading weight="medium" mb="3">
        Colors
      </Heading>
      <Flex direction="column" gap="2">
        {Array.from(team.colors)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((color) => (
            <Color color={color} key={color.id} />
          ))}
      </Flex>
      <AddColor team={team} />
    </Card>
  );
};
const ColorList = observer(_ColorList);

type BubbleProps = { bubble: BubbleModel };
const _Bubble: React.FC<BubbleProps> = ({ bubble }) => {
  const deleteBubble = useOptimisticExecuteAction(deleteBubbleAction);
  const setColorId = useOptimisticExecuteAction(setBubbleColorIdAction);
  const setSize = useOptimisticExecuteAction(setBubbleSizeAction);
  const setDescription = useInputExecuteAction(setBubbleDescriptionAction, bubble.description, (value) => [
    bubble,
    value,
  ]);
  return (
    <Flex align="center" gap="2">
      <Flex justify="center" style={{ width: "56px" }}>
        <Box
          style={{
            background: bubble.color.color,
            borderRadius: "9999px",
            ...(bubble.size === "s"
              ? { width: "24px", height: "24px" }
              : bubble.size === "m"
              ? { width: "40px", height: "40px" }
              : bubble.size === "l"
              ? { width: "56px", height: "56px" }
              : null),
          }}
        />
      </Flex>
      <Select.Root
        value={bubble.colorId}
        onValueChange={(value) => {
          setColorId.execute(bubble, value);
        }}
      >
        <Select.Trigger />
        <Select.Content>
          {bubble.team.colors.map((color) => (
            <Select.Item value={color.id} key={color.id}>
              {color.name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Select.Root
        value={bubble.size}
        onValueChange={(value) => {
          if (value === "s" || value === "m" || value === "l") {
            setSize.execute(bubble, value);
          }
        }}
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="s">Small</Select.Item>
          <Select.Item value="m">Medium</Select.Item>
          <Select.Item value="l">Large</Select.Item>
        </Select.Content>
      </Select.Root>
      <Box grow="1">
        <TextField.Input {...setDescription.getInputProps()} />
      </Box>
      <IconButton
        variant="surface"
        color="gray"
        onClick={() => {
          deleteBubble.execute(bubble);
        }}
      >
        <X size="16" />
      </IconButton>
    </Flex>
  );
};
const Bubble = observer(_Bubble);

type AddBubbleProps = { team: TeamModel };
const _AddBubble: React.FC<AddBubbleProps> = ({ team }) => {
  const createBubble = useBlockingExecuteAction(createBubbleAction);
  const { register, setValue, watch, handleSubmit } = useForm<{
    colorId: string;
    size: "s" | "m" | "l";
    description: string;
  }>({ defaultValues: { colorId: team.colors[0]?.id, size: "m" } });
  useEffect(() => {
    register("colorId", { required: true });
    register("size", { required: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Heading size="3" weight="medium" mt="4" mb="2">
        Add bubble
      </Heading>
      <Flex gap="2">
        <Select.Root value={watch("colorId")} onValueChange={(value) => setValue("colorId", value)}>
          <Select.Trigger />
          <Select.Content>
            {team.colors.map((color) => (
              <Select.Item value={color.id} key={color.id}>
                {color.name}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Select.Root value={watch("size")} onValueChange={(value) => setValue("size", value as "s" | "m" | "l")}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="s">Small</Select.Item>
            <Select.Item value="m">Medium</Select.Item>
            <Select.Item value="l">Large</Select.Item>
          </Select.Content>
        </Select.Root>
        <Box grow="1">
          <TextField.Input {...register("description", { required: true })} placeholder="Jot some thoughts down..." />
        </Box>
        <Button
          disabled={!createBubble.isIdle}
          onClick={handleSubmit(async (data) => {
            await createBubble.execute({
              id: crypto.randomUUID(),
              teamId: team.id,
              colorId: data.colorId,
              createdAt: new Date().toISOString(),
              description: data.description,
              size: data.size,
            });
          })}
        >
          Add bubble
        </Button>
      </Flex>
    </>
  );
};
const AddBubble = observer(_AddBubble);

type BubbleListProps = { team: TeamModel };
const _BubbleList: React.FC<BubbleListProps> = ({ team }) => {
  return (
    <Card>
      <Heading weight="medium" mb="3">
        Bubbles
      </Heading>
      <Flex direction="column" gap="2">
        {Array.from(team.bubbles)
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
          .map((bubble) => (
            <Bubble bubble={bubble} key={bubble.id} />
          ))}
      </Flex>
      <AddBubble team={team} />
    </Card>
  );
};
const BubbleList = observer(_BubbleList);

type ErrorRateSwitchProps = Record<string, never>;
const ErrorRateSwitch: React.FC<ErrorRateSwitchProps> = () => {
  const api = useAPI();
  const [emulated, setEmulated] = React.useState(api._getEmulatedErrors());
  return (
    <Switch
      checked={emulated}
      onCheckedChange={(checked) => {
        api._setEmulatedErrors(checked);
        setEmulated(checked);
      }}
    />
  );
};

type AppProps = Record<string, never>;
const _App: React.FC<AppProps> = () => {
  useRequestDataOnMount("bootstrap");
  const team = Array.from(useObjectPool().teams.all)[0] ?? null;
  if (!team) {
    return null;
  }
  return (
    <>
      <Toaster />
      <Flex
        direction="column"
        align="stretch"
        gap="4"
        mx="auto"
        px="4"
        style={{ maxWidth: "800px", paddingBlock: "var(--space-6) 50dvh", width: "100%" }}
      >
        <Card>
          <Flex align="stretch" direction="column" gap="3" width="100%">
            <Flex align="center" justify="between">
              <Text>Clear stored state</Text>
              <Button
                variant="surface"
                color="gray"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                Clear
              </Button>
            </Flex>
            <Flex align="center" justify="between">
              <Text>Emulate failing mutations</Text>
              <ErrorRateSwitch />
            </Flex>
          </Flex>
        </Card>
        <ColorList team={team} />
        <BubbleList team={team} />
      </Flex>
    </>
  );
};
const App = observer(_App);

export { App };

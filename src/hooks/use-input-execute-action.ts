import { TextField } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Action } from "../actions";
import { useOptimisticExecuteAction } from "./use-optimistic-execute-action";

function useInputExecuteAction<A extends readonly [] | readonly unknown[], R>(
  action: Action<A, R>,
  value: string,
  valueToArgs: (value: string) => A,
) {
  const _action = useOptimisticExecuteAction(action);
  // hold the internal representation of the value
  const [_value, _setValue] = useState(value);
  useEffect(() => _setValue(value), [value]);
  function getInputProps(props?: Partial<React.ComponentPropsWithoutRef<typeof TextField.Input>>) {
    return {
      ...props,
      value: _value,
      onChange: (event) => _setValue(event.target.value),
      onBlur: () => _action.execute(...valueToArgs(_value)),
    } satisfies React.ComponentPropsWithoutRef<typeof TextField.Input>;
  }
  return { getInputProps };
}

export { useInputExecuteAction };

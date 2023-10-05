import { produce } from "immer";
import {
  CreateBubbleMutation,
  CreateColorMutation,
  DeleteBubbleMutation,
  DeleteColorMutation,
  UpdateBubbleMutation,
  UpdateColorMutation,
} from "./mutations";

type RemoteState = {
  teams: {
    id: string;
    name: string;
    colors: {
      id: string;
      name: string;
      color: string;
    }[];
    bubbles: {
      id: string;
      colorId: string;
      createdAt: string;
      description: string;
      size: "s" | "m" | "l";
    }[];
  }[];
};

// storage providers
// ---

interface StorageProvider {
  load(): RemoteState;
  save(state: RemoteState): void;
}

function makeLocalStorageProvider(): StorageProvider {
  function getInitialState(): RemoteState {
    const privateId = crypto.randomUUID();
    const limeId = crypto.randomUUID();
    const yellowId = crypto.randomUUID();
    const pinkId = crypto.randomUUID();
    return {
      teams: [
        {
          id: privateId,
          name: "Private",
          colors: [
            { id: limeId, name: "Mojito Minuet", color: "#44ff00" },
            { id: yellowId, name: "Buttercream Bliss", color: "#ffffaa" },
            { id: pinkId, name: "Bubblegum Ballet", color: "#fc3096" },
          ],
          bubbles: [
            {
              id: crypto.randomUUID(),
              colorId: pinkId,
              createdAt: "2023-09-21T10:20:00Z",
              description: "Dancing on a cloud of cotton candy thoughts. 💭",
              size: "m",
            },
            {
              id: crypto.randomUUID(),
              colorId: limeId,
              createdAt: "2023-09-22T12:17:00Z",
              description: "Swaying to the rhythm of zesty dreams and minty moods. 🍃",
              size: "l",
            },
          ],
        },
      ],
    };
  }
  return {
    load() {
      let state: RemoteState | null = null;
      // attempt to read it from local storage first
      const _state = localStorage.getItem("__state");
      if (_state) {
        state = JSON.parse(_state) as RemoteState;
      }
      // otherwise, use initial state
      if (!state) {
        state = getInitialState();
        this.save(state);
      }
      return state;
    },
    save(state) {
      localStorage.setItem("__state", JSON.stringify(state));
    },
  };
}

// API implementation
// ---

type AnyMutation =
  | CreateBubbleMutation
  | CreateColorMutation
  | DeleteBubbleMutation
  | DeleteColorMutation
  | UpdateBubbleMutation
  | UpdateColorMutation;

interface API {
  _getEmulatedErrors(): boolean;
  _setEmulatedErrors(emulate: boolean): void;
  bootstrap(): Promise<RemoteState>;
  mutate(mutation: AnyMutation): Promise<void>;
}

function makeAPI(): API {
  const EMULATED_ERROR_RATE = 0.5;
  let errorRate = 0;
  function log(message: string) {
    console.log(`[API] ${new Date().toISOString()}: ${message}`);
  }
  async function sleep(min: number, max: number) {
    await new Promise<void>((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));
  }
  const storage = makeLocalStorageProvider();
  return {
    _getEmulatedErrors() {
      return errorRate > 0;
    },
    _setEmulatedErrors(emulate) {
      errorRate = emulate ? EMULATED_ERROR_RATE : 0;
    },
    async bootstrap() {
      await sleep(100, 500);
      return storage.load();
    },
    async mutate(mutation: AnyMutation) {
      log(`applying a '${mutation.type}' mutation...`);
      await sleep(100, 500);
      if (Math.random() < errorRate) {
        log(`an emulated error happened!`);
        throw new Error("oh no, something went wrong :(");
      }
      log(`mutation for '${mutation.type}' applied!`);
      storage.save(
        produce(storage.load(), (draft) => {
          switch (mutation.type) {
            case "create_bubble": {
              const team = draft.teams.find((t) => t.id === mutation.data.teamId);
              if (!team) break;
              team.bubbles.push({
                id: mutation.data.id,
                colorId: mutation.data.colorId,
                createdAt: mutation.data.createdAt,
                description: mutation.data.description,
                size: mutation.data.size,
              });
              break;
            }
            case "create_color": {
              const team = draft.teams.find((t) => t.id === mutation.data.teamId);
              if (!team) break;
              team.colors.push({
                id: mutation.data.id,
                name: mutation.data.name,
                color: mutation.data.color,
              });
              break;
            }
            case "delete_bubble": {
              const team = draft.teams.find((t) => t.bubbles.some((b) => b.id === mutation.data.id));
              if (!team) break;
              team.bubbles = team.bubbles.filter((b) => b.id !== mutation.data.id);
              break;
            }
            case "delete_color": {
              const team = draft.teams.find((t) => t.colors.some((b) => b.id === mutation.data.id));
              if (!team) break;
              team.colors = team.colors.filter((c) => c.id !== mutation.data.id);
              team.bubbles.forEach((b) => {
                if (b.colorId === mutation.data.id) {
                  b.colorId = mutation.data.swapId;
                }
              });
              break;
            }
            case "update_bubble": {
              const team = draft.teams.find((t) => t.bubbles.some((b) => b.id === mutation.data.id));
              if (!team) break;
              const bubble = team.bubbles.find((b) => b.id === mutation.data.id);
              if (!bubble) break;
              if (mutation.data.colorId) {
                bubble.colorId = mutation.data.colorId;
              }
              if (mutation.data.description) {
                bubble.description = mutation.data.description;
              }
              if (mutation.data.size) {
                bubble.size = mutation.data.size;
              }
              break;
            }
            case "update_color": {
              const team = draft.teams.find((t) => t.colors.some((b) => b.id === mutation.data.id));
              if (!team) break;
              const color = team.colors.find((c) => c.id === mutation.data.id);
              if (!color) break;
              if (mutation.data.name) {
                color.name = mutation.data.name;
              }
              if (mutation.data.color) {
                color.color = mutation.data.color;
              }
              break;
            }
            default:
              break;
          }
        }),
      );
    },
  };
}

export { makeAPI, type API };

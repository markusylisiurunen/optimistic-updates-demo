import { API } from "../api";
import { BubbleModel, ColorModel, Model, ObjectPool, TeamModel } from "../models";
import { assertNever } from "../util";

type _DataRequest<Name extends string, Opts extends Record<string, unknown> = Record<string, never>> = {
  name: Name;
  opts: Opts;
};

// define the types for data requests
type BootstrapRequest = _DataRequest<"bootstrap">;
type ExampleRequest = _DataRequest<"examples", { limit?: number }>;

// define the data loader itself
type DataRequest = BootstrapRequest | ExampleRequest;

class DataLoader {
  private api: API;
  private pool: ObjectPool;

  constructor(api: API, pool: ObjectPool) {
    this.api = api;
    this.pool = pool;
  }

  public async request<T extends DataRequest["name"]>(
    ...args: Record<string, never> extends Extract<DataRequest, { name: T }>["opts"]
      ? readonly [T] | readonly [T, Extract<DataRequest, { name: T }>["opts"]]
      : readonly [T, Extract<DataRequest, { name: T }>["opts"]]
  ) {
    switch (args[0]) {
      case "bootstrap":
        return this.handleBootstrapRequest();
      case "examples":
        return;
      default:
        assertNever(args[0]);
    }
  }

  private async handleBootstrapRequest() {
    // collect all the models here first
    const models: Model[] = [];
    // get the bootstrap state from the API
    const remoteState = await this.api.bootstrap();
    for (const remoteTeam of remoteState.teams) {
      models.push(
        new TeamModel({
          id: remoteTeam.id,
          name: remoteTeam.name,
        }),
      );
      for (const remoteColor of remoteTeam.colors) {
        models.push(
          new ColorModel({
            id: remoteColor.id,
            teamId: remoteTeam.id,
            name: remoteColor.name,
            color: remoteColor.color,
          }),
        );
      }
      for (const remoteBubble of remoteTeam.bubbles) {
        models.push(
          new BubbleModel({
            id: remoteBubble.id,
            teamId: remoteTeam.id,
            colorId: remoteBubble.colorId,
            createdAt: remoteBubble.createdAt,
            description: remoteBubble.description,
            size: remoteBubble.size,
          }),
        );
      }
    }
    this.pool.replace(...models);
  }
}

export { DataLoader, type DataRequest };

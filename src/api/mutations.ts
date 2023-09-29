type Mutation<Type extends string, Data> = { type: Type; data: Data };

type CreateBubbleMutation = Mutation<
  "create_bubble",
  {
    id: string;
    teamId: string;
    colorId: string;
    createdAt: string;
    description: string;
    size: "s" | "m" | "l";
  }
>;

type DeleteBubbleMutation = Mutation<
  "delete_bubble",
  {
    id: string;
  }
>;

type UpdateBubbleMutation = Mutation<
  "update_bubble",
  {
    id: string;
    colorId?: string;
    description?: string;
    size?: "s" | "m" | "l";
  }
>;

type CreateColorMutation = Mutation<
  "create_color",
  {
    id: string;
    teamId: string;
    name: string;
    color: string;
  }
>;

type DeleteColorMutation = Mutation<
  "delete_color",
  {
    id: string;
    swapId: string;
  }
>;

type UpdateColorMutation = Mutation<
  "update_color",
  {
    id: string;
    name?: string;
    color?: string;
  }
>;

export {
  type CreateBubbleMutation,
  type CreateColorMutation,
  type DeleteBubbleMutation,
  type DeleteColorMutation,
  type UpdateBubbleMutation,
  type UpdateColorMutation,
};

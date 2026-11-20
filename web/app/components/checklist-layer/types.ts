export type ChecklistItem = {
  n: number;
  text: string;
  where: string;
  shown: boolean;
  met?: boolean;
};

export type ChecklistGroup = {
  title: string;
  items: ChecklistItem[];
};

export type ChecklistData = {
  title: string;
  note: string;
  groups: ChecklistGroup[];
};

export type ChecklistItem = {
  n: number;
  text: string;
  where: string;
  shown: boolean;
  // Rail line when the item is unticked: finishes "Visitors would see: ..."
  broken?: string;
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

export const ContextMenuEventType = {
  TABS: 'TABS',
  CONTENT: 'CONTENT',
} as const;
export type ContextMenuEventType = typeof ContextMenuEventType[keyof typeof ContextMenuEventType];

export type ContextMenuTabsParams = {
  type: typeof ContextMenuEventType.TABS,
};

export type ContextMenuContentParams = {
  type: typeof ContextMenuEventType.CONTENT,
  linkUrl: string,
  tabId: string,
};

export type ContextMenuParams =
  ContextMenuTabsParams |
  ContextMenuContentParams;

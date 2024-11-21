import { switchToLocalhost } from "./cookies/cookies";

export enum ContextMenusID {
  BAIBAODAI_CONTEXT_MENUS = 'BAIBAODAI_CONTEXT_MENUS',
  COOKIE_LOCALHOST = 'COOKIE_LOCALHOST',
  CLEAR_CURRENT_ORIGIN_HISTORY = 'CLEAR_CURRENT_ORIGIN_HISTORY'
}

// chrome.contextMenus.create({
//   id: ContextMenusID.BAIBAODAI_CONTEXT_MENUS,
//   title: '百宝袋',
//   contexts: ['all'],
//   type: 'normal',
// });

chrome.contextMenus.create({
  id: ContextMenusID.COOKIE_LOCALHOST,
  title: '切换cookie至localhost',
  contexts: ['all'],
  type: 'normal',
  // parentId: ContextMenusID.BAIBAODAI_CONTEXT_MENUS
});



chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log(info, tab);
  const contextMenusID = info.menuItemId as ContextMenusID
  const url = new URL(tab?.url || '');

  switch (contextMenusID) {
    case ContextMenusID.COOKIE_LOCALHOST:
      console.log('contextMenusID:', contextMenusID);

      switchToLocalhost(url.hostname)
      break;
    default:
      break;
  }
});

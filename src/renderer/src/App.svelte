<script lang="ts">
  import { randomUUID } from "./util"
  import { debounce } from '../../util';
  import type { LoadOptions, Tab } from '../../types/tabs';

  let tabList = $state<Tab[]>([
    {
      id: randomUUID(),
      url: 'https://electron-vite.org',
      title: '',
    },
    {
      id: randomUUID(),
      url: 'https://google.com',
      title: '',
    },
  ]);

  let tabIdx = $state(0);

  function activateTab(idx: number): void {
    const { id } = tabList[idx];
    const payload: LoadOptions = {
      visible: true,
    };
    window.electron.ipcRenderer.send('load-url', id, payload);
  }

  function loadUrl({ id, url }: Tab): void {
    const payload: LoadOptions = {
      url,
    };
    window.electron.ipcRenderer.send('load-url', id, payload);
  }

  window.electron.ipcRenderer.once('init', () => {
    tabList.forEach((data) => {
      loadUrl(data);
    });
    activateTab(tabIdx);
  });

  function getTabById(id: string): Tab {
    const tab = tabList.find((tab) => tab.id === id);
    if (!tab) throw new Error('Tab not found');
    return tab;
  }

  window.electron.ipcRenderer.on('page-title-updated', (_, { id, title }) => {
    getTabById(id).title = title;
  });
  window.electron.ipcRenderer.on('will-navigate', (_, { id, url }) => {
    getTabById(id).url = url;
  });
  window.electron.ipcRenderer.on('did-start-navigation', (_, { id, url }) => {
    getTabById(id).url = url;
  });

  const debounceActivate = debounce(activateTab, 0);

  $effect(() => debounceActivate(tabIdx));
</script>

<div class="h-10 *:h-full [&>div]:border-base-300 gap-2">
  <div class="h-5 w-full tabs tabs-lift">
    {#each tabList as tab, idx (tab.id)}
      <input
        bind:group={tabIdx}
        type="radio"
        name="browser-tab"
        class="checked:bg-base-300 not-checked:bg-base-200 tab min-w-58 max-w-48 w-48 whitespace-nowrap overflow-clip justify-start"
        aria-label={tab.title}
        value={idx}
      >
    {/each}
    <div class="tab"></div>
  </div>
  <div class="h-5 w-full flex gap-2">
    <input type="text" class="input w-full" bind:value={tabList[tabIdx].url}>
    <button class="btn btn-primary" onclick={() => loadUrl(tabList[tabIdx])}>Load</button>
  </div>
</div>

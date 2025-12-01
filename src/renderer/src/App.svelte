<script lang="ts">
  import { untrack } from "svelte"
  import Cross from 'virtual:icons/maki/cross'
  import AddBold from 'virtual:icons/mdi/add-bold'
  import type { LoadOptions, Tab } from '../../types/tabs'
  import { clamp } from '../../util'
  import { randomUUID } from "./util"

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
    untrack(() => {
      if (tabList.length === 0 || tabList.length < idx) {
        return;
      }
      const { id } = tabList[idx];
      const payload: LoadOptions = {
        visible: true,
      };
      window.electron.ipcRenderer.send('load-tab', id, payload);
    });
  }

  function loadUrl({ id, url }: Tab): void {
    const payload: LoadOptions = {
      url,
    };
    window.electron.ipcRenderer.send('load-tab', id, payload);
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

  $effect(() => activateTab(tabIdx));

  function addTab(): void {
    const newTab: Tab = {
      id: randomUUID(),
      url: 'https://google.com',
      title: '',
    };
    loadUrl(newTab);
    tabList = [
      ...tabList,
      newTab,
    ];
    tabIdx = tabList.length - 1;
  }

  function removeTabByIdx(idx: number): void {
    const { id } = tabList[idx];
    tabList = tabList.filter((_, i) => i !== idx);
    window.electron.ipcRenderer.send('close-tab', id);
    tabIdx = clamp(idx - 1, 0, tabList.length - 1);
  }
</script>

<div class="h-10 *:h-full [&>div]:border-base-300 gap-2">
  <div class="h-5 w-full tabs tabs-lift">
    {#each tabList as tab, idx (tab.id)}
      <label class="tab min-w-58 max-w-48 w-48 whitespace-nowrap justify-start overflow-clip">
        <input
          bind:group={tabIdx}
          type="radio"
          name="browser-tab"
          class="checked:bg-base-300 not-checked:bg-base-200"
          value={idx}
        >
        <span>
          {tab.title}
        </span>
        <button class="btn absolute right-0 m-2 p-1 w-5 h-5"
          onclick={() => removeTabByIdx(idx)}
        >
          <Cross/>
        </button>
      </label>
    {/each}
    <button class="btn btn-secondary"
      onclick={addTab}
    >
      <AddBold/>
    </button>
    <div class="tab"></div>
  </div>
  <div class="h-5 w-full flex gap-2">
    {#if tabList.length > 0}
      <input type="text" class="input w-full" bind:value={tabList[tabIdx].url}>
    {:else}
      <input type="text" class="input w-full">
    {/if}
    <button class="btn btn-primary" onclick={() => loadUrl(tabList[tabIdx])}>Load</button>
  </div>
</div>

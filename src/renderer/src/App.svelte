<script lang="ts">
  import { randomUUID } from "./util"

  let urlList = $state<[string, string][]>([
    [randomUUID(), 'https://electron-vite.org'],
    [randomUUID(), 'https://google.com'],
  ]);

  function loadBase(newUrl: string): void {
    console.log('Loading URL:', newUrl);
    window.electron.ipcRenderer.send('load-url', newUrl);
  }

  const load = (): void => loadBase(url);

  let url = $state(urlList[0][1]);
  let tabIdx = $state(0);

  $inspect({ url });
</script>

<div class="h-12 *:h-full [&>div]:border-base-300 gap-2">
  <div class="h-6 w-full tabs tabs-lift">
    {#each urlList as item, idx (item[0])}
      <input
        bind:group={tabIdx}
        type="radio"
        name="browser-tab"
        class="tab"
        aria-label={item[1]}
        value={idx}
      >
    {/each}
    <div class="tab"></div>
  </div>
  <div class="h-6 w-full">
    <input type="text" class="input w-full" bind:value={urlList[tabIdx][1]}>
  </div>
</div>

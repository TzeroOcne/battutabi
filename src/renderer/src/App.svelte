<script lang="ts">
  let url = $state('https://electron-vite.org');

  function loadBase(newUrl: string): void {
    console.log('Loading URL:', newUrl);
    window.electron.ipcRenderer.send('load-url', newUrl);
  }

  const load = (): void => loadBase(url);
</script>

<div class="h-8 flex *:h-full gap-2 mx-2">
  <input type="text" class="input w-full" bind:value={url}>
  <button class="btn btn-primary" onclick={load}>Load</button>
</div>

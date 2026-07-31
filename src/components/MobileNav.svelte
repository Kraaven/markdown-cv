<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { fade } from 'svelte/transition';

  export let sections = [];

  let navItems = [];
  let open = false;

  onMount(async () => {
    await tick();

    navItems = sections.map(({ id }) => {
      const el = document.getElementById(id);
      const heading = el?.querySelector('h2');

      return {
        id,
        label: heading ? heading.textContent.trim() : id,
      };
    });

    window.addEventListener('click', onWindowClick);
    window.addEventListener('keydown', onKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('click', onWindowClick);
    window.removeEventListener('keydown', onKeydown);
  });

  function toggle() {
    open = !open;
  }

  function goTo(id) {
    open = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  function onWindowClick(e) {
    if (!open) return;
    if (!e.target.closest('.mobile-nav')) open = false;
  }

  function onKeydown(e) {
    if (e.key === 'Escape') open = false;
  }
</script>

<div class="mobile-nav">
  <button
    class="toggle"
    class:open
    on:click={toggle}
    aria-label={open ? 'Close navigation' : 'Open navigation'}
    aria-expanded={open}
  >
    {#if open}
      <span class="esc" transition:fade={{ duration: 120 }}>
        <span class="bracket">[</span>Esc<span class="bracket">]</span>
      </span>
    {:else}
      <span class="bars">
        <span></span>
        <span></span>
        <span></span>
      </span>
    {/if}
  </button>

  {#if open}
    <nav class="tray">
      {#each navItems as item, i (item.id)}
        <button
          class="tray-item"
          on:click={() => goTo(item.id)}
          in:fade={{ duration: 150, delay: i * 40 }}
          out:fade={{ duration: 100 }}
        >
          <span class="mark">-</span>{item.label}
        </button>
      {/each}
    </nav>
  {/if}
</div>

<style lang="scss">
  @import '../styles/theme.scss';

  .mobile-nav {
    display: none;
  }

  .toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5em;
    position: fixed;
    right: 1.2em;
    top: 5.2em;
    z-index: 999;
  }

  .bars {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .bars span {
    background-color: $text-color;
    display: block;
    height: 2px;
    transition: background-color 0.2s;
    width: 18px;
  }

  .toggle:hover .bars span,
  .toggle.open .bars span {
    background-color: $heading-color;
  }
  
@media (hover: hover) {
  .toggle:hover .bars span {
    background-color: $heading-color;
  }
}
  .esc {
    color: $heading-color;
    font-family: $font-family-monospace;
    font-size: 0.9em;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .esc .bracket {
    color: $link-color;
  }

  .tray {
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 1.2em;
    top: 8.4em;
    width: max-content;
    z-index: 998;
  }

  .tray-item {
    background: none;
    border: none;
    color: $text-color;
    cursor: pointer;
    font-family: $font-family-monospace;
    font-size: 0.8em;
    font-weight: 400;
    letter-spacing: 0.12em;
    line-height: 2.2;
    opacity: 0.75;
    padding: 0;
    text-align: right;
    text-transform: uppercase;
    transition: color 0.15s, opacity 0.15s;
  }

  .tray-item .mark {
    color: $list-color;
    margin-right: 0.5em;
    opacity: 0.7;
    transition: color 0.15s, opacity 0.15s;
  }

  .tray-item:hover {
    color: $string-color;
    opacity: 1;
  }

  .tray-item:hover .mark {
    color: $string-color;
    opacity: 1;
  }

  @media screen and (max-width: 700px) {
    .mobile-nav {
      display: block;
    }
  }
</style>
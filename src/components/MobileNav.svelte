<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

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
    class="hamburger"
    class:open
    on:click={toggle}
    aria-label="Toggle navigation"
    aria-expanded={open}
  >
    <span></span>
    <span></span>
    <span></span>
  </button>

  {#if open}
    <nav class="tray" transition:fly={{ y: -10, duration: 200, easing: quintOut }}>
      {#each navItems as item, i (item.id)}
        <button
          class="tray-item"
          on:click={() => goTo(item.id)}
          in:fade={{ duration: 150, delay: i * 40 }}
        >
          {item.label}
          <span class="prompt">#</span>
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

.hamburger {
    align-items: center;
    background-color: lighten($background-color, 6%);
    border: 1px solid lighten($background-color, 15%);
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
    justify-content: center;
    padding: 0.7em 0.9em;
    position: fixed;
    right: 1em;
    top: 5.2em;
    transition: background-color 0.2s, border-color 0.2s;
    z-index: 999;
  }

  .hamburger span {
    background-color: $text-color;
    border-radius: 1px;
    display: block;
    height: 2px;
    transition: transform 0.25s, opacity 0.2s, background-color 0.2s;
    width: 18px;
  }

  .hamburger:hover {
    background-color: lighten($background-color, 10%);
    border-color: $string-color;
  }

  .hamburger.open span {
    background-color: $heading-color;
  }

  .hamburger.open span:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
  }

  .hamburger.open span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.open span:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
  }

.tray {
    background-color: lighten($background-color, 4%);
    border: 1px solid lighten($background-color, 15%);
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    padding: 0.6em;
    position: fixed;
    right: 1em;
    top: 8em;
    width: 60vw;
    max-width: 260px;
    z-index: 999;
  }

  .tray-item {
    background: none;
    border: none;
    border-radius: 4px;
    color: $text-color;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-family: $font-family-monospace;
    font-size: 0.8em;
    font-weight: 400;
    letter-spacing: 0.02em;
    padding: 0.5em 0.6em;
    text-align: right;
    transition: background-color 0.15s, color 0.15s, padding-right 0.15s;
  }

  .tray-item .prompt {
    color: $heading-color;
    margin-left: 0.5em;
    opacity: 0.7;
    transition: color 0.15s, opacity 0.15s;
  }

  .tray-item:hover {
    background-color: lighten($background-color, 8%);
    color: $string-color;
    padding-right: 0.9em;
  }

  .tray-item:hover .prompt {
    color: $string-color;
    opacity: 1;
  }

  @media screen and (max-width: 700px) {
    .mobile-nav {
      display: block;
    }
  }
</style>
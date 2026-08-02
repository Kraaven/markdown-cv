```svelte
<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  export let sections = [];

  let navItems = [];
  let open = false;
  let activeId = null;

  let sectionObserver;

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

    const sectionEls = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        });
      },
      {
        rootMargin: '-35% 0px -55% 0px',
      }
    );

    sectionEls.forEach((el) => sectionObserver.observe(el));

    window.addEventListener('keydown', onKeydown);
  });

  onDestroy(() => {
    sectionObserver?.disconnect();
    window.removeEventListener('keydown', onKeydown);
  });

  function toggle() {
    open = !open;
  }

  function close() {
    open = false;
  }

  function goTo(id) {
    close();

    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      close();
    }
  }
</script>

<div class="mobile-nav">
  {#if open}
    <button
      class="backdrop"
      aria-label="Close navigation"
      on:click={close}
    ></button>
  {/if}

  <!-- Mobile navigation toggle -->
  <button
    class="toggle"
    class:open
    on:click={toggle}
    aria-label={open ? 'Close navigation' : 'Open navigation'}
    aria-expanded={open}
    aria-controls="mobile-navigation"
  >
    {#if open}
      <span class="esc">
        <span class="bracket">[</span>Esc<span class="bracket">]</span>
      </span>
    {:else}
      <span class="bars" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
    {/if}
  </button>

  {#if open}
    <nav
      id="mobile-navigation"
      class="tray"
      aria-label="Mobile navigation"
      transition:slide={{
        duration: 200,
        easing: quintOut
      }}
    >
      <div class="tray-header">
        <span class="prompt">~/portfolio</span>
        <span class="command">nav</span>
      </div>

      <div class="items">
        {#each navItems as item, i (item.id)}
          <button
            class="tray-item"
            class:active={activeId === item.id}
            on:click={() => goTo(item.id)}
            in:fade={{
              duration: 140,
              delay: i * 25
            }}
          >
            <span class="indicator" aria-hidden="true">
              {activeId === item.id ? '>' : ''}
            </span>

            <span class="number">
              {String(i + 1).padStart(2, '0')}
            </span>

            <span class="label">
              {item.label}
            </span>
          </button>
        {/each}
      </div>
    </nav>
  {/if}
</div>

<style lang="scss">
  @import '../styles/theme.scss';

  .mobile-nav {
    display: none;
  }

  /*
   * Invisible click-away layer.
   */
  .backdrop {
    background: rgba(0, 0, 0, 0.2);
    border: 0;
    inset: 0;
    position: fixed;
    z-index: 997;
  }

  /*
   * Match the visual language of ResumeButton.svelte.
   *
   * The actual button is larger than the hamburger itself,
   * giving it a reliable mobile touch target.
   */
  .toggle {
    align-items: center;
    background-color: $background-color;
    border: 1px solid lighten($background-color, 15%);
    border-radius: 4px;
    color: $text-color;
    cursor: pointer;
    display: flex;
    justify-content: center;
    min-height: 44px;
    min-width: 44px;
    padding: 0.6em 0.75em;
    position: fixed;
    right: 1em;
    top: 4.8em;
    z-index: 1000;

    -webkit-tap-highlight-color: transparent;

    transition:
      background-color 0.2s,
      border-color 0.2s,
      transform 0.15s;
  }

  .toggle:hover {
    background-color: lighten($background-color, 6%);
    border-color: $string-color;
  }

  .toggle:active {
    transform: translateY(0);
  }

  /*
   * Hamburger
   */
  .bars {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 18px;
  }

  .bars span {
    background-color: $heading-color;
    display: block;
    height: 2px;
    width: 18px;
  }

  /*
   * [Esc] close state.
   */
  .esc {
    color: $heading-color;
    font-family: $font-family-monospace;
    font-size: 0.72em;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  .esc .bracket {
    color: $link-color;
  }

  /*
   * Navigation panel.
   *
   * Width is deliberately compact rather than using
   * max-content over the entire available area.
   */
  .tray {
    background-color: $background-color;
    border: 1px solid lighten($background-color, 15%);
    border-radius: 4px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    position: fixed;

    /*
     * Align directly underneath the mobile button.
     */
    right: 1em;
    top: 8.2em;

    width: 255px;
    z-index: 999;
  }

  /*
   * Compact terminal-style header.
   */
  .tray-header {
    align-items: center;
    border-bottom: 1px solid lighten($background-color, 10%);
    display: flex;
    font-family: $font-family-monospace;
    font-size: 0.62em;
    justify-content: space-between;
    letter-spacing: 0.06em;
    padding: 0.65em 0.9em;
    text-transform: uppercase;
  }

  .prompt {
    color: $heading-color;
  }

  .command {
    color: $list-color;
    opacity: 0.8;
  }

  /*
   * Navigation items.
   */
  .items {
    display: flex;
    flex-direction: column;
    padding: 0.35em;
  }

  .tray-item {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 3px;
    color: $text-color;
    cursor: pointer;
    display: grid;

    /*
     * Compact columns:
     *
     * > | 01 | PROJECTS
     */
    grid-template-columns: 14px 25px 1fr;

    min-height: 42px;
    padding: 0.35em 0.55em;
    text-align: left;
    width: 100%;

    -webkit-tap-highlight-color: transparent;

    transition:
      background-color 0.15s,
      color 0.15s;
  }

  .tray-item:hover {
    background-color: lighten($background-color, 6%);
  }

  .tray-item:active {
    background-color: lighten($background-color, 10%);
  }

  /*
   * Active section marker.
   */
  .indicator {
    color: $heading-color;
    font-family: $font-family-monospace;
    font-size: 0.8em;
    font-weight: 600;
  }

  /*
   * Section numbers.
   */
  .number {
    color: $list-color;
    font-family: $font-family-monospace;
    font-size: 0.62em;
    opacity: 0.55;
  }

  /*
   * Section title.
   */
  .label {
    font-family: $font-family-monospace;
    font-size: 0.68em;
    letter-spacing: 0.045em;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .tray-item.active {
    color: $string-color;
  }

  .tray-item.active .number {
    opacity: 1;
  }

  /*
   * Mobile only.
   */
  @media screen and (max-width: 700px) {
    .mobile-nav {
      display: block;
    }
  }

  /*
   * Very small phones.
   */
  @media screen and (max-width: 380px) {
    .toggle {
      right: 0.75em;
      top: 4.6em;
    }

    .tray {
      right: 0.75em;
      top: 7.9em;
      width: 235px;
    }

    .tray-item {
      min-height: 40px;
    }
  }

  /*
   * Respect reduced-motion preferences.
   */
  @media (prefers-reduced-motion: reduce) {
    .toggle,
    .tray-item {
      transition: none;
    }
  }
</style>
```

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

  <button
    class="toggle"
    class:open
    on:click={toggle}
    aria-label={open ? 'Close navigation' : 'Open navigation'}
    aria-expanded={open}
    aria-controls="mobile-navigation"
  >
    <span class="toggle-label">
      {open ? 'close' : 'menu'}
    </span>

    <span class="icon" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
  </button>

  {#if open}
    <nav
      id="mobile-navigation"
      class="tray"
      aria-label="Mobile navigation"
      transition:slide={{
        duration: 220,
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
              duration: 160,
              delay: i * 30
            }}
          >
            <span class="indicator" aria-hidden="true">
              {activeId === item.id ? '>' : ' '}
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

      <div class="tray-footer">
        <span>ESC</span>
        <span>TO CLOSE</span>
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
   * The backdrop sits below the menu but above the page.
   * This makes the whole rest of the screen a reliable
   * "close menu" target.
   */
  .backdrop {
    background: rgba(0, 0, 0, 0.25);
    border: 0;
    inset: 0;
    position: fixed;
    z-index: 997;
  }

  /*
   * Large, deliberate touch target.
   *
   * The visual icon is small, but the actual button is
   * 44x44px minimum.
   */
  .toggle {
    align-items: center;
    background-color: $background-color;
    border: 1px solid lighten($background-color, 15%);
    border-radius: 4px;
    color: $text-color;
    cursor: pointer;
    display: flex;
    gap: 0.6em;
    justify-content: center;
    min-height: 44px;
    min-width: 76px;
    padding: 0.55em 0.75em;
    position: fixed;
    right: 1em;
    top: 1em;
    z-index: 1000;

    -webkit-tap-highlight-color: transparent;

    transition:
      border-color 0.2s,
      background-color 0.2s,
      transform 0.15s;
  }

  .toggle:hover {
    border-color: $heading-color;
  }

  .toggle:active {
    transform: scale(0.96);
  }

  .toggle-label {
    color: $text-color;
    font-family: $font-family-monospace;
    font-size: 0.7em;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .icon {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 16px;
  }

  .icon span {
    background-color: $heading-color;
    display: block;
    height: 2px;
    transition:
      transform 0.2s,
      opacity 0.2s;
    width: 16px;
  }

  /*
   * Turn hamburger into an X.
   * This is much easier to understand than replacing
   * the entire control with "[Esc]".
   */
  .toggle.open .icon span:nth-child(1) {
    transform: translateY(5px) rotate(45deg);
  }

  .toggle.open .icon span:nth-child(2) {
    opacity: 0;
  }

  .toggle.open .icon span:nth-child(3) {
    transform: translateY(-5px) rotate(-45deg);
  }

  .tray {
    background-color: $background-color;
    border: 1px solid lighten($background-color, 15%);
    border-radius: 5px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    position: fixed;
    right: 1em;
    top: 4.8em;
    width: min(320px, calc(100vw - 2em));
    z-index: 999;
  }

  .tray-header {
    align-items: center;
    border-bottom: 1px solid lighten($background-color, 10%);
    display: flex;
    font-family: $font-family-monospace;
    font-size: 0.7em;
    justify-content: space-between;
    letter-spacing: 0.08em;
    padding: 0.9em 1.1em;
    text-transform: uppercase;
  }

  .prompt {
    color: $heading-color;
  }

  .command {
    color: $list-color;
    opacity: 0.8;
  }

  .items {
    display: flex;
    flex-direction: column;
    padding: 0.5em;
  }

  /*
   * Every navigation item has a large touch target.
   * 48px minimum height is intentional.
   */
  .tray-item {
    align-items: center;
    background: transparent;
    border: 0;
    border-radius: 3px;
    color: $text-color;
    cursor: pointer;
    display: grid;
    grid-template-columns: 18px 28px 1fr;
    min-height: 48px;
    padding: 0.65em 0.75em;
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

  .indicator {
    color: $heading-color;
    font-family: $font-family-monospace;
    font-weight: 600;
  }

  .number {
    color: $list-color;
    font-family: $font-family-monospace;
    font-size: 0.7em;
    opacity: 0.6;
  }

  .label {
    font-family: $font-family-monospace;
    font-size: 0.78em;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .tray-item.active {
    color: $string-color;
  }

  .tray-item.active .number {
    opacity: 1;
  }

  .tray-footer {
    border-top: 1px solid lighten($background-color, 10%);
    color: $text-color;
    display: flex;
    font-family: $font-family-monospace;
    font-size: 0.6em;
    justify-content: flex-end;
    letter-spacing: 0.1em;
    gap: 0.5em;
    opacity: 0.45;
    padding: 0.8em 1.1em;
  }

  .tray-footer span:first-child {
    color: $link-color;
  }

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
      min-width: 44px;
      width: 44px;
    }

    .toggle-label {
      display: none;
    }

    .tray {
      right: 0.75em;
      width: calc(100vw - 1.5em);
    }
  }

  /*
   * Respect reduced-motion preferences.
   */
  @media (prefers-reduced-motion: reduce) {
    .toggle,
    .icon span,
    .tray-item {
      transition: none;
    }
  }
</style>
```

<script>
  import { onMount, onDestroy, tick } from 'svelte';

  export let sectionIds = [];

  let navItems = [];
  let activeId = null;
  let activeSubEl = null;
  let sectionObserver;
  let subObserver;

  onMount(async () => {
    await tick(); // let markdown content render first

    navItems = sectionIds.map((id) => {
      const el = document.getElementById(id);
      const heading = el?.querySelector('h2');
      const subheadings = el
        ? Array.from(el.querySelectorAll('h3')).map((h3, i) => ({
            el: h3,
            label: h3.textContent.trim(),
            key: `${id}-${i}`,
          }))
        : [];

      return {
        id,
        label: heading ? heading.textContent.trim() : id,
        subheadings,
      };
    });

    const sectionEls = navItems.map((n) => document.getElementById(n.id)).filter(Boolean);

    sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activeId = entry.target.id;
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sectionEls.forEach((el) => sectionObserver.observe(el));

    const allSubEls = navItems.flatMap((n) => n.subheadings.map((s) => s.el));

    subObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activeSubEl = entry.target;
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    allSubEls.forEach((el) => subObserver.observe(el));
  });

  onDestroy(() => {
    sectionObserver?.disconnect();
    subObserver?.disconnect();
  });

  function goToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  function goToSub(el) {
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // A section's subheadings only ever show while that section is active —
  // one level deep, no recursion into grandchildren.
  $: expandedId = activeId;
</script>

<nav class="navigator">
  {#each navItems as item (item.id)}
    <div class="nav-group">
      <button
        class="main"
        class:active={activeId === item.id}
        on:click={() => goToSection(item.id)}
      >
        <span class="dot" />
        {item.label}
      </button>

      {#if expandedId === item.id && item.subheadings.length}
        <div class="subnav">
          {#each item.subheadings as sub (sub.key)}
            <button
              class="sub"
              class:active={activeSubEl === sub.el}
              on:click={() => goToSub(sub.el)}
            >
              {sub.label}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</nav>

<style lang="scss">
  @import '../styles/theme.scss';

  .navigator {
    display: flex;
    flex-direction: column;
    gap: 0.6em;
    left: 1.5em;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 998;
  }

  .nav-group {
    display: flex;
    flex-direction: column;
  }

  button.main,
  button.sub {
    background: none;
    border: none;
    color: $text-color;
    cursor: pointer;
    font-family: $font-family-monospace;
    text-align: left;
    transition: opacity 0.2s;
    white-space: nowrap;
  }

  button.main {
    align-items: center;
    display: flex;
    font-size: 0.8em;
    gap: 0.6em;
    opacity: 0.5;
    padding: 0.2em 0;

    .dot {
      background-color: $text-color;
      border-radius: 50%;
      flex-shrink: 0;
      height: 6px;
      transition: background-color 0.2s, transform 0.2s;
      width: 6px;
    }

    &:hover {
      opacity: 0.8;
    }

    &.active {
      opacity: 1;

      .dot {
        background-color: $string-color;
        transform: scale(1.4);
      }
    }
  }

  .subnav {
    display: flex;
    flex-direction: column;
    gap: 0.35em;
    margin: 0.3em 0 0.3em 0.9em;
    padding-left: 0.7em;
    border-left: 1px solid lighten($background-color, 15%);
  }

  button.sub {
    font-size: 0.7em;
    opacity: 0.45;
    padding: 0.1em 0;

    &:hover {
      opacity: 0.75;
    }

    &.active {
      color: $string-color;
      opacity: 1;
    }
  }

  @media screen and (max-width: 1100px) {
    button.main span:not(.dot) {
      display: none;
    }
    .subnav {
      display: none; // no room to show labels for sub-items either
    }
  }

  @media screen and (max-width: 700px) {
    .navigator {
      display: none;
    }
  }
</style>
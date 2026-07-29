<script>
  import { onMount, onDestroy } from 'svelte';

  export let sections = [];

  let activeId = sections[0]?.id;
  let observer;

  onMount(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean);

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' } // "active" when section crosses mid-screen
    );

    elements.forEach((el) => observer.observe(el));
  });

  onDestroy(() => observer?.disconnect());

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<nav class="navigator">
  {#each sections as section}
    <button
      class:active={activeId === section.id}
      on:click={() => scrollTo(section.id)}
    >
      <span class="dot" />
      {section.label}
    </button>
  {/each}
</nav>

<style lang="scss">
  @import '../styles/theme.scss';

  .navigator {
    display: flex;
    flex-direction: column;
    gap: 0.9em;
    left: 1.5em;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 998;

    button {
      align-items: center;
      background: none;
      border: none;
      color: $text-color;
      cursor: pointer;
      display: flex;
      font-family: $font-family-monospace;
      font-size: 0.8em;
      gap: 0.6em;
      opacity: 0.5;
      padding: 0.2em 0;
      text-align: left;
      transition: opacity 0.2s;
      white-space: nowrap;

      .dot {
        background-color: $text-color;
        border-radius: 50%;
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
  }

  // Collapse to dots-only on narrower screens, like ForkMe hides on mobile
  @media screen and (max-width: 1100px) {
    .navigator button span:not(.dot) {
      display: none;
    }
  }

  @media screen and (max-width: 700px) {
    .navigator {
      display: none; // not enough room next to centered content on mobile
    }
  }
</style>
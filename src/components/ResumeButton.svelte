<a class="resume-button"
  href="/resume.pdf"
  download
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Download Resume"
>
  <svg
    class="icon"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M4 19h16" />
  </svg>
  <span>Resume</span>
</a>

<style lang="scss">
  @import '../styles/theme.scss';

  .resume-button {
    align-items: center;
    background-color: lighten($background-color, 6%);
    border: 1px solid lighten($background-color, 15%);
    border-radius: 4px;
    color: $text-color;
    display: flex;
    font-family: $font-family-monospace;
    font-size: 0.85em;
    gap: 0.5em;
    padding: 0.6em 1.1em;
    position: fixed;
    right: 3em;
    text-decoration: none;
    top: 2em;
    transition:
      background-color 0.2s,
      border-color 0.2s,
      transform 0.2s;
    z-index: 999;
  }

  .resume-button .icon {
    color: $heading-color;
    flex-shrink: 0;
    transition: color 0.2s, transform 0.2s;
  }

  .resume-button:hover {
    background-color: lighten($background-color, 10%);
    border-color: $string-color;
    transform: translateY(-2px);
  }

  .resume-button:hover .icon {
    color: $string-color;
    transform: translateY(2px);
  }

  .resume-button:active {
    transform: translateY(0);
  }

  @media screen and (max-width: 700px) {
    .resume-button {
      font-size: 0.75em;
      padding: 0.5em 0.8em;
      right: 1em;
      top: 1em;
    }
  }
</style>
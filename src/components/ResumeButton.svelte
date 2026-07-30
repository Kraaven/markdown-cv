<class="resume-button"
  href="/resume.pdf"
  download
  target="_blank"
  rel="noopener noreferrer"
>
  <span class="prompt">&gt;</span> Download Resume
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
    gap: 0.4em;
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

    .prompt {
      color: $heading-color;
    }

    &:hover {
      background-color: lighten($background-color, 10%);
      border-color: $string-color;
      transform: translateY(-2px);

      .prompt {
        color: $string-color;
      }
    }

    &:active {
      transform: translateY(0);
    }
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
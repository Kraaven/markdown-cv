<script>
  import Section from '../components/Section.svelte';
  import Intro from '../components/Intro.svelte';
  import Navigator from '../components/Navigator.svelte';

  import Hello from '../content/01-hello.md';
  import Experience from '../content/02-experience.md';
  import Skills from '../content/03-skills.md';
  import Projects from '../content/02.5-projects.md';
  import Education from '../content/04-education.md';
  import Hobby from '../content/05-hobby.md';


  const sections = [
    { id: 'hello', component: Hello, showSubheadings: false },
    { id: 'experience', component: Experience, showSubheadings: true },
    { id: 'projects', component: Projects, showSubheadings: true },
    { id: 'skills', component: Skills, showSubheadings: false },
    { id: 'education', component: Education, showSubheadings: false },
    { id: 'hobby', component: Hobby, showSubheadings: false },
  ];
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;400;600&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<!-- <Navigator sectionIds={sections.map((s) => s.id)} /> -->
<Navigator {sections} />
<Intro />

<main>
  {#each sections as section}
    <Section id={section.id}>
      <svelte:component this={section.component} />
    </Section>
  {/each}
</main>

<style lang="scss" global>
  @import '../styles/global';

  #me {
    width: 100%;
  }
</style>


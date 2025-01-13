<script>
  import Section from '../components/Section.svelte';
  import Intro from '../components/Intro.svelte';
  //import ForkMe from '../components/ForkMe.svelte.disable';

  import Hello from '../content/01-hello.md';
  import Experience from '../content/02-experience.md';
  import Skills from '../content/03-skills.md';
  import Projects from '../content/02.5-projects.md';
  import Education from '../content/04-education.md';
  import Hobby from '../content/05-hobby.md';


  const sections = [
    { id: 'hello', component: Hello },
    { id: 'experience', component: Experience },
    { id: 'projects', component: Projects },
    { id: 'skills', component: Skills },
    { id: 'education', component: Education },
    { id: 'hobby', component: Hobby },
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

<Intro />

<main>
  {#each sections as section}
    <Section id={section.id}>
      <svelte:component this={section.component} />
    </Section>
  {/each}
</main>


<script>
  import { getTheme, setTheme } from "$lib/store";

  const themeIcons = { light: "/sun.svg", dark: "/moon.svg", system: "/monitor.svg" };
  const themeOrder = ["light", "dark", "system"];

  let icon = themeIcons[getTheme()] || "/monitor.svg";

  function toggle() {
    const current = getTheme();
    const next = themeOrder[(themeOrder.indexOf(current) + 1) % themeOrder.length];
    setTheme(next);
    icon = themeIcons[next];
  }
</script>

<a href={undefined} on:click|preventDefault={toggle} role="button" title="テーマ切替">
  <img src={icon} class="path" alt="" height="24px" />
</a>

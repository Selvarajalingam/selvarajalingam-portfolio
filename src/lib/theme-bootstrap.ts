// Static, trusted code only. Runs before the first paint; no content or secrets are interpolated.
export const themeBootstrap = `try{var p=localStorage.getItem('selva:theme');document.documentElement.dataset.theme=p==='light'?'light':p==='system'&&matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}catch{}`;

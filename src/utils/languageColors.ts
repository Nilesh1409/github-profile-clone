// GitHub language colors - sourced from GitHub linguist
export const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  PHP: '#4F5D95',
  Dart: '#00B4AB',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  'Jupyter Notebook': '#DA5B0B',
  R: '#198CE7',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Clojure: '#db5855',
  Haskell: '#5e5086',
  Lua: '#000080',
  Perl: '#0298c3',
  Assembly: '#6E4C13',
  PowerShell: '#012456',
  Dockerfile: '#384d54',
  Makefile: '#427819',
  TeX: '#3D6117',
  Vim: '#019733',
  Objective: '#438eff',
};

export function getLanguageColor(language: string | null): string {
  if (!language) return '#8b949e';
  return languageColors[language] || '#8b949e';
}


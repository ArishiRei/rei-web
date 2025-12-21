import { promises as fs } from "node:fs";
import { join } from "node:path";
import { appearanceConfig } from "../configs/appearance";

interface ColorItem {
  name: string;
  title: string;
  primary: string;
}

export function generateColorCSS(colors: ColorItem[]) {
  const lines: string[] = [];

  lines.push(`:root {`);

  for (const item of colors) {
    lines.push(`  /* ${item.title} */`);
    lines.push(`  --${item.name}: ${item.primary};`);
    lines.push("");
  }

  lines.push(`}`);

  return lines.join("\n");
}

export async function generateCSS() {
  const nuxtAppDir = (dir: string) => {
    return join("app/", dir);
  };

  const colors = appearanceConfig.colors;

  const css = generateColorCSS(colors);
  const output = join(
    process.cwd(),
    nuxtAppDir("assets/styles/theme-colors.css")
  );

  // 确保目录存在
  await fs.mkdir(join(process.cwd(), nuxtAppDir("assets/styles")), {
    recursive: true,
  });
  await fs.writeFile(output, css, "utf-8");

  console.log("✨ theme-colors.css 已生成:", output);
}

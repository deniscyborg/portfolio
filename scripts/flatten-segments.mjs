// With static export Next.js 16 writes segment data into nested folders
//   out/en/pricing/__next.$d$lang/pricing/__PAGE__.txt
// while the client router requests them by a flat name
//   out/en/pricing/__next.$d$lang.pricing.__PAGE__.txt
// Without flat copies every link prefetch logs a 404 in the console.
// The script creates copies alongside and leaves the originals untouched.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] ?? "out");
let copied = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("__next.")) flatten(dir, full);
      else walk(full);
    }
  }
}

function flatten(parent, segmentDir) {
  for (const file of listFiles(segmentDir)) {
    const relative = path.relative(segmentDir, file).split(path.sep).join(".");
    const target = path.join(parent, `${path.basename(segmentDir)}.${relative}`);
    if (!fs.existsSync(target)) {
      fs.copyFileSync(file, target);
      copied++;
    }
  }
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

if (!fs.existsSync(OUT)) {
  console.error(`flatten-segments: ${OUT} does not exist, run next build first`);
  process.exit(1);
}
walk(OUT);
console.log(`flatten-segments: ${copied} segment files copied`);

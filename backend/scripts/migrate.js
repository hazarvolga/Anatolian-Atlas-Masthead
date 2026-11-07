import { spawnSync } from 'child_process';
import fs from 'fs';

const schemas = ['prisma/schema.prisma', '../prisma/schema.prisma'];
const schema = schemas.find((candidate) => fs.existsSync(candidate));

if (!schema) {
  console.error('❌ Prisma schema not found');
  process.exit(1);
}

const result = spawnSync(
  'npx',
  ['prisma', 'migrate', 'deploy', '--schema', schema],
  { stdio: 'inherit' }
);

process.exit(result.status ?? 1);

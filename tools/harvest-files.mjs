// 각 자료 폴더(works.do 공개 링크) 안의 파일명을 공개 엔드포인트로 수집해
// data-files.js (전역 filesData = { 항목ID: [파일명...] }) 를 생성한다.
// 공식 Drive API(Developer Console 권한 필요)가 아니라, 공유 뷰어가 쓰는
// 무인증 공개 엔드포인트를 이용 — 경남교육청이 "누구나 내려받기"로 공개한 자료.
//
// 사용법: node tools/harvest-files.mjs
//   - tools/files-progress.json 에 진행상황 저장(중단 시 재실행하면 이어서).

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const RL = '24101';                 // 경남교육청 resourceLocation (공통)
const API = `https://api.drive.worksmobile.com/rl/${RL}/v1/shared-links`;
const MAX_DEPTH = 4;                 // 하위 폴더 재귀 깊이
const DELAY = 120;                   // 요청 간 간격(ms)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── data.js에서 항목(id, title, url) 추출 ──
const dataText = fs.readFileSync(path.join(ROOT, 'data.js'), 'utf8');
const data = vm.runInNewContext(
  dataText + '\n;({kindergartenData, elementaryData, secondaryData, specialData, adminData, staffData})',
  {}
);
const items = [];
for (const cat of Object.values(data)) {
  for (const section of Object.values(cat)) {
    for (const it of section.items) items.push({ id: it.id, title: it.title, url: it.url });
  }
}

// ── 진행상황(재실행 복구) ──
// --force: 기존 수집분 무시하고 전체 재수확(파일 추가/변경 반영용 갱신).
const FORCE = process.argv.includes('--force');
const progPath = path.join(__dirname, 'files-progress.json');
const result = (!FORCE && fs.existsSync(progPath)) ? JSON.parse(fs.readFileSync(progPath, 'utf8')) : {};
const saveProg = () => fs.writeFileSync(progPath, JSON.stringify(result, null, 2));

async function getJson(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 15000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(t);
      if (res.status === 429) { await sleep(3000); continue; }
      if (!res.ok) return { __error: res.status };
      return await res.json();
    } catch (e) {
      if (attempt === 2) return { __error: String(e.name || e) };
      await sleep(1000);
    }
  }
}

// works.do → 공유 토큰
async function resolveToken(worksUrl) {
  try {
    const res = await fetch(worksUrl, { redirect: 'follow' });
    const m = res.url.match(/pubDLink\/([^/?#]+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

// 폴더 안 파일명 재귀 수집 (하위폴더도 들어감)
async function listFiles(token, parentFileId, depth, acc) {
  let cursor = null;
  do {
    let url = `${API}/${token}/files?service=drive_link&parentFileId=${encodeURIComponent(parentFileId)}&orderBy=fileName%20asc&count=500`;
    if (cursor) url += `&cursor=${encodeURIComponent(cursor)}`;
    const json = await getJson(url);
    if (json.__error) return;
    for (const f of json.files || []) {
      if (f.fileType === 'FOLDER' || f.childFolderCount > 0) {
        acc.push(f.fileName);                         // 하위폴더명도 검색 대상에 포함
        if (depth < MAX_DEPTH) await listFiles(token, f.fileId, depth + 1, acc);
      } else {
        acc.push(f.fileName);
      }
    }
    cursor = json.responseMetaData?.nextCursor || null;
    if (cursor) await sleep(DELAY);
  } while (cursor);
}

// ── 메인 ──
const numArg = process.argv.slice(2).find((a) => /^\d+$/.test(a));
const LIMIT = numArg ? parseInt(numArg, 10) : items.length;
let done = 0, fail = 0, totalFiles = 0;
const failures = [];
for (const it of items.slice(0, LIMIT)) {
  if (result[it.id]) { done++; totalFiles += result[it.id].length; continue; } // 이미 수집됨
  const token = await resolveToken(it.url);
  if (!token) { fail++; failures.push(`${it.id} 토큰실패`); await sleep(DELAY); continue; }
  const meta = await getJson(`${API}/${token}?service=drive_link`);
  if (meta.__error || !meta.rootFileId) { fail++; failures.push(`${it.id} 메타실패(${meta.__error})`); await sleep(DELAY); continue; }
  const acc = [];
  await listFiles(token, meta.rootFileId, 0, acc);
  result[it.id] = acc;
  totalFiles += acc.length;
  done++;
  if (done % 10 === 0) { saveProg(); console.log(`  …${done}/${items.length} 폴더, 누적 파일 ${totalFiles}`); }
  await sleep(DELAY);
}
saveProg();

// ── data-files.js 출력 ──
const out =
  '// 자동 생성 (tools/harvest-files.mjs). 각 자료 폴더(항목ID) 안의 파일명 목록.\n' +
  'const filesData = ' + JSON.stringify(result, null, 0) + ';\n';
fs.writeFileSync(path.join(ROOT, 'data-files.js'), out);

console.log(`\n완료: 폴더 ${done}개 / 실패 ${fail}개 / 총 파일 ${totalFiles}개`);
console.log(`data-files.js 크기: ${(fs.statSync(path.join(ROOT, 'data-files.js')).size / 1024).toFixed(0)} KB`);
if (failures.length) { console.log('실패 목록:'); failures.slice(0, 20).forEach((f) => console.log('  - ' + f)); }

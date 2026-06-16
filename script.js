// ── 카테고리 설정 (data.js의 전역 데이터를 prefix로 매핑) ──────────────
// 6개 카테고리마다 함수를 복제하지 않고, 이 한 곳의 설정으로 일반화한다.
const CATEGORY_DATA = {
    kindergarten: kindergartenData,
    elementary: elementaryData,
    secondary: secondaryData,
    special: specialData,
    admin: adminData,
    staff: staffData,
};

// 카테고리 메타데이터 (통합 검색 결과 머리글용 — 라벨/아이콘/색, index.html 카드와 일치)
const CATEGORY_META = {
    kindergarten: { label: '유치원', icon: 'fas fa-child', color: 'blue' },
    elementary:   { label: '초등학교', icon: 'fas fa-book', color: 'green' },
    secondary:    { label: '중고등학교', icon: 'fas fa-chalkboard', color: 'purple' },
    special:      { label: '특수학교(급)', icon: 'fas fa-heart', color: 'orange' },
    admin:        { label: '교무행정', icon: 'fas fa-tag', color: 'amber' },
    staff:        { label: '일반행정', icon: 'fas fa-file', color: 'red' },
};

// 카드별 '이미 렌더됨' 여부 (첫 펼침에만 렌더)
const sectionsRendered = {};

// ── 보안 헬퍼 ────────────────────────────────────────────────────────
// innerHTML로 삽입되는 텍스트(제목 등)를 이스케이프해 XSS를 방어한다.
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

// http(s) 링크만 허용 (javascript: 등 위험한 스킴 차단)
function safeUrl(url) {
    return /^https?:\/\//i.test(url) ? url : '#';
}

// 섹션 고유 id 생성 — 렌더와 검색에서 동일하게 써야 토글이 맞물린다.
function makeSectionId(typePrefix, title) {
    return `${typePrefix}-section-${title.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')}`;
}

// ── 최상위 카드 펼침/접힘 ────────────────────────────────────────────
function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    if (!content) return;

    const button = arrow
        ? arrow.closest('button')
        : document.querySelector(`button[onclick="toggleSection('${sectionId}')"]`);

    if (!content.classList.contains('open')) {
        content.classList.add('open');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        if (button) { button.classList.remove('rounded-lg'); button.classList.add('rounded-t-lg'); }

        if (!sectionsRendered[sectionId]) {
            renderSections(sectionId);
            sectionsRendered[sectionId] = true;
        } else {
            replaySubSectionAnimations(sectionId);
        }
    } else {
        content.classList.remove('open');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
        if (button) { button.classList.remove('rounded-t-lg'); button.classList.add('rounded-lg'); }
    }
}

// ── 카테고리 내부 섹션 렌더 ──────────────────────────────────────────
function renderSections(prefix) {
    const container = document.getElementById(`${prefix}-sections`);
    if (!container) return;
    container.innerHTML = '';
    Object.entries(CATEGORY_DATA[prefix]).forEach(([sectionTitle, sectionData], index) => {
        container.appendChild(createDetailedSectionHTML(sectionTitle, sectionData, prefix, index));
    });
}

function createDetailedSectionHTML(title, data, typePrefix, index = 0) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-xs card-entrance';
    sectionElement.style.animationDelay = `${index * 60}ms`;

    const sectionId = makeSectionId(typePrefix, title);

    sectionElement.innerHTML = `
        <button
            onclick="toggleDetailedSubSection('${sectionId}')"
            class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 bg-white"
        >
            <div class="flex items-center">
                <div class="w-8 h-8 bg-${data.color}-100 rounded-md flex items-center justify-center mr-3">
                    <i class="${data.icon} text-${data.color}-600 text-sm"></i>
                </div>
                <span class="font-medium text-gray-800">${escapeHtml(title)}</span>
            </div>
            <i class="fas fa-chevron-down text-gray-400 transition-transform duration-200" id="${sectionId}-arrow"></i>
        </button>

        <div id="${sectionId}-content" class="slide-content">
            <div>
                <div class="bg-gray-50 border-t border-gray-200">
                    ${data.items.map(item => `
                        <div class="px-4 py-2 border-b border-gray-100 last:border-b-0">
                            <a
                                href="${safeUrl(item.url)}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="flex items-center text-gray-700 hover:text-${data.color}-600 hover:bg-white p-2 rounded-md transition-all duration-200 group"
                            >
                                <i class="fas fa-file-alt text-gray-400 group-hover:text-${data.color}-500 mr-3 text-sm"></i>
                                <span class="text-sm flex-grow">${escapeHtml(item.title)}</span>
                                <i class="fas fa-external-link-alt text-gray-300 group-hover:text-${data.color}-400 ml-2 text-xs flex-shrink-0"></i>
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    return sectionElement;
}

// ── 섹션 내부 하위 펼침/접힘 ─────────────────────────────────────────
function toggleDetailedSubSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    if (!content) return;

    if (!content.classList.contains('open')) {
        content.classList.add('open');
        if (arrow) arrow.style.transform = 'rotate(180deg)';
    } else {
        content.classList.remove('open');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
}

// ── 검색 (카테고리 공통) ─────────────────────────────────────────────
function searchSection(prefix) {
    const searchTerm = document.getElementById(`${prefix}-search`).value.toLowerCase();
    const container = document.getElementById(`${prefix}-sections`);
    searchDetailedItems(searchTerm, CATEGORY_DATA[prefix], container, prefix);
}

function searchDetailedItems(searchTerm, dataObject, containerElement, typePrefix) {
    // 검색어가 비면 전체를 다시 렌더하고 모두 접는다.
    if (!searchTerm.trim()) {
        containerElement.innerHTML = '';
        Object.entries(dataObject).forEach(([sectionTitle, sectionData], index) => {
            containerElement.appendChild(createDetailedSectionHTML(sectionTitle, sectionData, typePrefix, index));
        });
        setTimeout(() => {
            Object.keys(dataObject).forEach(sectionTitle => {
                const sectionId = makeSectionId(typePrefix, sectionTitle);
                const content = document.getElementById(`${sectionId}-content`);
                const arrow = document.getElementById(`${sectionId}-arrow`);
                if (content && content.classList.contains('open')) {
                    content.classList.remove('open');
                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                }
            });
        }, 0);
        return;
    }

    // 제목/항목명에 검색어가 포함된 섹션만 추린다.
    const filteredData = {};
    Object.entries(dataObject).forEach(([sectionTitle, sectionData]) => {
        const matchingItems = sectionData.items.filter(item =>
            item.title.toLowerCase().includes(searchTerm) ||
            sectionTitle.toLowerCase().includes(searchTerm)
        );
        if (matchingItems.length > 0 || sectionTitle.toLowerCase().includes(searchTerm)) {
            filteredData[sectionTitle] = {
                ...sectionData,
                items: sectionTitle.toLowerCase().includes(searchTerm) && matchingItems.length === 0
                    ? sectionData.items
                    : matchingItems,
            };
        }
    });

    containerElement.innerHTML = '';
    if (Object.keys(filteredData).length === 0) {
        containerElement.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-search text-2xl mb-2"></i>
                <p>검색 결과가 없습니다.</p>
            </div>
        `;
        return;
    }

    // 일치한 섹션은 자동으로 펼친다.
    Object.entries(filteredData).forEach(([sectionTitle, sectionData], index) => {
        containerElement.appendChild(createDetailedSectionHTML(sectionTitle, sectionData, typePrefix, index));

        const sectionId = makeSectionId(typePrefix, sectionTitle);
        const sectionTitleMatches = sectionTitle.toLowerCase().includes(searchTerm);
        const itemsMatch = sectionData.items.some(item => item.title.toLowerCase().includes(searchTerm));

        if (sectionTitleMatches || itemsMatch) {
            setTimeout(() => {
                const content = document.getElementById(`${sectionId}-content`);
                const arrow = document.getElementById(`${sectionId}-arrow`);
                if (content && arrow) {
                    content.classList.add('open');
                    arrow.style.transform = 'rotate(180deg)';
                }
            }, 50);
        }
    });
}

// ── 하위 섹션 등장 애니메이션 재생 ───────────────────────────────────
function replaySubSectionAnimations(sectionId) {
    const container = document.getElementById(`${sectionId}-sections`);
    if (!container) return;
    container.querySelectorAll('.card-entrance').forEach((el, i) => {
        el.classList.remove('card-entrance');
        void el.offsetWidth; // 리플로우 강제 → 애니메이션 재시작
        el.style.animationDelay = `${i * 60}ms`;
        el.classList.add('card-entrance');
    });
}

// ── 통합·초성 검색 ───────────────────────────────────────────────────
const CHOSEONG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

// 한글 음절의 초성만 뽑아 잇는다 (비한글은 그대로). 예: "유치원 규칙" → "ㅇㅊㅇ ㄱㅊ"
function toChoseong(str) {
    let out = '';
    for (const ch of str) {
        const code = ch.charCodeAt(0);
        if (code >= 0xAC00 && code <= 0xD7A3) {
            out += CHOSEONG[Math.floor((code - 0xAC00) / 588)];
        } else {
            out += ch;
        }
    }
    return out;
}

// 질의가 초성 자모(ㄱ~ㅎ)로만 이뤄졌는가
function isChoseongQuery(q) {
    return /[ㄱ-ㅎ]/.test(q) && /^[ㄱ-ㅎ\s]+$/.test(q);
}

// 텍스트가 검색어에 매칭되는가 — 초성 질의면 초성끼리, 아니면 일반 부분일치
function matchesQuery(text, query) {
    const q = query.trim();
    if (!q) return false;
    if (isChoseongQuery(q)) {
        return toChoseong(text).replace(/\s/g, '').includes(q.replace(/\s/g, ''));
    }
    return text.toLowerCase().includes(q.toLowerCase());
}

// 전체 카테고리를 한 번에 검색 → 결과 패널 렌더, 카테고리 탐색 뷰는 숨김
function globalSearch() {
    const input = document.getElementById('global-search');
    const browse = document.getElementById('browse-view');
    const results = document.getElementById('global-results');
    if (!input || !browse || !results) return;

    const term = input.value.trim();

    // 검색어가 비면 탐색 뷰 복귀
    if (!term) {
        results.classList.add('hidden');
        results.innerHTML = '';
        browse.classList.remove('hidden');
        return;
    }

    browse.classList.add('hidden');
    results.classList.remove('hidden');

    // 매칭 항목을 카테고리별로 수집
    const groups = [];
    let total = 0;
    for (const [prefix, data] of Object.entries(CATEGORY_DATA)) {
        const hits = [];
        for (const [sectionTitle, section] of Object.entries(data)) {
            const sectionHit = matchesQuery(sectionTitle, term);
            for (const item of section.items) {
                if (sectionHit || matchesQuery(item.title, term)) {
                    hits.push({ sectionTitle, item, color: section.color });
                }
            }
        }
        if (hits.length) { groups.push({ prefix, hits }); total += hits.length; }
    }

    if (!total) {
        results.innerHTML = `
            <div class="text-center py-16 text-gray-500">
                <i class="fas fa-search text-3xl mb-3"></i>
                <p>"${escapeHtml(term)}"에 대한 검색 결과가 없습니다.</p>
            </div>`;
        return;
    }

    results.innerHTML =
        `<p class="text-sm text-gray-500 mb-4">전체 검색 결과 <b class="text-gray-700">${total}</b>건</p>` +
        groups.map(({ prefix, hits }) => {
            const meta = CATEGORY_META[prefix] || { label: prefix, icon: 'fas fa-folder', color: 'gray' };
            return `
            <div class="mb-6">
                <div class="flex items-center mb-2">
                    <span class="inline-flex items-center justify-center w-7 h-7 rounded-md bg-${meta.color}-100 mr-2">
                        <i class="${meta.icon} text-${meta.color}-600 text-sm"></i>
                    </span>
                    <span class="font-semibold text-gray-800">${escapeHtml(meta.label)}</span>
                    <span class="text-xs text-gray-400 ml-2">${hits.length}건</span>
                </div>
                <div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                    ${hits.map(({ sectionTitle, item, color }) => `
                        <a href="${safeUrl(item.url)}" target="_blank" rel="noopener noreferrer"
                           class="flex items-center px-4 py-2.5 hover:bg-${color}-50 transition-colors duration-150 group">
                            <i class="fas fa-file-alt text-gray-400 group-hover:text-${color}-500 mr-3 text-sm flex-shrink-0"></i>
                            <span class="text-sm text-gray-700 flex-grow">${escapeHtml(item.title)}</span>
                            <span class="text-xs text-gray-400 mr-2 hidden sm:inline">${escapeHtml(sectionTitle)}</span>
                            <i class="fas fa-external-link-alt text-gray-300 group-hover:text-${color}-400 text-xs flex-shrink-0"></i>
                        </a>`).join('')}
                </div>
            </div>`;
        }).join('');
}

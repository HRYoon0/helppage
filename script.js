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

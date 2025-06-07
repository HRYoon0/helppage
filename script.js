// script.js

// 현재 펼쳐진 섹션을 추적하기 위한 Set (현재 코드에서는 직접 사용되지 않음)
let currentExpandedSections = new Set(); 

// 각 섹션의 데이터가 렌더링(화면에 그려졌는지)되었는지 추적하는 플래그 변수들
// 한번 렌더링된 데이터는 다시 렌더링하지 않도록 하여 성능을 향상시킵니다.
let kindergartenSectionsRendered = false;
let elementarySectionsRendered = false;
let secondarySectionsRendered = false;
let specialSectionsRendered = false;
let adminSectionsRendered = false;
let staffSectionsRendered = false;

/**
 * 메인 카테고리 섹션(유치원, 초등학교 등)을 열고 닫는 함수
 * @param {string} sectionId - 토글할 섹션의 ID (예: 'kindergarten')
 */
function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    
    // 섹션 내용이 숨겨져 있다면
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden'); // 숨김 클래스 제거하여 표시
        if (arrow) arrow.style.transform = 'rotate(180deg)'; // 화살표 아이콘 180도 회전
        
        // 버튼의 모서리 스타일을 조정 (열렸을 때는 위쪽만 둥글게)
        const button = arrow ? arrow.closest('button') : document.querySelector(`button[onclick="toggleSection('${sectionId}')"]`);
        if (button) {
            button.classList.remove('rounded-lg');
            button.classList.add('rounded-t-lg');
        }
        
        // 각 섹션의 내용이 아직 렌더링되지 않았다면, 해당 섹션의 데이터를 렌더링하는 함수를 호출
        if (sectionId === 'kindergarten' && !kindergartenSectionsRendered) {
            renderKindergartenSections();
            kindergartenSectionsRendered = true; // 렌더링 되었음을 표시
        } else if (sectionId === 'elementary' && !elementarySectionsRendered) {
            renderElementarySections();
            elementarySectionsRendered = true;
        } else if (sectionId === 'secondary' && !secondarySectionsRendered) { 
            renderSecondarySections();
            secondarySectionsRendered = true;
        } else if (sectionId === 'special' && !specialSectionsRendered) {
            renderSpecialSections();
            specialSectionsRendered = true;
        } else if (sectionId === 'admin' && !adminSectionsRendered) {
            renderAdminSections();
            adminSectionsRendered = true;
        } else if (sectionId === 'staff' && !staffSectionsRendered) {
            renderStaffSections();
            staffSectionsRendered = true;
        }

    } else { // 섹션 내용이 이미 열려 있다면
        content.classList.add('hidden'); // 숨김 클래스 추가하여 숨김
        if (arrow) arrow.style.transform = 'rotate(0deg)'; // 화살표 아이콘 원래대로
        
        // 버튼의 모서리 스타일을 원래대로 (전체 둥글게)
        const button = arrow ? arrow.closest('button') : document.querySelector(`button[onclick="toggleSection('${sectionId}')"]`);
        if (button) {
            button.classList.remove('rounded-t-lg');
            button.classList.add('rounded-lg');
        }
    }
}

// 각 카테고리별 데이터를 화면에 그리는 렌더링 함수들
function renderKindergartenSections() {
    const container = document.getElementById('kindergarten-sections');
    container.innerHTML = '';
    Object.entries(kindergartenData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, 'kindergarten', 'toggleKindergartenSubSection');
        container.appendChild(sectionElement);
    });
}

function renderElementarySections() {
    const container = document.getElementById('elementary-sections');
    container.innerHTML = '';
    Object.entries(elementaryData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, 'elementary', 'toggleElementarySubSection');
        container.appendChild(sectionElement);
    });
}

function renderSecondarySections() {
    const container = document.getElementById('secondary-sections');
    container.innerHTML = '';
    Object.entries(secondaryData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, 'secondary', 'toggleSecondarySubSection');
        container.appendChild(sectionElement);
    });
}

function renderSpecialSections() {
    const container = document.getElementById('special-sections');
    container.innerHTML = '';
    Object.entries(specialData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, 'special', 'toggleSpecialSubSection');
        container.appendChild(sectionElement);
    });
}

function renderAdminSections() {
    const container = document.getElementById('admin-sections');
    container.innerHTML = '';
    Object.entries(adminData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, 'admin', 'toggleAdminSubSection');
        container.appendChild(sectionElement);
    });
}

function renderStaffSections() {
    const container = document.getElementById('staff-sections');
    container.innerHTML = '';
    Object.entries(staffData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, 'staff', 'toggleStaffSubSection');
        container.appendChild(sectionElement);
    });
}


/**
 * 상세 항목(하위 아코디언 메뉴)의 HTML 구조를 생성하는 함수
 * @param {string} title - 섹션 제목 (예: '교수학습')
 * @param {object} data - 해당 섹션의 데이터 (아이콘, 색상, 항목 리스트 포함)
 * @param {string} typePrefix - 카테고리 타입 (예: 'elementary')
 * @param {string} toggleFunctionName - 하위 섹션을 토글하는 함수의 이름
 * @returns {HTMLElement} - 생성된 HTML 요소
 */
function createDetailedSectionHTML(title, data, typePrefix, toggleFunctionName) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-xs';
    
    // 섹션 ID 생성 시 특수문자 등을 제거하여 유효한 ID로 만듦
    const sectionId = `${typePrefix}-section-${title.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')}`.replace(/\\./g, '-');
    
    // 상세 항목의 HTML 내용을 정의
    sectionElement.innerHTML = `
        <button 
            onclick="${toggleFunctionName}('${sectionId}')" 
            class="w-full p-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 bg-white"
        >
            <div class="flex items-center">
                <div class="w-8 h-8 bg-${data.color}-100 rounded-md flex items-center justify-center mr-3">
                    <i class="${data.icon} text-${data.color}-600 text-sm\"></i>
                </div>
                <span class="font-medium text-gray-800">${title}</span>
            </div>
            <i class="fas fa-chevron-down text-gray-400 transition-transform duration-200" id="${sectionId}-arrow"></i>
        </button>
        
        <div id="${sectionId}-content" class="hidden bg-gray-50 border-t border-gray-200">
            ${data.items.map(item => `
                <div class="px-4 py-2 border-b border-gray-100 last:border-b-0">
                    <a 
                        href="${item.url}" 
                        target="_blank"
                        onclick="openLink('${item.url}'); return false;"
                        class="flex items-center text-gray-700 hover:text-${data.color}-600 hover:bg-white p-2 rounded-md transition-all duration-200 group"
                    >
                        <i class="fas fa-file-alt text-gray-400 group-hover:text-${data.color}-500 mr-3 text-sm\\"></i>
                        <span class="text-sm flex-grow">${item.title}</span>
                        <i class="fas fa-external-link-alt text-gray-300 group-hover:text-${data.color}-400 ml-2 text-xs flex-shrink-0\\"></i>
                    </a>
                </div>
            `).join('')}
        </div>
    `;
    
    return sectionElement;
}

// 각 카테고리별 하위 섹션을 토글하는 함수들
function toggleKindergartenSubSection(sectionId) {
    toggleDetailedSubSection(sectionId);
}

function toggleElementarySubSection(sectionId) {
    toggleDetailedSubSection(sectionId);
}

function toggleSecondarySubSection(sectionId) {
    toggleDetailedSubSection(sectionId);
}

function toggleSpecialSubSection(sectionId) {
    toggleDetailedSubSection(sectionId);
}

function toggleAdminSubSection(sectionId) {
    toggleDetailedSubSection(sectionId);
}

function toggleStaffSubSection(sectionId) {
    toggleDetailedSubSection(sectionId);
}

/**
 * 모든 하위 섹션의 열고 닫는 동작을 처리하는 공통 함수
 * @param {string} sectionId - 토글할 하위 섹션의 ID
 */
function toggleDetailedSubSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        arrow.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        arrow.style.transform = 'rotate(0deg)';
    }
}

// 각 카테고리별 검색 기능을 수행하는 함수들
function searchKindergarten() {
    const searchTerm = document.getElementById('kindergarten-search').value.toLowerCase();
    const container = document.getElementById('kindergarten-sections');
    searchDetailedItems(searchTerm, kindergartenData, container, 'kindergarten', 'toggleKindergartenSubSection');
}

function searchElementary() {
    const searchTerm = document.getElementById('elementary-search').value.toLowerCase();
    const container = document.getElementById('elementary-sections');
    searchDetailedItems(searchTerm, elementaryData, container, 'elementary', 'toggleElementarySubSection');
}

function searchSecondary() {
    const searchTerm = document.getElementById('secondary-search').value.toLowerCase();
    const container = document.getElementById('secondary-sections');
    searchDetailedItems(searchTerm, secondaryData, container, 'secondary', 'toggleSecondarySubSection');
}

function searchSpecial() {
    const searchTerm = document.getElementById('special-search').value.toLowerCase();
    const container = document.getElementById('special-sections');
    searchDetailedItems(searchTerm, specialData, container, 'special', 'toggleSpecialSubSection');
}

function searchAdmin() {
    const searchTerm = document.getElementById('admin-search').value.toLowerCase();
    const container = document.getElementById('admin-sections');
    searchDetailedItems(searchTerm, adminData, container, 'admin', 'toggleAdminSubSection');
}

function searchStaff() {
    const searchTerm = document.getElementById('staff-search').value.toLowerCase();
    const container = document.getElementById('staff-sections');
    searchDetailedItems(searchTerm, staffData, container, 'staff', 'toggleStaffSubSection');
}

/**
 * 검색어에 따라 항목을 필터링하고 결과를 다시 렌더링하는 함수
 * @param {string} searchTerm - 사용자가 입력한 검색어
 * @param {object} dataObject - 검색할 전체 데이터 객체
 * @param {HTMLElement} containerElement - 결과를 표시할 HTML 컨테이너 요소
 * @param {string} typePrefix - 카테고리 타입 (예: 'elementary')
 * @param {string} toggleFunctionName - 하위 섹션을 토글하는 함수의 이름
 */
function searchDetailedItems(searchTerm, dataObject, containerElement, typePrefix, toggleFunctionName) {
    // 검색어가 비어있으면 전체 목록을 다시 렌더링하고 모든 하위 섹션을 닫음
    if (!searchTerm.trim()) {
        containerElement.innerHTML = ''; 
        Object.entries(dataObject).forEach(([sectionTitle, sectionData]) => {
            const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, typePrefix, toggleFunctionName);
            containerElement.appendChild(sectionElement);
        });
        setTimeout(() => {
            Object.keys(dataObject).forEach(sectionTitle => {
                const sectionId = `${typePrefix}-section-${sectionTitle.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')}`.replace(/\\./g, '-');
                const content = document.getElementById(`${sectionId}-content`);
                const arrow = document.getElementById(`${sectionId}-arrow`);
                if (content && !content.classList.contains('hidden')) { 
                    content.classList.add('hidden');
                    if(arrow) arrow.style.transform = 'rotate(0deg)';
                }
            });
        }, 0); 
        return;
    }
    
    // 검색어와 일치하는 데이터를 필터링
    const filteredData = {};
    Object.entries(dataObject).forEach(([sectionTitle, sectionData]) => {
        const matchingItems = sectionData.items.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            sectionTitle.toLowerCase().includes(searchTerm)
        );
        
        if (matchingItems.length > 0 || sectionTitle.toLowerCase().includes(searchTerm)) {
            filteredData[sectionTitle] = {
                ...sectionData,
                items: sectionTitle.toLowerCase().includes(searchTerm) && matchingItems.length === 0 ? sectionData.items : matchingItems
            };
        }
    });
    
    // 필터링된 결과를 화면에 표시
    containerElement.innerHTML = '';
    if (Object.keys(filteredData).length === 0) {
        containerElement.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-search text-2xl mb-2\\"></i>
                <p>검색 결과가 없습니다.</p>
            </div>
        `;
        return;
    }
    
    Object.entries(filteredData).forEach(([sectionTitle, sectionData]) => {
        const sectionElement = createDetailedSectionHTML(sectionTitle, sectionData, typePrefix, toggleFunctionName);
        containerElement.appendChild(sectionElement);
        
        // 검색 결과에 해당하는 섹션은 자동으로 펼쳐줌
        const sectionId = `${typePrefix}-section-${sectionTitle.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/g, '')}`.replace(/\\./g, '-');
        const sectionTitleMatches = sectionTitle.toLowerCase().includes(searchTerm);
        const itemsMatch = sectionData.items.some(item => item.title.toLowerCase().includes(searchTerm));

        if (sectionTitleMatches || itemsMatch) {
             setTimeout(() => { 
                const content = document.getElementById(`${sectionId}-content`);
                const arrow = document.getElementById(`${sectionId}-arrow`);
                if (content && arrow) {
                    content.classList.remove('hidden');
                    arrow.style.transform = 'rotate(180deg)';
                }
            }, 50); 
        }
    });
}

/**
 * 전달받은 URL을 새 탭으로 열어주는 함수 (모바일 호환성 향상)
 * @param {string} url - 열고자 하는 웹 페이지 주소
 */
function openLink(url) {
    // window.open() 함수를 사용해 새 탭(_blank)으로 URL을 엽니다.
    window.open(url, '_blank');
}

// DOM(문서 객체 모델) 로드가 완료되면 실행될 코드
document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드 시 초기에 실행할 코드가 있다면 여기에 작성합니다.
});
/**
 * 유치원 섹션 관리 스크립트
 */

// 모든 하위 섹션 제목 배열 (검색용) - 다단계 구조 포함
const allSections = [
    // 1. 학사
    '1-1. 유치원 규칙',
    '1-1-1. 교육과정 관련 규칙',
    '1-1-2. 출결 관련 규칙',
    '1-2. 출결 및 전ㆍ출입',
    '1-2-1. 출석부 관리',
    '1-2-2. 전출입 관리',
    '1-3. 유치원 생활기록부',
    '1-3-1. 생활기록부 작성지침',
    '1-3-2. 생활기록부 관리',
    // 2. 교육과정
    '2-1. 교육과정 편성ㆍ운영',
    '2-2. 교육과정 평가',
    '2-3. 유치원 평가',
    '2-4. 자율장학',
    '2-5. 다문화교육',
    '2-6. 인성교육',
    '2-7. 유ㆍ초 이음교육',
    '2-8. 생태전환교육',
    '2-9. 학부모 참여 교육',
    // 3. 방과후과정
    '3-1. 방과후 과정',
    '3-2. 특성화활동',
    // 4. 안전ㆍ보건
    '4-1. 안전교육',
    '4-2. 아동학대 조기 발견 및 관리 대응',
    '4-3-1. 학생건강관리',
    '4-3-2. 감염병 예방 및 관리',
    '4-3-3. 성교육 및 성폭력 예방 교육',
    '4-3-4. 학교 환경 관리',
    // 5. 정보
    '5-1. 유치원 정보공시',
    '5-2. 정보화기기 관리',
    '5-3. 유치원 정보보안',
    '5-4. 개인정보보호',
    '5-5. 나이스교무업무(유치원)'
];

// 각 하위 섹션에 대한 URL 매핑
const subsectionUrls = {
    // 1. 학사 섹션 URLs
    'academic-1-1-1': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTU5ODMxMTN8RHww',
    'academic-1-1-2': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTU5MjA5MDR8RHww',
    'academic-1-2-1': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTU5MjA5MDR8RHww',
    'academic-1-2-2': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTU5MjA5MDR8RHww',
    'academic-1-3-1': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTU4NDc5NDR8RHww',
    'academic-1-3-2': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTU4NDc5NDR8RHww',
    
    // 2. 교육과정 섹션 URLs
    'curriculum-2-1': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTU3NTgwODh8RHww',
    'curriculum-2-2': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTU2NzE4MTd8RHww',
    'curriculum-2-3': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTU2MTA4ODh8RHww',
    'curriculum-2-4': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTQ5Mjk5Mjh8RHww',
    'curriculum-2-5': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTQ4Nzg5ODV8RHww',
    'curriculum-2-6': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTQ4MDUwMDB8RHww',
    'curriculum-2-7': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTQ3Mjg5Njh8RHww',
    'curriculum-2-8': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTQ2NTYyNjV8RHww',
    'curriculum-2-9': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTQzNzkyNzN8RHww',
    
    // 3. 방과후과정 섹션 URLs
    'afterschool-3-1': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTQzMDgzNjF8RHww',
    'afterschool-3-2': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTQyNDEwMzN8RHww',
    
    // 4. 안전ㆍ보건 섹션 URLs
    'safety-4-1': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTQxNTQ1MDV8RHww',
    'safety-4-2': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTQwMzQ0NDB8RHww',
    'safety-4-3-1': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTM5Njg5MDV8RHww',
    'safety-4-3-2': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTM3MjUxOTJ8RHww',
    'safety-4-3-3': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTM2NjA2ODB8RHww',
    'safety-4-3-4': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTM2MTM1Nzd8RHww',
    
    // 5. 정보 섹션 URLs
    'information-5-1': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTMzNjkwOTd8RHww',
    'information-5-2': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTMyNzU0MDB8RHww',
    'information-5-3': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTMyMDYyODF8RHww',
    'information-5-4': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTMwOTk1Mjl8RHww',
    'information-5-5': 'https://kr1-link.drive.worksmobile.com/shared-link/web/pubDLink/oFWhwkeIXddZnYPq7r2p6A.t52EbMKyIatuQglSpxxyCHoGJoITWij03M1o6NBYMkhIH66kHJGGX08_k2mkgyGiSPH56IZGWkIOoBQoUuxrPw?resourceKey=MTAwMDAxNTAxOTEzMDcyfDM0NzI2MDA4NTc4OTMwMTU1NjB8RHww'
};

// 홈으로 돌아가기
function goHome() {
    window.location.href = 'index.html';
}

// 하위 섹션 링크 열기
function openSubsectionLink(sectionKey) {
    const url = subsectionUrls[sectionKey];
    if (url) {
        // 버튼 클릭 효과
        event.currentTarget.classList.add('bg-blue-50');
        setTimeout(() => {
            event.currentTarget.classList.remove('bg-blue-50');
        }, 200);
        
        // 새 탭에서 링크 열기
        window.open(url, '_blank');
        console.log(`섹션 ${sectionKey} 자료 링크 열림: ${url}`);
    } else {
        console.error(`섹션 ${sectionKey}에 대한 URL을 찾을 수 없습니다.`);
        alert('현재 준비 중인 자료입니다.');
    }
}

// 주요 섹션 토글 (펼치기/접기)
function toggleSection(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const icon = document.getElementById(`${sectionId}-icon`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// 하위 섹션 토글 (다단계 구조용)
function toggleSubsection(subsectionId) {
    const content = document.getElementById(`${subsectionId}-content`);
    const icon = document.getElementById(`${subsectionId}-icon`);
    
    if (content && icon) {
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            content.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// 검색 기능
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        if (query === '') {
            searchResults.classList.add('hidden');
            return;
        }
        
        // 검색 결과 필터링
        const filteredSections = allSections.filter(section => 
            section.toLowerCase().includes(query)
        );
        
        if (filteredSections.length > 0) {
            displaySearchResults(filteredSections);
            searchResults.classList.remove('hidden');
        } else {
            searchResults.innerHTML = '<div class="p-4 text-gray-500 text-center">검색 결과가 없습니다.</div>';
            searchResults.classList.remove('hidden');
        }
    });
    
    // 검색창 외부 클릭시 결과 닫기
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.classList.add('hidden');
        }
    });
}

// 검색 결과 표시
function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    const resultsHTML = results.map(section => `
        <div class="search-result-item p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0" 
             onclick="scrollToSection('${section}')">
            <div class="font-medium text-gray-800">${section}</div>
            <div class="text-sm text-gray-600">자료 보기 →</div>
        </div>
    `).join('');
    
    searchResults.innerHTML = resultsHTML;
}

// 특정 섹션으로 스크롤 (다단계 구조 지원)
function scrollToSection(sectionTitle) {
    // 검색 결과 숨기기
    document.getElementById('searchResults').classList.add('hidden');
    document.getElementById('searchInput').value = '';
    
    // 해당 섹션을 포함하는 요소 찾기
    const sectionElement = document.querySelector(`[data-section="${sectionTitle}"]`);
    
    if (sectionElement) {
        // 상위 섹션들 모두 펼치기
        expandParentSections(sectionElement);
        
        // 스크롤 애니메이션
        setTimeout(() => {
            sectionElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // 하이라이트 효과
            sectionElement.classList.add('bg-yellow-100');
            setTimeout(() => {
                sectionElement.classList.remove('bg-yellow-100');
            }, 2000);
        }, 300);
    }
}

// 상위 섹션들 펼치기 (다단계 구조 지원)
function expandParentSections(element) {
    // 주요 섹션 펼치기
    const parentGroup = element.closest('.section-group');
    if (parentGroup) {
        const mainContent = parentGroup.querySelector('[id$="-content"]');
        const mainIcon = parentGroup.querySelector('[id$="-icon"]');
        
        if (mainContent && mainContent.classList.contains('hidden')) {
            mainContent.classList.remove('hidden');
            if (mainIcon) {
                mainIcon.style.transform = 'rotate(180deg)';
            }
        }
    }
    
    // 하위 섹션 펼치기 (학사 섹션의 경우)
    const parentSubsection = element.closest('.subsection-group');
    if (parentSubsection) {
        const subsectionContent = parentSubsection.querySelector('[id*="-content"]');
        const subsectionIcon = parentSubsection.querySelector('[id*="-icon"]');
        
        if (subsectionContent && subsectionContent.classList.contains('hidden')) {
            subsectionContent.classList.remove('hidden');
            if (subsectionIcon) {
                subsectionIcon.style.transform = 'rotate(180deg)';
            }
        }
    }
}

// 키보드 접근성
function initializeKeyboardSupport() {
    document.addEventListener('keydown', function(event) {
        // ESC 키로 검색 결과 닫기
        if (event.key === 'Escape') {
            document.getElementById('searchResults').classList.add('hidden');
        }
        
        // Enter 키로 첫 번째 검색 결과 선택
        if (event.key === 'Enter' && document.activeElement.id === 'searchInput') {
            const firstResult = document.querySelector('.search-result-item');
            if (firstResult) {
                firstResult.click();
            }
        }
    });
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('유치원 페이지가 로드되었습니다.');
    
    // 초기화 함수들 실행
    initializeSearch();
    initializeKeyboardSupport();
    
    // 애니메이션 효과 추가
    const sectionGroups = document.querySelectorAll('.section-group');
    sectionGroups.forEach((group, index) => {
        setTimeout(() => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            group.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
});

// 반응형 처리
function handleResize() {
    const window_width = window.innerWidth;
    
    // 모바일에서 검색창 크기 조정
    if (window_width < 768) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.placeholder = '검색...';
        }
    } else {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.placeholder = '유치원 업무 항목을 검색하세요...';
        }
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);


/**
 * 학교업무 도움자료 메인 스크립트
 * 각 섹션 버튼 클릭 이벤트 처리
 */

// 섹션 선택 함수
function selectSection(sectionType) {
    // 현재는 콘솔에 로그만 출력 (향후 확장 가능)
    console.log(`선택된 섹션: ${sectionType}`);
    
    // 유치원 섹션의 경우 별도 페이지로 이동
    if (sectionType === 'kindergarten') {
        window.location.href = 'kindergarten.html';
        return;
    }
    
    // 나머지 섹션들에 대한 처리
    const sectionNames = {
        'elementary': '초등학교',
        'secondary': '중고등학교',
        'special': '특수학교(급)',
        'administration': '일반행정',
        'clerk': '교무행정원'
    };
    
    const selectedSectionName = sectionNames[sectionType];
    
    // 임시 알림 (향후 각 섹션별 페이지로 대체 예정)
    showNotification(`${selectedSectionName} 섹션이 선택되었습니다. 준비 중입니다.`);
    
    // 버튼 클릭 효과 추가
    addClickEffect(event.currentTarget);
}

// 알림 메시지 표시 함수
function showNotification(message) {
    // 기존 알림이 있다면 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'notification fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 애니메이션으로 표시
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 클릭 효과 함수
function addClickEffect(element) {
    // 클릭 효과를 위한 임시 클래스 추가
    element.classList.add('scale-95');
    
    setTimeout(() => {
        element.classList.remove('scale-95');
    }, 150);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('학교업무 도움자료 페이지가 로드되었습니다.');
    
    // 모든 섹션 카드에 호버 효과 개선
    const sectionCards = document.querySelectorAll('.section-card');
    
    sectionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // 카드 애니메이션 효과
    sectionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// 키보드 접근성 지원
document.addEventListener('keydown', function(event) {
    // Enter 키 또는 스페이스 키로 버튼 활성화
    if (event.key === 'Enter' || event.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.tagName === 'BUTTON') {
            event.preventDefault();
            focusedElement.click();
        }
    }
});


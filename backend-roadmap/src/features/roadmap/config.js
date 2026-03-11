export const STORAGE_KEY = 'completedTasks';

export const CATEGORY_CONFIG = {
    'cat-login': { name: '로그인', priority: '필수', dependencies: [] },
    'cat-dashboard': { name: '홈 대시보드', priority: '필수', dependencies: ['cat-login'] },
    'cat-qa': { name: '사내 문서 Q&A', priority: '필수', dependencies: ['cat-login', 'cat-docs'] },
    'cat-record': { name: '기록 페이지', priority: '권장', dependencies: ['cat-login'] },
    'cat-docs': { name: '인사/행정 문서함', priority: '권장', dependencies: ['cat-login'] },
    'cat-onboarding': { name: '온보딩 진행률', priority: '선택', dependencies: ['cat-login', 'cat-dashboard'] }
};


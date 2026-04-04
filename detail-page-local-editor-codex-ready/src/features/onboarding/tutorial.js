export const BEGINNER_TUTORIAL_STEPS = Object.freeze([
  {
    id: 'slot-select',
    title: '1) 슬롯 선택',
    body: '먼저 [슬롯 지정] 버튼을 눌러 선택한 요소를 슬롯으로 지정하세요.',
    targetElementKey: 'manualSlotButton',
  },
  {
    id: 'replace-image',
    title: '2) 이미지 교체',
    body: '이제 [이미지 넣기] 버튼을 눌러 이미지를 교체하세요.',
    targetElementKey: 'replaceImageButton',
  },
  {
    id: 'save-png',
    title: '3) PNG 저장',
    body: '마지막으로 상단 [PNG] 버튼을 눌러 저장하면 온보딩이 끝나요.',
    targetElementKey: 'exportPngButton',
  },
]);

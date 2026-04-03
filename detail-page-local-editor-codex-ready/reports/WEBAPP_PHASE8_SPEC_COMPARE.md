# WEBAPP PHASE8 스펙 비교표

## 1) validate 스크립트 기준 버튼 ID vs 실제 코드

| 버튼 ID | validate 기대 | index.html | src/main.js(getElementById) | 상태 |
|---|---:|---:|---:|---|
| `openHtmlButton` | Y | Y | Y | ✅ 일치 |
| `openFolderButton` | Y | Y | Y | ✅ 일치 |
| `loadFixtureButton` | Y | Y | Y | ✅ 일치 |
| `applyPasteButton` | Y | Y | Y | ✅ 일치 |
| `replaceImageButton` | Y | Y | Y | ✅ 일치 |
| `manualSlotButton` | Y | Y | Y | ✅ 일치 |
| `demoteSlotButton` | Y | Y | Y | ✅ 일치 |
| `toggleHideButton` | Y | Y | Y | ✅ 일치 |
| `toggleLockButton` | Y | Y | Y | ✅ 일치 |
| `redetectButton` | Y | Y | Y | ✅ 일치 |
| `textEditButton` | Y | Y | Y | ✅ 일치 |
| `undoButton` | Y | Y | Y | ✅ 일치 |
| `redoButton` | Y | Y | Y | ✅ 일치 |
| `restoreAutosaveButton` | Y | Y | Y | ✅ 일치 |
| `downloadEditedButton` | Y | Y | Y | ✅ 일치 |
| `downloadNormalizedButton` | Y | Y | Y | ✅ 일치 |
| `downloadLinkedZipButton` | Y | Y | Y | ✅ 일치 |
| `exportPresetSelect` | Y | Y | Y | ✅ 일치 |
| `exportPngButton` | Y | Y | Y | ✅ 일치 |
| `exportJpgButton` | Y | Y | Y | ✅ 일치 |
| `exportSectionsZipButton` | Y | Y | Y | ✅ 일치 |
| `exportSelectionPngButton` | Y | Y | Y | ✅ 일치 |
| `exportPresetPackageButton` | Y | Y | Y | ✅ 일치 |
| `downloadReportButton` | Y | Y | Y | ✅ 일치 |
| `replaceImageInput` | Y | Y | Y | ✅ 일치 |
| `previewFrame` | Y | Y | Y | ✅ 일치 |
| `slotList` | Y | Y | Y | ✅ 일치 |
| `selectionInspector` | Y | Y | Y | ✅ 일치 |
| `assetFilterInput` | Y | Y | Y | ✅ 일치 |
| `preflightContainer` | Y | Y | Y | ✅ 일치 |
| `preflightRefreshButton` | Y | Y | Y | ✅ 일치 |
| `layerTree` | Y | Y | Y | ✅ 일치 |
| `layerFilterInput` | Y | Y | Y | ✅ 일치 |
| `textFontSizeInput` | Y | Y | Y | ✅ 일치 |
| `textLineHeightInput` | Y | Y | Y | ✅ 일치 |
| `textLetterSpacingInput` | Y | Y | Y | ✅ 일치 |
| `textWeightSelect` | Y | Y | Y | ✅ 일치 |
| `textColorInput` | Y | Y | Y | ✅ 일치 |
| `applyTextStyleButton` | Y | Y | Y | ✅ 일치 |
| `clearTextStyleButton` | Y | Y | Y | ✅ 일치 |
| `batchSelectionSummary` | Y | Y | Y | ✅ 일치 |
| `duplicateButton` | Y | Y | Y | ✅ 일치 |
| `deleteButton` | Y | Y | Y | ✅ 일치 |
| `addTextButton` | Y | Y | Y | ✅ 일치 |
| `addBoxButton` | Y | Y | Y | ✅ 일치 |
| `addSlotButton` | Y | Y | Y | ✅ 일치 |
| `geometryXInput` | Y | Y | Y | ✅ 일치 |
| `geometryYInput` | Y | Y | Y | ✅ 일치 |
| `geometryWInput` | Y | Y | Y | ✅ 일치 |
| `geometryHInput` | Y | Y | Y | ✅ 일치 |
| `applyGeometryButton` | Y | Y | Y | ✅ 일치 |
| `bringForwardButton` | Y | Y | Y | ✅ 일치 |
| `sendBackwardButton` | Y | Y | Y | ✅ 일치 |
| `bringToFrontButton` | Y | Y | Y | ✅ 일치 |
| `sendToBackButton` | Y | Y | Y | ✅ 일치 |
| `imageNudgeLeftButton` | Y | Y | Y | ✅ 일치 |
| `imageNudgeRightButton` | Y | Y | Y | ✅ 일치 |
| `imageNudgeUpButton` | Y | Y | Y | ✅ 일치 |
| `imageNudgeDownButton` | Y | Y | Y | ✅ 일치 |

## 2) validate 스크립트 기준 editor 메서드 vs 실제 코드

| 메서드명 | validate 기대 | src/editor/frame-editor.js 문자열 존재 | 상태 |
|---|---:|---:|---|
| `toggleTextEdit` | Y | Y | ✅ 일치 |
| `captureSnapshot` | Y | Y | ✅ 일치 |
| `exportFullPngBlob` | Y | Y | ✅ 일치 |
| `exportSectionPngEntries` | Y | Y | ✅ 일치 |
| `getLinkedPackageEntries` | Y | Y | ✅ 일치 |
| `applyFiles` | Y | Y | ✅ 일치 |
| `removeImageFromSelected` | Y | Y | ✅ 일치 |
| `markSelectedAsSlot` | Y | Y | ✅ 일치 |
| `demoteSelectedSlot` | Y | Y | ✅ 일치 |
| `getCurrentPortableHtml` | Y | Y | ✅ 일치 |
| `applyTextStyle` | Y | Y | ✅ 일치 |
| `applyBatchLayout` | Y | Y | ✅ 일치 |
| `getPreflightReport` | Y | Y | ✅ 일치 |
| `selectNodeByUid` | Y | Y | ✅ 일치 |
| `refreshDerivedMeta` | Y | Y | ✅ 일치 |
| `toggleSelectedHidden` | Y | Y | ✅ 일치 |
| `toggleSelectedLocked` | Y | Y | ✅ 일치 |
| `toggleLayerHiddenByUid` | Y | Y | ✅ 일치 |
| `toggleLayerLockedByUid` | Y | Y | ✅ 일치 |
| `duplicateSelected` | Y | Y | ✅ 일치 |
| `deleteSelected` | Y | Y | ✅ 일치 |
| `addTextElement` | Y | Y | ✅ 일치 |
| `addBoxElement` | Y | Y | ✅ 일치 |
| `addSlotElement` | Y | Y | ✅ 일치 |
| `applyGeometryPatch` | Y | Y | ✅ 일치 |
| `bringSelectedForward` | Y | Y | ✅ 일치 |
| `sendSelectedBackward` | Y | Y | ✅ 일치 |
| `bringSelectedToFront` | Y | Y | ✅ 일치 |
| `sendSelectedToBack` | Y | Y | ✅ 일치 |
| `nudgeSelectedImage` | Y | Y | ✅ 일치 |
| `exportFullJpgBlob` | Y | Y | ✅ 일치 |
| `exportSelectionPngBlob` | Y | Y | ✅ 일치 |

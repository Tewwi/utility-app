# Ke hoach tinh nang PDF Word Search

## Muc tieu

Xay dung mot utility cho phep nguoi dung tai len toi da 5 file PDF, bao gom ca PDF scan, trich xuat noi dung van ban, tim nhieu tu hoac cum tu cung luc tren tat ca file, va hien thi bang thong ke so lan xuat hien cua tung tu/cum tu. Tinh nang phai nam trong giao dien utility hien co, su dung theme token cua du an, va tuan thu `AGENTS.md`.

## Pham vi

- Tao trang tool moi, du kien tai `/tools/pdf-word-search`.
- Cho phep upload toi da 5 file `.pdf` trong mot lan phan tich.
- Doc PDF co text layer bang `pdfjs-dist`.
- Ho tro PDF scan bang OCR fallback, du kien dung `tesseract.js`.
- Cho phep nhap nhieu tu/cum tu can tim cung luc.
- Hien thi bang thong ke tong hop gom tu khoa, so lan xuat hien tren tat ca file, ty le tren tong so ket qua, file co ket qua, va trang co ket qua.
- Cho phep xem chi tiet ket qua theo tung file PDF.
- Hien thi trang thai xu ly: chua co file, dang doc PDF, dang OCR, hoan tat, loi.
- Uu tien xu ly client-side de khong upload file len server.

## Ngoai pham vi ban dau

- Khong luu file PDF len server.
- Khong can tim kiem bang semantic search.
- Khong can highlight truc tiep tren viewer PDF trong phien ban dau.
- Khong can upload hon 5 file cung luc trong phien ban dau.

## Huong UX

Trang tool nen bam theo pattern hien co cua `ToolPageShell` va cac card trong du an:

- Header tool:
  - icon lien quan den PDF/search.
  - ten tool: `PDF Word Search`.
  - mo ta ngan: dem so lan xuat hien cua nhieu tu/cum tu trong toi da 5 PDF, co OCR cho file scan.
  - button reset voi icon `RotateCcw`.
  - button chay lai phan tich voi icon `Play` hoac `Search`.

- Khu vuc input:
  - dropzone upload PDF voi border `border-dashed border-border`, nen `bg-card` hoac `bg-background`.
  - input file dung `multiple`, nhan toi da 5 file PDF.
  - danh sach file da chon: ten file, dung luong, so trang neu doc duoc, trang thai xu ly, va nut xoa tung file.
  - canh bao ro rang khi nguoi dung chon qua 5 file; chi nhan 5 file hop le dau tien hoac yeu cau xoa bot truoc khi them.
  - textarea nhap danh sach tu khoa, moi dong mot tu/cum tu.
  - tuy chon:
    - checkbox/toggle `Case sensitive`.
    - checkbox/toggle `Match whole word`.
    - checkbox/toggle `Enable OCR for scanned pages`.
    - select ngon ngu OCR, mac dinh `eng`, co the mo rong `vie`.

- Khu vuc output:
  - summary row: tong file, tong trang, tong ky tu, tong tu khoa, tong ket qua.
  - bang thong ke tong hop responsive.
  - bang hoac panel chi tiet theo file de biet tu khoa xuat hien o file nao, trang nao.
  - empty state khi chua co ket qua.
  - progress bar hoac progress text khi dang xu ly tung file va tung trang.

Tat ca style can dung class Tailwind theo token hien co: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `border-input`, `bg-primary`, `text-primary`, `bg-muted/50`, `focus:border-ring`. Khong tao palette mau rieng.

## Kien truc de xuat

### Route va registry

- Them utility vao `src/lib/utilities.ts`:
  - icon: co the dung `FileSearch`, `FileText`, hoac `SearchCheck` tu `lucide-react`.
  - category: `Content`.
  - status: `Draft` trong giai doan dau, doi sang `Ready` khi co test va UX hoan tat.
  - accent nen dung token san co, vi du `bg-primary/10 text-primary`.

- Them config vao `src/lib/tool-pages.ts` neu tiep tuc dung pattern registry hien co.

- Tao route:
  - `src/app/tools/pdf-word-search/page.tsx`.
  - File nay chi export mot React component page, dung component tool chinh duoc import tu `src/components/pdf-word-search`.

### Components

Theo `AGENTS.md`, moi file component moi chi nen dinh nghia mot React component. De xuat tach:

- `src/components/pdf-word-search/pdf-word-search-tool.tsx`
  - component tong dieu phoi UI.
- `src/components/pdf-word-search/pdf-upload-panel.tsx`
  - dropzone, danh sach file, nut xoa file, loi file.
- `src/components/pdf-word-search/search-terms-panel.tsx`
  - textarea danh sach tu khoa va tuy chon tim kiem.
- `src/components/pdf-word-search/pdf-processing-status.tsx`
  - hien thi progress va trang thai xu ly.
- `src/components/pdf-word-search/search-results-table.tsx`
  - bang thong ke tong hop ket qua.
- `src/components/pdf-word-search/file-results-table.tsx`
  - bang chi tiet ket qua theo file.
- `src/components/pdf-word-search/pdf-summary-panel.tsx`
  - cac chi so tong quan tren tat ca file.

Neu can cac button/icon lap lai, uu tien dung component/common hien co hoac tao component rieng, moi file mot component.

### Hooks

- `src/hooks/use-pdf-word-search.ts`
  - quan ly state danh sach file, search terms, options, progress, ket qua.
  - goi cac helper trong `src/lib/pdf-word-search`.
  - file nay chi dinh nghia mot hook.

Neu can them hook rieng:

- `src/hooks/use-pdf-dropzone.ts`
  - xu ly drag/drop, validate file, gioi han toi da 5 file.

### Lib helpers

Standalone functions phai tach ra file helper rieng:

- `src/lib/pdf-word-search/extract-pdf-text.ts`
  - doc text layer bang `pdfjs-dist`.
- `src/lib/pdf-word-search/extract-scanned-page-text.ts`
  - OCR mot page scan bang `tesseract.js`.
- `src/lib/pdf-word-search/count-search-terms.ts`
  - dem ket qua cho nhieu tu/cum tu tren nhieu file.
- `src/lib/pdf-word-search/create-pdf-file-record.ts`
  - chuyen `File` thanh record noi bo co id on dinh va metadata.
- `src/lib/pdf-word-search/normalize-search-term.ts`
  - lam sach input tu khoa.
- `src/lib/pdf-word-search/build-search-regex.ts`
  - tao regex theo options `caseSensitive` va `wholeWord`.
- `src/lib/pdf-word-search/format-file-size.ts`
  - hien thi dung luong file.
- `src/lib/pdf-word-search/types.ts`
  - types dung chung cho feature.
- `src/lib/pdf-word-search/index.ts`
  - export cac helper can public neu can.

## Data model de xuat

```ts
export type PdfWordSearchOptions = {
  caseSensitive: boolean;
  wholeWord: boolean;
  enableOcr: boolean;
  ocrLanguage: string;
};

export type PdfFileRecord = {
  id: string;
  file: File;
  name: string;
  size: number;
  status: "queued" | "reading" | "ocr" | "complete" | "error";
  error?: string;
};

export type PdfPageText = {
  fileId: string;
  fileName: string;
  pageNumber: number;
  text: string;
  source: "text-layer" | "ocr";
};

export type SearchTermResult = {
  term: string;
  count: number;
  fileCount: number;
  matchesByFile: SearchTermFileResult[];
  percentage: number;
};

export type SearchTermFileResult = {
  fileId: string;
  fileName: string;
  count: number;
  pages: number[];
};
```

## Xu ly PDF va OCR

1. Validate file list:
   - chi chap nhan `application/pdf` hoac ten file ket thuc bang `.pdf`.
   - gioi han toi da 5 file PDF.
   - gioi han dung luong ban dau, vi du 25 MB moi file va 75 MB tong cong, de tranh treo UI.
   - neu co file khong hop le, hien loi rieng cho file do va khong dua vao hang doi xu ly.

2. Text extraction:
   - dung `pdfjs-dist` de load tung file tu `ArrayBuffer`.
   - xu ly file theo hang doi, mac dinh tuan tu de giam ap luc CPU/memory.
   - lap qua tung page va lay text content.
   - moi page text can gan `fileId` va `fileName`.
   - neu page co text layer rong hoac qua ngan, danh dau can OCR neu `enableOcr` dang bat.

3. OCR fallback:
   - render page PDF thanh canvas o scale vua phai.
   - dua anh page vao `tesseract.js`.
   - cap nhat progress theo file va page de nguoi dung thay duoc tien trinh.
   - OCR nen chay co gioi han, tranh render qua nhieu file hoac nhieu page cung luc.

4. Counting:
   - normalize danh sach tu khoa: trim, bo dong rong, collapse duplicate.
   - voi moi tu khoa, tao regex theo options.
   - dem tren tung `PdfPageText` cua tat ca file.
   - gom ket qua theo `term`, sau do theo `fileId`.
   - luu danh sach file va page co match de hien bang tong hop va chi tiet.

## Bang thong ke

Cot de xuat:

- `Term`
- `Count`
- `Files`
- `Pages`
- `Share`
- `Source coverage`

Hanh vi:

- sap xep mac dinh theo `Count` giam dan.
- cot `Files` hien so file co match, co the hien tooltip/title danh sach ten file.
- cot `Pages` co the hien tom tat theo dang `file-a.pdf: 1, 3; file-b.pdf: 2`.
- co the filter ket qua bang input nho trong bang o phase sau.
- tren mobile, bang can scroll ngang bang `overflow-x-auto`, khong de text chen nhau.

Bang chi tiet theo file:

- `File`
- `Term`
- `Count`
- `Pages`
- `Text source`

## Error states

- File khong phai PDF.
- File qua lon.
- Qua gioi han 5 file.
- Tong dung luong file qua lon.
- PDF khong doc duoc hoac bi password.
- OCR bi loi hoac thieu language data.
- Khong co tu khoa hop le.
- Mot hoac nhieu PDF khong co text va OCR dang tat.

Moi loi nen hien thi trong card `border-destructive/40` hoac text `text-destructive`, van giu nen/theme hien co.

## Dependencies can them

Du an hien chua co dependency PDF/OCR. Khi bat dau implement can can nhac:

```bash
npm install pdfjs-dist tesseract.js
```

Neu bundle size la van de, co the lazy import cac thu vien nay trong helper hoac component client-side chi khi nguoi dung upload file.

## Performance

- Khong OCR toan bo file neu text layer da du.
- Cap nhat progress theo file va page.
- Gioi han file/page OCR dong thoi, mac dinh xu ly tuan tu.
- Lazy import `pdfjs-dist` va `tesseract.js`.
- Sau khi reset hoac xoa file, giai phong object URL/canvas neu co.
- Cho phep huy hang doi xu ly khi nguoi dung reset hoac xoa file dang cho.
- Can nhac Web Worker cho OCR neu UI bi giat.

## Accessibility

- Dropzone phai co input file that, label ro rang.
- Button co `aria-label` khi chi dung icon.
- Progress co text trang thai, khong chi dua vao mau.
- Table co header semantic.
- Error message gan voi input lien quan neu co the.

## Test plan

- Unit test helper:
  - normalize danh sach tu khoa.
  - build regex voi `caseSensitive` va `wholeWord`.
  - validate toi da 5 file.
  - count nhieu tu/cum tu tren nhieu page va nhieu file.
  - tinh percentage, fileCount, matchesByFile va pages.

- Manual test:
  - upload 1 PDF co text layer.
  - upload 5 PDF hop le.
  - upload qua 5 PDF.
  - ket hop PDF co text layer va PDF scan anh trong cung mot lan tim.
  - PDF rong hoac khong doc duoc.
  - tu khoa trung lap.
  - tim cum tu co dau cach.
  - che do case-sensitive.
  - whole-word voi dau cau.
  - responsive desktop/mobile.
  - dark/light theme.

## Trinh tu trien khai de xuat

1. Them utility registry va route skeleton.
2. Tao UI static theo theme hien co.
3. Them hook state va validate danh sach file toi da 5 PDF.
4. Them helper doc text layer bang `pdfjs-dist`.
5. Them helper count search terms tren nhieu file va bang ket qua tong hop.
6. Them OCR fallback bang `tesseract.js`.
7. Them progress/error states.
8. Toi uu bundle bang lazy import.
9. Chay `npm run lint` va `npm run build`.
10. Kiem tra UI tren desktop/mobile va dark/light theme.

## Tieu chi hoan thanh

- Nguoi dung upload toi da 5 PDF va nhap nhieu tu/cum tu cung luc.
- App hien thi so lan xuat hien cua tung tu/cum tu tren tat ca file trong bang thong ke tong hop.
- App hien thi chi tiet ket qua theo tung file PDF.
- PDF scan co the duoc OCR khi bat tuy chon OCR.
- UI nhat quan voi app shell, card, radius, border, typography va theme token hien co.
- File moi tuan thu `AGENTS.md`: moi component/hook mot file, helper tach rieng trong `src/lib` hoac feature-level helper.
- `npm run lint` va `npm run build` pass.

const REGIONS = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
];

const TAX_TYPE_TO_INDUSTRY = {
  "농업, 임업 및 어업": "서비스업",
  광업: "제조업",
  제조업: "제조업",
  "전기, 가스, 증기 및 공기조절 공급업": "서비스업",
  "수도, 하수 및 폐기물 처리, 원료 재생업": "서비스업",
  건설업: "서비스업",
  "도매 및 소매업": "도소매업",
  "운수 및 창고업": "서비스업",
  "숙박 및 음식점업": "음식점업",
  정보통신업: "IT/소프트웨어",
  "금융 및 보험업": "서비스업",
  부동산업: "서비스업",
  "전문, 과학 및 기술 서비스업": "서비스업",
  "사업시설 관리, 사업 지원 및 임대 서비스업": "서비스업",
  "교육 서비스업": "서비스업",
  "보건업 및 사회복지 서비스업": "서비스업",
  "예술, 스포츠 및 여가관련 서비스업": "콘텐츠",
  "협회 및 단체, 수리 및 기타 개인 서비스업": "서비스업",
};

const supportPrograms = [
  {
    id: "seoul-small-2026",
    title: "서울 소상공인 경영안정 지원자금",
    agency: "서울신용보증재단",
    type: "정책자금",
    regions: ["서울"],
    industries: ["음식점업", "도소매업", "서비스업"],
    businessTypes: ["개인사업자", "법인사업자"],
    maxRevenue: 10,
    maxEmployees: 5,
    maxBusinessAgeYears: 7,
    amount: 7000,
    deadline: "2026-06-14",
    url: "https://www.bizinfo.go.kr/",
    description: "서울 소재 소상공인의 운전자금과 경영 안정화를 지원하는 정책자금 성격의 사업입니다.",
    required: ["사업자등록증", "매출 증빙", "상시근로자 확인서류"],
  },
  {
    id: "startup-voucher-2026",
    title: "창업기업 디지털 전환 바우처",
    agency: "중소벤처기업부",
    type: "바우처",
    regions: ["전국"],
    industries: ["IT/소프트웨어", "콘텐츠", "서비스업", "도소매업", "음식점업"],
    businessTypes: ["개인사업자", "법인사업자"],
    maxRevenue: 50,
    maxEmployees: 50,
    maxBusinessAgeYears: 7,
    needsStartup: true,
    amount: 1500,
    deadline: "2026-07-05",
    url: "https://www.smes.go.kr/",
    description: "초기 창업기업의 온라인 판매, 고객관리, 예약/주문 시스템 도입 비용을 일부 보조합니다.",
    required: ["사업계획서", "사업자등록증", "견적서"],
  },
  {
    id: "export-boost-2026",
    title: "수출 중소기업 해외마케팅 패키지",
    agency: "KOTRA",
    type: "수출지원",
    regions: ["전국"],
    industries: ["제조업", "IT/소프트웨어", "콘텐츠"],
    businessTypes: ["법인사업자", "개인사업자"],
    maxRevenue: 999,
    maxEmployees: 300,
    needsExports: true,
    amount: 3000,
    deadline: "2026-06-03",
    url: "https://www.kotra.or.kr/",
    description: "수출을 준비하거나 이미 수출 실적이 있는 중소기업의 해외 전시, 바이어 발굴, 마케팅을 지원합니다.",
    required: ["수출실적증명", "제품소개서", "사업자등록증"],
  },
  {
    id: "female-founder-2026",
    title: "여성기업 판로개척 지원사업",
    agency: "한국여성경제인협회",
    type: "판로지원",
    regions: ["전국"],
    industries: ["도소매업", "제조업", "콘텐츠", "서비스업"],
    businessTypes: ["개인사업자", "법인사업자"],
    maxRevenue: 50,
    maxEmployees: 100,
    needsFemaleOwned: true,
    amount: 1000,
    deadline: "2026-06-28",
    url: "https://www.wbiz.or.kr/",
    description: "여성기업의 온라인 기획전, 홍보 콘텐츠 제작, 전시 참가를 지원하는 사업입니다.",
    required: ["여성기업확인서", "사업자등록증", "제품/서비스 소개자료"],
  },
  {
    id: "smart-factory-2026",
    title: "중소 제조기업 스마트공정 개선",
    agency: "중소벤처기업부",
    type: "시설/기술",
    regions: ["전국"],
    industries: ["제조업"],
    businessTypes: ["법인사업자", "개인사업자"],
    maxRevenue: 999,
    maxEmployees: 300,
    amount: 5000,
    deadline: "2026-08-20",
    url: "https://www.bizinfo.go.kr/",
    description: "제조 현장의 생산성 개선을 위한 설비, 공정 자동화, 데이터 수집 시스템 구축을 지원합니다.",
    required: ["공장등록증", "사업계획서", "견적서"],
  },
  {
    id: "youth-local-2026",
    title: "청년 로컬브랜드 성장지원",
    agency: "지방자치단체",
    type: "보조금",
    regions: ["서울", "경기", "인천", "부산"],
    industries: ["음식점업", "콘텐츠", "서비스업", "도소매업"],
    businessTypes: ["개인사업자", "법인사업자"],
    maxRevenue: 10,
    maxEmployees: 10,
    maxOwnerAge: 39,
    maxBusinessAgeYears: 5,
    amount: 2000,
    deadline: "2026-06-09",
    url: "https://www.bizinfo.go.kr/",
    description: "청년 대표자가 운영하는 지역 기반 브랜드의 제품 개선, 브랜딩, 마케팅 실행비를 지원합니다.",
    required: ["대표자 신분증", "사업자등록증", "브랜드 소개서"],
  },
];

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

const state = {
  matches: [],
  sortMode: "score",
  userPath: "founder",
  extractedBusiness: null,
  programs: null,
  programsSource: "샘플",
};

const form = document.querySelector("#businessForm");
const resultList = document.querySelector("#resultList");
const summaryTitle = document.querySelector("#summaryTitle");
const sortMode = document.querySelector("#sortMode");
const fileInput = document.querySelector("#certificate");
const fileName = document.querySelector("#fileName");
const pathButtons = document.querySelectorAll(".path-card");
const businessFields = document.querySelector(".business-fields");
const ocrStatus = document.querySelector("#ocrStatus");
const extractedInfo = document.querySelector("#extractedInfo");
const businessConfirm = document.querySelector("#businessConfirm");
const confirmRegion = document.querySelector("#confirmRegion");
const confirmTaxBusinessType = document.querySelector("#confirmTaxBusinessType");
const confirmIndustry = document.querySelector("#confirmIndustry");
const confirmOpenedAt = document.querySelector("#confirmOpenedAt");
const confirmYouth = document.querySelector("#confirmYouth");
const confirmFemale = document.querySelector("#confirmFemale");
const confirmExport = document.querySelector("#confirmExport");
const confirmStartup = document.querySelector("#confirmStartup");

fileInput.addEventListener("change", async () => {
  fileName.textContent = fileInput.files[0]
    ? `${fileInput.files[0].name} 선택됨`
    : "이미지 또는 PDF 파일을 올리면 정보를 읽어옵니다.";

  if (state.userPath === "business" && fileInput.files[0]) {
    await readBusinessCertificate(fileInput.files[0]);
  }
});

pathButtons.forEach((button) => {
  button.addEventListener("click", () => setUserPath(button.dataset.path));
});

[confirmRegion, confirmTaxBusinessType, confirmIndustry, confirmOpenedAt, confirmYouth, confirmFemale, confirmExport, confirmStartup].forEach(
  (control) => {
    control.addEventListener("change", () => {
      if (control === confirmTaxBusinessType && TAX_TYPE_TO_INDUSTRY[confirmTaxBusinessType.value]) {
        confirmIndustry.value = TAX_TYPE_TO_INDUSTRY[confirmTaxBusinessType.value];
      }
      if (state.userPath === "business" && state.extractedBusiness) {
        form.requestSubmit();
      }
    });
  },
);

sortMode.addEventListener("change", () => {
  state.sortMode = sortMode.value;
  renderMatches();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (state.userPath === "business" && !fileInput.files[0]) {
    renderUploadPrompt();
    return;
  }

  const profile = getProfile();
  const programs = await getSupportPrograms();
  state.matches = programs.map((program) => matchProgram(profile, program));
  renderMatches(profile.companyName);
});

async function getSupportPrograms() {
  if (state.programs) return state.programs;

  try {
    const response = await fetch("./api/bizinfo?searchCnt=100&pageUnit=50&pageIndex=1", {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`API ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.programs) || data.programs.length === 0) {
      throw new Error("No programs from Bizinfo API.");
    }
    state.programs = data.programs.map(normalizeProgramFromApi);
    state.programsSource = `기업마당 · ${data.fetchedAt ? data.fetchedAt.slice(0, 10) : "실시간"}`;
    return state.programs;
  } catch (error) {
    state.programs = supportPrograms;
    state.programsSource = "샘플 데이터";
    return state.programs;
  }
}

function normalizeProgramFromApi(program) {
  return {
    id: program.id,
    source: program.source || "기업마당",
    title: program.title || "지원사업 공고",
    agency: program.agency || "기업마당",
    type: program.type || "보조금",
    regions: Array.isArray(program.regions) && program.regions.length ? program.regions : ["전국"],
    industries: Array.isArray(program.industries) && program.industries.length ? program.industries : ["서비스업"],
    businessTypes:
      Array.isArray(program.businessTypes) && program.businessTypes.length
        ? program.businessTypes
        : ["개인사업자", "법인사업자", "예비창업자"],
    maxRevenue: program.maxRevenue ?? null,
    maxEmployees: program.maxEmployees ?? null,
    maxBusinessAgeYears: program.maxBusinessAgeYears ?? null,
    maxOwnerAge: program.maxOwnerAge ?? null,
    needsStartup: Boolean(program.needsStartup),
    needsExports: Boolean(program.needsExports),
    needsFemaleOwned: Boolean(program.needsFemaleOwned),
    amount: program.amount ?? null,
    deadline: program.deadline || "",
    url: program.url || "https://www.bizinfo.go.kr/",
    description: program.description || "지원사업 공고입니다. 상세 조건은 원문 공고를 확인하세요.",
    required: Array.isArray(program.required) && program.required.length ? program.required : ["공고문 확인"],
    eligibilityText: program.eligibilityText || "",
    collectedAt: program.collectedAt || "",
  };
}

function getProfile() {
  const data = new FormData(form);

  if (state.userPath === "business") {
    const extracted = state.extractedBusiness || {};
    const isYouth = confirmYouth.checked;
    const openedAt = confirmOpenedAt.value || null;
    const businessAgeYears = openedAt ? yearsFrom(openedAt) : extracted.businessAgeYears;

    return {
      companyName: extracted.companyName || "업로드 사업자",
      businessType: extracted.businessType || "개인사업자",
      region: confirmRegion.value || null,
      industry: confirmIndustry.value || null,
      revenue: null,
      employees: null,
      ownerAge: isYouth ? 34 : null,
      businessAgeYears: confirmStartup.checked ? businessAgeYears : null,
      exports: confirmExport.checked,
      femaleOwned: confirmFemale.checked,
      startup: confirmStartup.checked,
      venture: false,
      source: "business",
    };
  }

  return {
    companyName: "예비창업자",
    businessType: "개인사업자",
    region: data.get("region"),
    industry: data.get("industry"),
    revenue: Number(data.get("revenue")),
    employees: Number(data.get("employees")),
    ownerAge: Number(data.get("ownerAge")),
    businessAgeYears: 0,
    exports: data.get("exports") === "on",
    femaleOwned: data.get("femaleOwned") === "on",
    startup: data.get("startup") === "on",
    venture: data.get("venture") === "on",
    source: "founder",
  };
}

function setUserPath(path) {
  state.userPath = path;
  form.classList.toggle("founder-mode", path === "founder");
  form.classList.toggle("business-mode", path === "business");
  businessFields.hidden = false;
  fileInput.required = path === "business";

  pathButtons.forEach((button) => {
    const selected = button.dataset.path === path;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  if (path === "founder") {
    form.requestSubmit();
  } else if (state.extractedBusiness) {
    form.requestSubmit();
  } else {
    renderUploadPrompt();
  }
}

async function readBusinessCertificate(file) {
  if (!window.Tesseract) {
    setOcrStatus("error", "OCR 라이브러리를 불러오지 못했습니다. 인터넷 연결 상태를 확인한 뒤 다시 시도해주세요.");
    renderUploadPrompt();
    return;
  }

  if (!isImageFile(file) && !isPdfFile(file)) {
    setOcrStatus("error", "JPG, PNG, PDF 파일만 읽을 수 있습니다.");
    renderUploadPrompt();
    return;
  }

  state.extractedBusiness = null;
  extractedInfo.hidden = true;
  extractedInfo.replaceChildren();
  businessConfirm.hidden = true;
  setOcrStatus("loading", "사업자등록증을 읽는 중입니다. 처음 실행할 때는 시간이 조금 걸릴 수 있습니다.");

  try {
    const text = normalizeOcrText(await recognizeCertificateFile(file));
    state.extractedBusiness = parseBusinessCertificate(text);
    syncBusinessConfirm(state.extractedBusiness);
    renderExtractedInfo(state.extractedBusiness);
    setOcrStatus("ready", "인식값을 확인했습니다. 지역/업종이 다르면 아래 선택값을 바꿔주세요.");
    form.requestSubmit();
  } catch (error) {
    setOcrStatus("error", "OCR 처리에 실패했습니다. 더 선명한 이미지로 다시 올려주세요.");
    renderUploadPrompt();
  }
}

async function recognizeCertificateFile(file) {
  if (isPdfFile(file)) {
    return recognizePdfFile(file);
  }

  return recognizeImageLike(file, "사업자등록증을 읽는 중입니다.");
}

function isImageFile(file) {
  return file.type.startsWith("image/");
}

function isPdfFile(file) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

async function recognizeImageLike(imageSource, messagePrefix) {
  const result = await Tesseract.recognize(imageSource, "kor+eng", {
    logger(progress) {
      if (progress.status === "recognizing text") {
        setOcrStatus("loading", `${messagePrefix} ${Math.round(progress.progress * 100)}%`);
      }
    },
  });
  return result.data.text;
}

async function recognizePdfFile(file) {
  const pdfjsLib = await loadPdfJs();
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pageCount = Math.min(pdf.numPages, 2);
  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    setOcrStatus("loading", `PDF ${pageNumber}/${pageCount}페이지를 이미지로 변환하는 중입니다.`);
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2.2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvasContext: context, viewport }).promise;

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) continue;
    const pageText = await recognizeImageLike(blob, `PDF ${pageNumber}/${pageCount}페이지 OCR 중입니다.`);
    pageTexts.push(pageText);
  }

  if (pdf.numPages > pageCount) {
    setOcrStatus("loading", `앞 ${pageCount}페이지만 읽었습니다. 사업자등록증은 보통 첫 페이지에 있습니다.`);
  }

  return pageTexts.join("\n");
}

async function loadPdfJs() {
  if (window.pdfjsLib) {
    configurePdfWorker(window.pdfjsLib);
    return window.pdfjsLib;
  }

  const module = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs");
  configurePdfWorker(module);
  return module;
}

function configurePdfWorker(pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
}

function normalizeOcrText(text) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[|]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function parseBusinessCertificate(text) {
  const openedAt = extractDateAfter(text);
  const businessAgeYears = openedAt ? yearsFrom(openedAt) : null;
  const companyName = extractValue(text, [
    /상\s*호\s*[:：]?\s*([^\n]+)/,
    /법인명\s*[:：]?\s*([^\n]+)/,
    /단체명\s*[:：]?\s*([^\n]+)/,
  ]);
  const businessNumber = extractValue(text, [
    /등록\s*번호\s*[:：]?\s*([0-9]{3}\s*-?\s*[0-9]{2}\s*-?\s*[0-9]{5})/,
    /([0-9]{3}\s*-?\s*[0-9]{2}\s*-?\s*[0-9]{5})/,
  ]);
  const taxFields = extractTaxIndustryFields(text);
  const industryText = taxFields.item || taxFields.type || extractValue(text, [
    /종\s*목\s*[:：]?\s*([^\n]+)/,
    /업\s*태\s*[:：]?\s*([^\n]+)/,
  ]);
  const taxBusinessType = taxFields.type;
  const taxBusinessItem = taxFields.item;
  const normalizedTaxBusinessType =
    normalizeTaxBusinessType(taxBusinessType) ||
    inferTaxBusinessType(`${taxBusinessType} ${taxBusinessItem} ${industryText} ${text}`);
  const recommendedIndustry =
    TAX_TYPE_TO_INDUSTRY[normalizedTaxBusinessType] || inferIndustry(industryText || text);
  const corporateNumber = extractCorporateNumber(text);
  const representativeBirthDate = extractRepresentativeBirthDate(text);
  const businessType = corporateNumber || /법인등록번호|법인명|주식회사|\(주\)|법인사업자/.test(text)
    ? "법인사업자"
    : "개인사업자";

  return {
    companyName: cleanExtractedValue(companyName) || "업로드 사업자",
    businessNumber: cleanExtractedValue(businessNumber) || "인식 필요",
    corporateNumber: corporateNumber || "해당 없음",
    representativeBirthDate: representativeBirthDate || "인식 필요",
    businessType,
    region: inferRegion(text),
    industry: recommendedIndustry,
    taxBusinessType: normalizedTaxBusinessType || cleanExtractedValue(taxBusinessType) || "인식 필요",
    taxBusinessItem: cleanExtractedValue(taxBusinessItem) || "인식 필요",
    taxIndustryRaw: makeTaxIndustryRaw(taxBusinessType, taxBusinessItem),
    openedAt: openedAt || "인식 필요",
    businessAgeYears,
    rawText: text,
  };
}

function extractValue(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1];
  }
  return "";
}

function extractDateAfter(text) {
  const compact = text.replace(/\s+/g, " ");
  const compactNoSpace = text.replace(/\s+/g, "");
  const tableDate = extractOpeningDateFromMixedDateTable(compact);
  if (tableDate) return tableDate;

  const labeled = compact.match(/개\s*업\s*(?:연|년)?\s*월\s*일.{0,50}?((?:19|20)?[0-9]{2}[.\-/년\s]+[01]?[0-9][.\-/월\s]+[0-3]?[0-9]|[0-9]{8})/);
  if (labeled?.[1]) return normalizeDate(labeled[1]);

  const labeledNoSpace = compactNoSpace.match(/개업(?:연|년)?월일[:：]?((?:19|20)?[0-9]{2}[.\-/년]?[01]?[0-9][.\-/월]?[0-3]?[0-9])/);
  if (labeledNoSpace?.[1]) return normalizeDate(labeledNoSpace[1]);

  const lines = getCleanLines(text);
  const labelIndex = lines.findIndex((line) => /개\s*업\s*(?:연|년)?\s*월\s*일/.test(line));
  if (labelIndex >= 0) {
    const nearby = lines.slice(labelIndex, labelIndex + 3).join(" ");
    const nearbyDate = nearby.match(/((?:19|20)?[0-9]{2}[.\-/년\s]+[01]?[0-9][.\-/월\s]+[0-3]?[0-9]|[0-9]{8})/);
    if (nearbyDate?.[1]) return normalizeDate(nearbyDate[1]);
  }

  return "";
}

function extractOpeningDateFromMixedDateTable(text) {
  const birthLabelIndex = text.search(/생\s*년\s*월\s*일/);
  const openingLabelIndex = text.search(/개\s*업\s*(?:연|년)?\s*월\s*일/);
  if (openingLabelIndex < 0) return "";

  const windowStart = Math.max(0, Math.min(
    birthLabelIndex >= 0 ? birthLabelIndex : openingLabelIndex,
    openingLabelIndex,
  ));
  const windowText = text.slice(windowStart, openingLabelIndex + 140);
  const dateMatches = [...windowText.matchAll(/((?:19|20)?[0-9]{2}[.\-/년\s]+[01]?[0-9][.\-/월\s]+[0-3]?[0-9]|[0-9]{8})/g)];
  if (dateMatches.length === 0) return "";

  const birthBeforeOpening = birthLabelIndex >= 0 && birthLabelIndex < openingLabelIndex;
  const candidate = birthBeforeOpening && dateMatches.length > 1 ? dateMatches[1][1] : dateMatches[0][1];
  return normalizeDate(candidate);
}

function normalizeDate(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  if (digits.length === 6) {
    const yy = Number(digits.slice(0, 2));
    const prefix = yy > 30 ? "19" : "20";
    return `${prefix}${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`;
  }

  const match = value.match(/((?:19|20)?[0-9]{2})\D+([01]?[0-9])\D+([0-3]?[0-9])/);
  if (!match) return "";
  const [, yearRaw, month, day] = match;
  const year = yearRaw.length === 2 ? `${Number(yearRaw) > 30 ? "19" : "20"}${yearRaw}` : yearRaw;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function extractTaxIndustryFields(text) {
  const lines = getCleanLines(text);
  const joined = lines.join("\n");

  const sameLine = joined.match(/업\s*태\s*[:：]?\s*([^\n:：]{1,30}?)\s+종\s*목\s*[:：]?\s*([^\n]{1,60})/);
  if (sameLine) {
    return {
      type: cleanIndustryValue(sameLine[1]),
      item: cleanIndustryValue(sameLine[2]),
    };
  }

  const typeOnly = extractIndustryValueByLabel(lines, /업\s*태/);
  const itemOnly = extractIndustryValueByLabel(lines, /종\s*목/);
  if (typeOnly || itemOnly) {
    return {
      type: cleanIndustryValue(typeOnly),
      item: cleanIndustryValue(itemOnly),
    };
  }

  const headerIndex = lines.findIndex((line) => /업\s*태/.test(line) && /종\s*목/.test(line));
  if (headerIndex >= 0) {
    const nextLine = lines[headerIndex + 1] || "";
    const guessed = splitTaxIndustryLine(nextLine);
    if (guessed.type || guessed.item) return guessed;
  }

  return { type: "", item: "" };
}

function getCleanLines(text) {
  return text
    .split(/\n+/)
    .map((line) => line.replace(/\s{2,}/g, " ").trim())
    .filter(Boolean);
}

function extractIndustryValueByLabel(lines, labelPattern) {
  const index = lines.findIndex((line) => labelPattern.test(line));
  if (index < 0) return "";

  const sameLine = lines[index].replace(labelPattern, "").replace(/^[:：\s]+/, "").trim();
  if (sameLine && !/업\s*태|종\s*목|사업장|대표자|개업|등록번호/.test(sameLine)) {
    return sameLine;
  }

  const nextLine = lines[index + 1] || "";
  if (nextLine && !/업\s*태|종\s*목|사업장|대표자|개업|등록번호/.test(nextLine)) {
    return nextLine;
  }

  return "";
}

function splitTaxIndustryLine(line) {
  const cleaned = cleanIndustryValue(line);
  if (!cleaned) return { type: "", item: "" };

  const typeKeywords = ["도매 및 소매업", "숙박 및 음식점업", "제조업", "서비스업", "건설업", "정보통신업", "부동산업", "교육 서비스업"];
  const matchedType = typeKeywords.find((keyword) => cleaned.includes(keyword));
  if (matchedType) {
    return {
      type: matchedType,
      item: cleanIndustryValue(cleaned.replace(matchedType, "")),
    };
  }

  return { type: "", item: cleaned };
}

function normalizeTaxBusinessType(value) {
  const cleaned = cleanIndustryValue(value);
  if (!cleaned) return "";

  return Object.keys(TAX_TYPE_TO_INDUSTRY).find((type) => cleaned.includes(type)) || "";
}

function inferTaxBusinessType(text) {
  const value = text.replace(/\s/g, "");
  const rules = [
    [/한의원|의원|병원|치과|한방|의료|보건|약국|치료|진료|요양|복지/, "보건업 및 사회복지 서비스업"],
    [/음식|식당|카페|커피|제과|휴게|숙박|호텔|모텔|펜션/, "숙박 및 음식점업"],
    [/도소매|소매|도매|판매|전자상거래|통신판매|쇼핑몰|유통/, "도매 및 소매업"],
    [/제조|가공|공장|생산|인쇄|식품제조/, "제조업"],
    [/소프트웨어|정보통신|개발|플랫폼|앱|웹|데이터|시스템/, "정보통신업"],
    [/디자인|광고|컨설팅|연구|전문|기술|엔지니어링|세무|회계|법무/, "전문, 과학 및 기술 서비스업"],
    [/학원|교육|교습|강의|훈련/, "교육 서비스업"],
    [/부동산|임대|공인중개/, "부동산업"],
    [/건설|인테리어|시공|공사/, "건설업"],
    [/운수|택배|화물|창고|물류/, "운수 및 창고업"],
    [/영상|콘텐츠|출판|미디어|공연|스포츠|여가|예술/, "예술, 스포츠 및 여가관련 서비스업"],
    [/미용|세탁|수리|협회|단체|개인서비스/, "협회 및 단체, 수리 및 기타 개인 서비스업"],
  ];
  const matched = rules.find(([pattern]) => pattern.test(value));
  return matched ? matched[1] : "";
}

function cleanIndustryValue(value) {
  return cleanExtractedValue(value)
    .replace(/업태|종목|주업태|주종목/g, "")
    .replace(/사업장|소재지|대표자|성명|개업연월일.*$/g, "")
    .trim();
}

function extractCorporateNumber(text) {
  const match = text.match(/법인\s*등록\s*번호\s*[:：]?\s*([0-9]{6}\s*-?\s*[0-9]{7})/);
  return match?.[1]?.replace(/\s/g, "") || "";
}

function extractRepresentativeBirthDate(text) {
  const compact = text.replace(/\s+/g, " ");
  const explicit = compact.match(/생\s*년\s*월\s*일\s*[:：]?\s*((?:19|20)?[0-9]{2}[.\-년\s]+[01]?[0-9][.\-월\s]+[0-3]?[0-9]|[0-9]{6})/);
  if (explicit?.[1]) return normalizeBirthDate(explicit[1]);

  const aroundRepresentative = compact.match(/대표자.{0,30}?((?:19|20)?[0-9]{2}[.\-년\s]+[01]?[0-9][.\-월\s]+[0-3]?[0-9]|[0-9]{6})/);
  if (aroundRepresentative?.[1]) return normalizeBirthDate(aroundRepresentative[1]);

  return "";
}

function normalizeBirthDate(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  if (digits.length === 6) {
    const yy = Number(digits.slice(0, 2));
    const prefix = yy > 30 ? "19" : "20";
    return `${prefix}${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 6)}`;
  }
  return value.trim();
}

function makeTaxIndustryRaw(taxBusinessType, taxBusinessItem) {
  const type = cleanExtractedValue(taxBusinessType);
  const item = cleanExtractedValue(taxBusinessItem);
  if (type && item) return `${type} / ${item}`;
  return type || item || "인식 필요";
}

function yearsFrom(dateText) {
  const openedAt = new Date(`${dateText}T00:00:00+09:00`);
  const now = new Date("2026-05-27T00:00:00+09:00");
  if (Number.isNaN(openedAt.getTime())) return null;
  return Math.max(0, (now.getTime() - openedAt.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

function inferRegion(text) {
  const aliases = {
    서울: ["서울", "서울특별시", "강남", "서초", "송파", "마포", "종로"],
    경기: ["경기", "경기도", "수원", "성남", "용인", "고양", "화성", "부천"],
    인천: ["인천", "인천광역시"],
    부산: ["부산", "부산광역시", "해운대", "수영구", "부산진", "동래"],
    대구: ["대구", "대구광역시"],
    광주: ["광주", "광주광역시"],
    대전: ["대전", "대전광역시"],
    울산: ["울산", "울산광역시"],
    세종: ["세종", "세종특별자치시"],
    강원: ["강원", "강원특별자치도"],
    충북: ["충북", "충청북도"],
    충남: ["충남", "충청남도"],
    전북: ["전북", "전라북도", "전북특별자치도"],
    전남: ["전남", "전라남도"],
    경북: ["경북", "경상북도"],
    경남: ["경남", "경상남도"],
    제주: ["제주", "제주특별자치도"],
  };

  return REGIONS.find((region) => aliases[region].some((word) => text.includes(word))) || null;
}

function inferIndustry(text) {
  const value = text.replace(/\s/g, "");
  if (/음식|식당|카페|커피|제과|휴게/.test(value)) return "음식점업";
  if (/도소매|소매|판매|전자상거래|통신판매/.test(value)) return "도소매업";
  if (/제조|가공|공장|생산/.test(value)) return "제조업";
  if (/소프트웨어|정보통신|개발|플랫폼|앱|웹/.test(value)) return "IT/소프트웨어";
  if (/콘텐츠|영상|디자인|출판|미디어/.test(value)) return "콘텐츠";
  if (/한의원|의원|병원|치과|한방|의료|보건|약국|치료|진료/.test(value)) return "서비스업";
  if (/서비스|컨설팅|교육|관리/.test(value)) return "서비스업";
  return null;
}

function cleanExtractedValue(value) {
  return value
    .replace(/사업자등록증|사업자|등록번호|상호|법인명|대표자|성명|개업|연월일/g, "")
    .replace(/[^\w가-힣()[\]\-.\s]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function syncBusinessConfirm(info) {
  confirmRegion.value = info.region || "";
  confirmTaxBusinessType.value = Object.prototype.hasOwnProperty.call(TAX_TYPE_TO_INDUSTRY, info.taxBusinessType)
    ? info.taxBusinessType
    : "";
  confirmIndustry.value = info.industry || "";
  confirmOpenedAt.value = /^\d{4}-\d{2}-\d{2}$/.test(info.openedAt) ? info.openedAt : "";
  confirmStartup.checked = Boolean(info.businessAgeYears !== null && info.businessAgeYears <= 7);
  confirmYouth.checked = false;
  confirmFemale.checked = false;
  confirmExport.checked = false;
  businessConfirm.hidden = false;
}

function renderExtractedInfo(info) {
  extractedInfo.replaceChildren();
  const identityRow =
    info.businessType === "법인사업자"
      ? ["법인등록번호", info.corporateNumber]
      : ["대표자 생년월일", info.representativeBirthDate];
  [
    ["상호", info.companyName],
    ["사업자번호", info.businessNumber],
    ["유형", info.businessType],
    identityRow,
    ["지역", info.region || "인식 필요"],
    ["국세청 업태", info.taxBusinessType],
    ["국세청 종목", info.taxBusinessItem],
    ["추천용 분류", info.industry || "인식 필요"],
    ["개업일", info.openedAt],
  ].forEach(([key, value]) => {
    const item = document.createElement("div");
    item.innerHTML = `<dt>${key}</dt><dd>${value}</dd>`;
    extractedInfo.appendChild(item);
  });
  extractedInfo.hidden = false;
}

function setOcrStatus(type, message) {
  ocrStatus.className = `ocr-note ${type}`;
  ocrStatus.textContent = message;
}

function renderUploadPrompt() {
  state.matches = [];
  resultList.replaceChildren();
  summaryTitle.textContent = "사업자등록증을 올리면 추천을 시작합니다";
  document.querySelector("#topScore").textContent = "0%";
  document.querySelector("#urgentCount").textContent = "0";
  document.querySelector("#loanCount").textContent = "0";

  const prompt = document.createElement("article");
  prompt.className = "empty-state";
  prompt.innerHTML = `
    <strong>기존 사업자는 사업자등록증 업로드만 받습니다.</strong>
    <span>이미지 또는 PDF 파일을 올리면 상호, 사업자번호, 업종, 지역, 개업일을 읽고 맞춤 지원사업을 추천합니다.</span>
  `;
  resultList.appendChild(prompt);
}

function renderNoEligiblePrograms() {
  const prompt = document.createElement("article");
  prompt.className = "empty-state";
  prompt.innerHTML = `
    <strong>현재 조건에 맞는 지원사업이 없습니다.</strong>
    <span>대상 조건이 맞지 않는 사업은 숨겼습니다. 지역, 업종, 청년/여성기업/수출기업 여부를 다시 확인해보세요.</span>
  `;
  resultList.appendChild(prompt);
}

function matchProgram(profile, program) {
  const checks = [
    makeCheck("region", "지역", profile.region, program.regions, 24, true),
    makeCheck("industry", "업종", profile.industry, program.industries, 20, true),
    makeCheck("businessType", "사업자 유형", profile.businessType, program.businessTypes, 10, true),
    makeMaxCheck("revenue", "연 매출", profile.revenue, program.maxRevenue, 12, false, formatRevenue),
    makeMaxCheck("employees", "상시근로자", profile.employees, program.maxEmployees, 10, false, (v) => `${v}명`),
    makeMaxCheck("businessAge", "업력", profile.businessAgeYears, program.maxBusinessAgeYears, 10, Boolean(program.maxBusinessAgeYears), (v) => `${v.toFixed(1)}년`),
    makeMaxCheck("ownerAge", "대표자 연령", profile.ownerAge, program.maxOwnerAge, 10, Boolean(program.maxOwnerAge), (v) => `${v}세`),
    makeBooleanCheck("startup", "창업기업", profile.startup, program.needsStartup, 8),
    makeBooleanCheck("exports", "수출기업", profile.exports, program.needsExports, 8),
    makeBooleanCheck("femaleOwned", "여성기업", profile.femaleOwned, program.needsFemaleOwned, 8),
  ].filter(Boolean);

  const hardFailed = checks.filter((check) => check.required && check.status === "fail");
  const needsReview = checks.filter((check) => check.required && check.status === "unknown");
  const passed = checks.filter((check) => check.status === "pass");
  const scoreBase = checks.filter((check) => check.status !== "unknown");
  const totalWeight = scoreBase.reduce((sum, check) => sum + check.weight, 0);
  const score = totalWeight
    ? Math.round((passed.reduce((sum, check) => sum + check.weight, 0) / totalWeight) * 100)
    : 0;

  let status = "eligible";
  if (hardFailed.length > 0) status = "not_eligible";
  else if (needsReview.length > 0) status = "needs_review";

  return {
    ...program,
    score,
    status,
    reasons: passed.map((check) => check.passLabel),
    missing: hardFailed.map((check) => check.failLabel),
    review: needsReview.map((check) => check.unknownLabel),
    daysLeft: getDaysLeft(program.deadline),
  };
}

function makeCheck(key, label, value, allowed, weight, required) {
  if (!allowed) return null;
  if (!value) {
    return {
      key,
      label,
      weight,
      required,
      status: "unknown",
      unknownLabel: `${label} 확인 필요`,
    };
  }

  const pass = allowed.includes("전국") || allowed.includes(value);
  return {
    key,
    label,
    weight,
    required,
    status: pass ? "pass" : "fail",
    passLabel: `${value} ${label} 조건 충족`,
    failLabel: `${value} ${label}은 대상이 아님`,
  };
}

function makeMaxCheck(key, label, value, maxValue, weight, required, format) {
  if (!maxValue) return null;
  if (value === null || Number.isNaN(value)) {
    return {
      key,
      label,
      weight,
      required,
      status: "unknown",
      unknownLabel: `${label} 확인 필요`,
    };
  }

  const pass = value <= maxValue;
  return {
    key,
    label,
    weight,
    required,
    status: pass ? "pass" : "fail",
    passLabel: `${label} ${format(value)} 조건 충족`,
    failLabel: `${label} ${format(value)}은 대상 기준 초과`,
  };
}

function makeBooleanCheck(key, label, value, requiredValue, weight) {
  if (!requiredValue) return null;
  const pass = value === true;
  return {
    key,
    label,
    weight,
    required: true,
    status: pass ? "pass" : "fail",
    passLabel: `${label} 조건 충족`,
    failLabel: `${label} 조건에 해당하지 않음`,
  };
}

function renderMatches(companyName = getProfile().companyName) {
  const visibleMatches = state.matches.filter((program) => program.status !== "not_eligible");
  const sorted = [...visibleMatches].sort((a, b) => {
    if (state.sortMode === "deadline") return a.daysLeft - b.daysLeft;
    if (state.sortMode === "amount") return b.amount - a.amount;
    if (a.status !== b.status) return statusRank(a.status) - statusRank(b.status);
    return b.score - a.score;
  });

  resultList.replaceChildren();
  if (sorted.length === 0) {
    renderNoEligiblePrograms();
  } else {
    sorted.forEach((program) => resultList.appendChild(createProgramCard(program)));
  }

  const available = sorted.filter((program) => program.status === "eligible" && program.score >= 70);
  summaryTitle.textContent = `${companyName}에 맞는 지원사업 ${available.length}건 · ${state.programsSource}`;
  document.querySelector("#topScore").textContent = `${available[0]?.score || 0}%`;
  document.querySelector("#urgentCount").textContent = String(
    sorted.filter((program) => program.daysLeft >= 0 && program.daysLeft <= 14).length,
  );
  document.querySelector("#loanCount").textContent = String(
    available.filter((program) => program.type === "정책자금").length,
  );
}

function statusRank(status) {
  if (status === "eligible") return 0;
  if (status === "needs_review") return 1;
  return 2;
}

function createProgramCard(program) {
  const template = document.querySelector("#programCard");
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".program-card");
  const deadline = fragment.querySelector(".deadline");

  card.classList.toggle("not-eligible", program.status === "not_eligible");
  card.classList.toggle("needs-review", program.status === "needs_review");
  fragment.querySelector(".tag").textContent = statusLabel(program);
  deadline.textContent = program.daysLeft < 0 ? "마감" : `D-${program.daysLeft}`;
  deadline.classList.toggle("expired", program.daysLeft < 0);
  fragment.querySelector("h3").textContent = program.title;
  fragment.querySelector(".agency").textContent = `${program.agency} · ${program.type}${program.source ? ` · ${program.source}` : ""}`;
  fragment.querySelector(".description").textContent = program.description;
  fragment.querySelector(".score-bar span").style.width = `${program.score}%`;
  fragment.querySelector(".score-label").textContent = `${program.score}%`;
  fragment.querySelector(".reason-box").textContent = makeReasonText(program);

  const meta = fragment.querySelector(".program-meta");
  [
    ["지원규모", program.amount ? `${program.amount.toLocaleString("ko-KR")}만원` : "공고문 확인"],
    ["대상지역", program.regions.join(", ")],
    ["대상업종", program.industries.slice(0, 3).join(", ")],
    ["필요서류", program.required.slice(0, 2).join(", ")],
  ].forEach(([key, value]) => {
    const item = document.createElement("div");
    item.innerHTML = `<dt>${key}</dt><dd>${value}</dd>`;
    meta.appendChild(item);
  });

  const link = fragment.querySelector("a");
  link.href = program.url;
  link.setAttribute("aria-label", `${program.title} 공고 보기`);

  const saveButton = fragment.querySelector("button");
  saveButton.addEventListener("click", () => {
    saveButton.textContent = "저장됨";
    saveButton.disabled = true;
    card.classList.add("saved");
  });

  return fragment;
}

function statusLabel(program) {
  if (program.status === "eligible") return "추천 가능";
  if (program.status === "needs_review") return "확인 필요";
  return "대상 아님";
}

function makeReasonText(program) {
  if (program.status === "not_eligible") {
    return `제외 사유: ${program.missing.slice(0, 3).join(", ")}. 조건이 맞지 않는 사업은 추천 건수에 포함하지 않습니다.`;
  }
  if (program.status === "needs_review") {
    return `확인 필요: ${program.review.slice(0, 3).join(", ")}. 확인 전에는 추천 확정으로 보지 않습니다.`;
  }
  return `추천 사유: ${program.reasons.slice(0, 3).join(", ")}. 신청 전 ${program.required.join(", ")}를 준비하세요.`;
}

function getDaysLeft(deadline) {
  const today = new Date("2026-05-27T00:00:00+09:00");
  const end = new Date(`${deadline}T23:59:59+09:00`);
  return Math.ceil((end.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

function formatRevenue(value) {
  if (value >= 999) return "50억 초과";
  return `${value}억 이하`;
}

form.requestSubmit();

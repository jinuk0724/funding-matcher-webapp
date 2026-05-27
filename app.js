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
const confirmIndustry = document.querySelector("#confirmIndustry");
const confirmYouth = document.querySelector("#confirmYouth");
const confirmFemale = document.querySelector("#confirmFemale");
const confirmExport = document.querySelector("#confirmExport");
const confirmStartup = document.querySelector("#confirmStartup");

fileInput.addEventListener("change", async () => {
  fileName.textContent = fileInput.files[0]
    ? `${fileInput.files[0].name} 선택됨`
    : "이미지 파일을 올리면 정보를 읽어옵니다.";

  if (state.userPath === "business" && fileInput.files[0]) {
    await readBusinessCertificate(fileInput.files[0]);
  }
});

pathButtons.forEach((button) => {
  button.addEventListener("click", () => setUserPath(button.dataset.path));
});

[confirmRegion, confirmIndustry, confirmYouth, confirmFemale, confirmExport, confirmStartup].forEach(
  (control) => {
    control.addEventListener("change", () => {
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

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (state.userPath === "business" && !fileInput.files[0]) {
    renderUploadPrompt();
    return;
  }

  const profile = getProfile();
  state.matches = supportPrograms.map((program) => matchProgram(profile, program));
  renderMatches(profile.companyName);
});

function getProfile() {
  const data = new FormData(form);

  if (state.userPath === "business") {
    const extracted = state.extractedBusiness || {};
    const isYouth = confirmYouth.checked;

    return {
      companyName: extracted.companyName || "업로드 사업자",
      businessType: extracted.businessType || "개인사업자",
      region: confirmRegion.value || null,
      industry: confirmIndustry.value || null,
      revenue: null,
      employees: null,
      ownerAge: isYouth ? 34 : null,
      businessAgeYears: confirmStartup.checked ? extracted.businessAgeYears || 2 : null,
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
  if (!file.type.startsWith("image/")) {
    setOcrStatus("error", "이미지 파일만 바로 읽을 수 있습니다. PDF OCR은 서버 연동 단계에서 추가하는 편이 안정적입니다.");
    renderUploadPrompt();
    return;
  }

  if (!window.Tesseract) {
    setOcrStatus("error", "OCR 라이브러리를 불러오지 못했습니다. 인터넷 연결 상태를 확인한 뒤 다시 시도해주세요.");
    renderUploadPrompt();
    return;
  }

  state.extractedBusiness = null;
  extractedInfo.hidden = true;
  extractedInfo.replaceChildren();
  businessConfirm.hidden = true;
  setOcrStatus("loading", "사업자등록증을 읽는 중입니다. 처음 실행할 때는 시간이 조금 걸릴 수 있습니다.");

  try {
    const result = await Tesseract.recognize(file, "kor+eng", {
      logger(progress) {
        if (progress.status === "recognizing text") {
          setOcrStatus("loading", `사업자등록증을 읽는 중입니다. ${Math.round(progress.progress * 100)}%`);
        }
      },
    });

    const text = normalizeOcrText(result.data.text);
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
  const industryText = extractValue(text, [
    /종\s*목\s*[:：]?\s*([^\n]+)/,
    /업\s*태\s*[:：]?\s*([^\n]+)/,
  ]);

  return {
    companyName: cleanExtractedValue(companyName) || "업로드 사업자",
    businessNumber: cleanExtractedValue(businessNumber) || "인식 필요",
    businessType: text.includes("법인") ? "법인사업자" : "개인사업자",
    region: inferRegion(text),
    industry: inferIndustry(industryText || text),
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
  const dateMatch = compact.match(/(20[0-9]{2}|19[0-9]{2})[.\-년\s]+([01]?[0-9])[.\-월\s]+([0-3]?[0-9])/);
  if (!dateMatch) return "";
  const [, year, month, day] = dateMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
  confirmIndustry.value = info.industry || "";
  confirmStartup.checked = Boolean(info.businessAgeYears !== null && info.businessAgeYears <= 7);
  confirmYouth.checked = false;
  confirmFemale.checked = false;
  confirmExport.checked = false;
  businessConfirm.hidden = false;
}

function renderExtractedInfo(info) {
  extractedInfo.replaceChildren();
  [
    ["상호", info.companyName],
    ["사업자번호", info.businessNumber],
    ["유형", info.businessType],
    ["지역", info.region || "인식 필요"],
    ["업종", info.industry || "인식 필요"],
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
    <span>이미지 파일을 올리면 상호, 사업자번호, 업종, 지역, 개업일을 읽고 맞춤 지원사업을 추천합니다.</span>
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
  summaryTitle.textContent = `${companyName}에 맞는 지원사업 ${available.length}건`;
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
  fragment.querySelector(".agency").textContent = `${program.agency} · ${program.type}`;
  fragment.querySelector(".description").textContent = program.description;
  fragment.querySelector(".score-bar span").style.width = `${program.score}%`;
  fragment.querySelector(".score-label").textContent = `${program.score}%`;
  fragment.querySelector(".reason-box").textContent = makeReasonText(program);

  const meta = fragment.querySelector(".program-meta");
  [
    ["지원규모", `${program.amount.toLocaleString("ko-KR")}만원`],
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

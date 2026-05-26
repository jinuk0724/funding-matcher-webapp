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
    description:
      "서울 소재 소상공인의 운전자금과 경영 안정화를 지원하는 정책자금 성격의 사업입니다.",
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
    description:
      "초기 창업기업의 온라인 판매, 고객관리, 예약/주문 시스템 도입 비용을 일부 보조합니다.",
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
    description:
      "수출을 준비하거나 이미 수출 실적이 있는 중소기업의 해외 전시, 바이어 발굴, 마케팅을 지원합니다.",
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
    description:
      "여성기업의 온라인 기획전, 홍보 콘텐츠 제작, 전시 참가를 지원하는 사업입니다.",
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
    description:
      "제조 현장의 생산성 개선을 위한 설비, 공정 자동화, 데이터 수집 시스템 구축을 지원합니다.",
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
    description:
      "청년 대표자가 운영하는 지역 기반 브랜드의 제품 개선, 브랜딩, 마케팅 실행비를 지원합니다.",
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

fileInput.addEventListener("change", async () => {
  fileName.textContent = fileInput.files[0]
    ? `${fileInput.files[0].name} 선택됨`
    : "이미지 파일을 올리면 정보를 읽어옵니다.";
  if (state.userPath === "business" && fileInput.files[0]) {
    await readBusinessCertificate(fileInput.files[0]);
  }
});

pathButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setUserPath(button.dataset.path);
  });
});

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
    const extracted = state.extractedBusiness;
    return {
      companyName: extracted?.companyName || "업로드 사업자",
      businessType: extracted?.businessType || "개인사업자",
      region: extracted?.region || "서울",
      industry: extracted?.industry || "서비스업",
      revenue: 3,
      employees: 4,
      ownerAge: 34,
      businessAgeYears: extracted?.businessAgeYears ?? 2,
      exports: false,
      femaleOwned: false,
      startup: true,
      venture: false,
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
  } else {
    if (state.extractedBusiness) {
      form.requestSubmit();
    } else {
      renderUploadPrompt();
    }
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
  setOcrStatus("loading", "사업자등록증을 읽는 중입니다. 처음 실행할 때는 OCR 파일을 내려받느라 시간이 조금 걸릴 수 있습니다.");

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
    renderExtractedInfo(state.extractedBusiness);
    setOcrStatus("ready", "정보를 읽었습니다. 추출 결과를 바탕으로 맞춤 지원사업을 추천합니다.");
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
  const openedAt = extractDateAfter(text, /(개업|개시|등록)\s*연?\s*월?\s*일?/);
  const businessAgeYears = openedAt ? yearsFrom(openedAt) : 2;
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

function extractDateAfter(text, labelPattern) {
  const compact = text.replace(/\s+/g, " ");
  const labelMatch = compact.match(labelPattern);
  const searchArea = labelMatch ? compact.slice(labelMatch.index) : compact;
  const dateMatch = searchArea.match(/(20[0-9]{2}|19[0-9]{2})[.\-년\s]+([01]?[0-9])[.\-월\s]+([0-3]?[0-9])/);
  if (!dateMatch) return "";
  const [, year, month, day] = dateMatch;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function yearsFrom(dateText) {
  const openedAt = new Date(`${dateText}T00:00:00+09:00`);
  const now = new Date("2026-05-27T00:00:00+09:00");
  if (Number.isNaN(openedAt.getTime())) return 2;
  return Math.max(0, (now.getTime() - openedAt.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}

function inferRegion(text) {
  const regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
  const aliases = {
    서울: ["서울", "강남", "서초", "송파", "마포", "종로", "중구"],
    경기: ["경기", "수원", "성남", "용인", "고양", "화성", "부천"],
    인천: ["인천"],
    부산: ["부산"],
    대구: ["대구"],
    광주: ["광주"],
    대전: ["대전"],
    울산: ["울산"],
    세종: ["세종"],
    강원: ["강원"],
    충북: ["충북", "충청북도"],
    충남: ["충남", "충청남도"],
    전북: ["전북", "전라북도"],
    전남: ["전남", "전라남도"],
    경북: ["경북", "경상북도"],
    경남: ["경남", "경상남도"],
    제주: ["제주"],
  };
  return regions.find((region) => aliases[region].some((word) => text.includes(word))) || "서울";
}

function inferIndustry(text) {
  const value = text.replace(/\s/g, "");
  if (/음식|식당|카페|커피|제과|휴게/.test(value)) return "음식점업";
  if (/도소매|소매|판매|전자상거래|통신판매/.test(value)) return "도소매업";
  if (/제조|가공|공장|생산/.test(value)) return "제조업";
  if (/소프트웨어|정보통신|개발|플랫폼|앱|웹/.test(value)) return "IT/소프트웨어";
  if (/콘텐츠|영상|디자인|출판|미디어/.test(value)) return "콘텐츠";
  return "서비스업";
}

function cleanExtractedValue(value) {
  return value
    .replace(/사업자등록증|사업자|등록번호|상호|법인명|대표자|성명|개업|연월일/g, "")
    .replace(/[^\w가-힣()[\]\-.\s]/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function renderExtractedInfo(info) {
  extractedInfo.replaceChildren();
  [
    ["상호", info.companyName],
    ["사업자번호", info.businessNumber],
    ["유형", info.businessType],
    ["지역", info.region],
    ["업종", info.industry],
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

function matchProgram(profile, program) {
  const checks = [
    {
      pass: program.regions.includes("전국") || program.regions.includes(profile.region),
      weight: 22,
      label: `${profile.region} 지역 조건`,
    },
    {
      pass: program.industries.includes(profile.industry),
      weight: 20,
      label: `${profile.industry} 업종 조건`,
    },
    {
      pass: program.businessTypes.includes(profile.businessType),
      weight: 10,
      label: `${profile.businessType} 신청 가능`,
    },
    {
      pass: profile.revenue <= program.maxRevenue,
      weight: 14,
      label: `연 매출 ${formatRevenue(profile.revenue)} 기준`,
    },
    {
      pass: profile.employees <= program.maxEmployees,
      weight: 12,
      label: `상시근로자 ${profile.employees}명 기준`,
    },
    {
      pass:
        !program.maxBusinessAgeYears ||
        profile.businessAgeYears <= program.maxBusinessAgeYears,
      weight: 10,
      label: `업력 ${profile.businessAgeYears.toFixed(1)}년 기준`,
    },
    {
      pass: !program.maxOwnerAge || profile.ownerAge <= program.maxOwnerAge,
      weight: 6,
      label: `대표자 연령 ${profile.ownerAge}세 기준`,
    },
    {
      pass: !program.needsStartup || profile.startup,
      weight: 8,
      label: "창업기업 조건",
    },
    {
      pass: !program.needsExports || profile.exports,
      weight: 8,
      label: "수출기업 조건",
    },
    {
      pass: !program.needsFemaleOwned || profile.femaleOwned,
      weight: 8,
      label: "여성기업 조건",
    },
  ];

  const possible = checks.filter((check) => check.pass);
  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const score = Math.round(
    (possible.reduce((sum, check) => sum + check.weight, 0) / totalWeight) * 100,
  );
  const missing = checks.filter((check) => !check.pass).map((check) => check.label);

  return {
    ...program,
    score,
    reasons: possible.map((check) => check.label),
    missing,
    daysLeft: getDaysLeft(program.deadline),
  };
}

function renderMatches(companyName = getProfile().companyName) {
  const sorted = [...state.matches].sort((a, b) => {
    if (state.sortMode === "deadline") return a.daysLeft - b.daysLeft;
    if (state.sortMode === "amount") return b.amount - a.amount;
    return b.score - a.score;
  });

  resultList.replaceChildren();
  sorted.forEach((program) => resultList.appendChild(createProgramCard(program)));

  const available = sorted.filter((program) => program.score >= 65);
  summaryTitle.textContent = `${companyName}에 맞는 지원사업 ${available.length}건`;
  document.querySelector("#topScore").textContent = `${sorted[0]?.score || 0}%`;
  document.querySelector("#urgentCount").textContent = String(
    sorted.filter((program) => program.daysLeft >= 0 && program.daysLeft <= 14).length,
  );
  document.querySelector("#loanCount").textContent = String(
    sorted.filter((program) => program.type === "정책자금").length,
  );
}

function createProgramCard(program) {
  const template = document.querySelector("#programCard");
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".program-card");
  const deadline = fragment.querySelector(".deadline");

  fragment.querySelector(".tag").textContent = program.type;
  deadline.textContent =
    program.daysLeft < 0 ? "마감" : `D-${program.daysLeft}`;
  deadline.classList.toggle("expired", program.daysLeft < 0);
  fragment.querySelector("h3").textContent = program.title;
  fragment.querySelector(".agency").textContent = program.agency;
  fragment.querySelector(".description").textContent = program.description;
  fragment.querySelector(".score-bar span").style.width = `${program.score}%`;
  fragment.querySelector(".score-label").textContent = `${program.score}% 적합`;
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

function makeReasonText(program) {
  const topReasons = program.reasons.slice(0, 3).join(", ");
  if (program.score >= 80) {
    return `추천 사유: ${topReasons}을 충족합니다. 신청 전 ${program.required.join(", ")}를 준비하세요.`;
  }
  if (program.score >= 65) {
    return `확인 필요: ${topReasons}은 맞지만, ${program.missing.slice(0, 2).join(", ")}을 추가 확인해야 합니다.`;
  }
  return `가능성 낮음: ${program.missing.slice(0, 3).join(", ")}에서 조건이 맞지 않을 수 있습니다.`;
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

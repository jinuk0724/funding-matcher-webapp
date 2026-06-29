const { handler: bizinfoHandler } = require("./bizinfo");

const KSTARTUP_RSS_URL = "https://www.k-startup.go.kr/web/contents/rss/bizpbanc-ongoing.do";

const SOURCE_REGISTRY = [
  {
    id: "bizinfo",
    name: "\uAE30\uC5C5\uB9C8\uB2F9",
    status: "connected",
    envKey: "BIZINFO_API_KEY",
    priority: 1,
  },
  {
    id: "kstartup",
    name: "K-Startup",
    status: "connected",
    envKey: null,
    priority: 2,
  },
  {
    id: "semas",
    name: "\uC18C\uC0C1\uACF5\uC77824",
    status: "needs_api",
    envKey: "SEMAS_API_KEY",
    priority: 2,
  },
  {
    id: "kosmes",
    name: "\uC911\uC18C\uBCA4\uCC98\uAE30\uC5C5\uC9C4\uD765\uACF5\uB2E8",
    status: "needs_api",
    envKey: "KOSMES_API_KEY",
    priority: 3,
  },
  {
    id: "smtech",
    name: "SMTECH",
    status: "needs_api",
    envKey: "SMTECH_API_KEY",
    priority: 3,
  },
  {
    id: "work24",
    name: "\uACE0\uC6A924",
    status: "needs_api",
    envKey: "WORK24_API_KEY",
    priority: 3,
  },
  {
    id: "gov24",
    name: "\uBCF4\uC870\uAE0824/\uC815\uBD8024",
    status: "needs_api",
    envKey: "GOV24_API_KEY",
    priority: 4,
  },
  {
    id: "bokjiro",
    name: "\uBCF5\uC9C0\uB85C",
    status: "needs_api",
    envKey: "BOKJIRO_API_KEY",
    priority: 4,
  },
  {
    id: "gosims",
    name: "e\uB098\uB77C\uB3C4\uC6C0",
    status: "needs_api",
    envKey: "GOSIMS_API_KEY",
    priority: 4,
  },
  {
    id: "kinfa",
    name: "\uC11C\uBBFC\uAE08\uC735\uC9C4\uD765\uC6D0",
    status: "needs_api",
    envKey: "KINFA_API_KEY",
    priority: 5,
  },
  {
    id: "kodit",
    name: "\uC2E0\uC6A9\uBCF4\uC99D\uAE30\uAE08 KODIT",
    status: "needs_api",
    envKey: "KODIT_API_KEY",
    priority: 5,
  },
  {
    id: "kibo",
    name: "\uAE30\uC220\uBCF4\uC99D\uAE30\uAE08 KOTEC",
    status: "needs_api",
    envKey: "KIBO_API_KEY",
    priority: 5,
  },
];

exports.handler = async (event) => {
  const sourceParam = event.queryStringParameters?.sources || "all";
  const requestedSources = sourceParam === "all"
    ? SOURCE_REGISTRY.map((source) => source.id)
    : sourceParam.split(",");
  const programs = [];
  const sources = SOURCE_REGISTRY.map((source) => ({
    ...source,
    configured: source.status === "connected" || Boolean(source.envKey && process.env[source.envKey]),
  }));
  const warnings = [];

  if (requestedSources.includes("bizinfo")) {
    try {
      const response = await bizinfoHandler(event);
      const payload = JSON.parse(response.body);
      programs.push(...(payload.programs || []));
      if (!payload.ok) {
        warnings.push(`${SOURCE_REGISTRY[0].name}: ${payload.error || "API response needs review"}`);
      }
    } catch (error) {
      warnings.push(`${SOURCE_REGISTRY[0].name}: ${error.message || "fetch failed"}`);
    }
  }

  if (requestedSources.includes("kstartup")) {
    try {
      programs.push(...(await fetchKstartupPrograms()));
    } catch (error) {
      warnings.push(`K-Startup: ${error.message || "fetch failed"}`);
    }
  }

  const pendingSources = sources
    .filter((source) => source.status !== "connected" && requestedSources.includes(source.id))
    .map((source) => source.name);

  if (pendingSources.length) {
    warnings.push(`${pendingSources.join(", ")} integration is prepared, but each official API endpoint/key still needs confirmation.`);
  }

  return json(200, {
    ok: true,
    source: "\uD1B5\uD569\uC9C0\uC6D0\uC0AC\uC5C5",
    fetchedAt: new Date().toISOString(),
    sources,
    warnings,
    programs: dedupePrograms(programs),
  });
};

async function fetchKstartupPrograms() {
  const response = await fetch(KSTARTUP_RSS_URL, {
    headers: {
      Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.7",
      "User-Agent": "funding-matcher-webapp/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`RSS ${response.status}`);
  }

  const xml = await response.text();
  return parseKstartupRss(xml);
}

function parseKstartupRss(xml) {
  const currentYear = new Date().getFullYear();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  return items.map((match, index) => {
    const itemXml = match[1];
    const title = decodeHtml(tag(itemXml, "title")) || "K-Startup 공고";
    const url = decodeHtml(tag(itemXml, "link")) || "https://www.k-startup.go.kr/";
    const author = decodeHtml(tag(itemXml, "author")) || "K-Startup";
    const pubDate = tag(itemXml, "pubDate");
    const collectedAt = normalizePubDate(pubDate) || new Date().toISOString().slice(0, 10);
    const text = `${title} ${author}`;

    return {
      id: `kstartup-${hash(`${title}-${url}-${index}`)}`,
      source: "K-Startup",
      title,
      agency: author,
      type: inferSupportType(text),
      regions: inferRegions(text),
      industries: inferIndustries(text),
      businessTypes: inferBusinessTypes(text),
      amount: null,
      deadline: inferDeadline(title),
      url: url.replace(/^http:\/\//, "https://"),
      description: `${title} 공고입니다. K-Startup 원문에서 세부 신청대상과 제출서류를 확인하세요.`,
      required: ["공고문 확인"],
      eligibilityText: inferEligibilityText(text),
      collectedAt,
      dataDepth: "title_only",
    };
  })
    .filter((program) => Number(program.collectedAt.slice(0, 4)) >= currentYear)
    .filter((program) => !/통합공고 요약본|챗봇 제공|지원사업 준비를 AI와 함께/.test(program.title))
    .sort((a, b) => b.collectedAt.localeCompare(a.collectedAt))
    .slice(0, 120);
}

function tag(xml, name) {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
  if (!match) return "";
  return match[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim();
}

function decodeHtml(value) {
  return String(value)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#40;/g, "(")
    .replace(/&#41;/g, ")");
}

function inferRegions(text) {
  const regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
  const found = regions.filter((region) => text.includes(region));
  return found.length ? found : ["전국"];
}

function inferIndustries(text) {
  const result = [];
  if (/음식|식당|카페|외식|숙박|식품/.test(text)) result.push("음식점업");
  if (/도소매|소매|도매|판매|유통|온라인몰|전자상거래|커머스|브랜드|패션|뷰티/.test(text)) result.push("도소매업");
  if (/제조|공장|생산|메이커|시제품|소공인|부품/.test(text)) result.push("제조업");
  if (/SW|소프트웨어|정보통신|ICT|AI|플랫폼|앱|데이터|디바이스|딥테크/.test(text)) result.push("IT/소프트웨어");
  if (/콘텐츠|미디어|디자인|영상|게임|출판|예술|공연|크리에이터/.test(text)) result.push("콘텐츠");
  if (/의료|보건|바이오|Bio|bio|한의원|병원|의원|메드텍|MedTech|헬스/.test(text)) result.push("보건/의료업");
  return result.length ? [...new Set(result)] : ["전업종"];
}

function inferBusinessTypes(text) {
  if (/예비창업|예비 창업|교육생|참가자|아이디어/.test(text)) return ["예비창업자"];
  if (/창업기업|스타트업|입주기업|참여기업|소상공인|기업/.test(text)) {
    return ["개인사업자", "법인사업자", "예비창업자"];
  }
  return ["예비창업자"];
}

function inferSupportType(text) {
  if (/R&D|기술개발|연구개발|딥테크|기술이전/.test(text)) return "R&D";
  if (/융자|자금|대출|정책자금|보증금/.test(text)) return "정책자금";
  if (/바우처/.test(text)) return "바우처";
  if (/고용|채용|일자리|인건비/.test(text)) return "고용지원";
  if (/교육|컨설팅|멘토링|아카데미|스쿨|세미나/.test(text)) return "교육/컨설팅";
  return "보조금";
}

function inferEligibilityText(text) {
  if (/예비창업/.test(text)) return "예비창업자";
  if (/소상공인/.test(text)) return "소상공인";
  if (/창업기업|스타트업/.test(text)) return "창업기업";
  if (/입주기업|참여기업|기업/.test(text)) return "기업";
  return "공고문 확인";
}

function inferDeadline(text) {
  const match = String(text).match(/~\s*([0-9]{1,2})\/([0-9]{1,2})/);
  if (!match) return "";
  const year = new Date().getFullYear();
  return `${year}-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
}

function normalizePubDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function dedupePrograms(programs) {
  const seen = new Set();
  return programs.filter((program) => {
    const key = `${program.source}|${program.title}|${program.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=900",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(payload),
  };
}

function hash(value) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result << 5) - result + value.charCodeAt(index);
    result |= 0;
  }
  return Math.abs(result).toString(36);
}

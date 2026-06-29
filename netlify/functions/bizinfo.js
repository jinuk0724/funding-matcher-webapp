const API_URL = "https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do";

exports.handler = async (event) => {
  const apiKey = process.env.BIZINFO_API_KEY;

  if (!apiKey) {
    return json(500, {
      ok: false,
      error: "BIZINFO_API_KEY environment variable is missing.",
      programs: [],
    });
  }

  try {
    const query = new URLSearchParams(event.queryStringParameters || {});
    const params = new URLSearchParams({
      crtfcKey: apiKey,
      dataType: "json",
      searchCnt: query.get("searchCnt") || "100",
      pageUnit: query.get("pageUnit") || "50",
      pageIndex: query.get("pageIndex") || "1",
    });

    const optionalKeys = [
      "hashtags",
      "searchKeyword",
      "searchCondition",
      "reqstBeginEndDe",
      "reqstEndDe",
    ];

    optionalKeys.forEach((key) => {
      const value = query.get(key);
      if (value) params.set(key, value);
    });

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      headers: {
        Accept: "application/json, application/xml;q=0.9, */*;q=0.8",
      },
    });

    const body = await response.text();
    const contentType = response.headers.get("content-type") || "";
    const parsed = contentType.includes("json") ? safeJson(body) : parseBizinfoXml(body);

    return json(200, {
      ok: response.ok,
      source: "기업마당",
      fetchedAt: new Date().toISOString(),
      rawType: contentType || "text",
      programs: normalizeBizinfoPrograms(parsed),
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error.message || "Failed to fetch Bizinfo API.",
      programs: [],
    });
  }
};

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

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function parseBizinfoXml(xml) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((match) => {
    const itemXml = match[1];
    return {
      title: tag(itemXml, "title"),
      link: tag(itemXml, "link"),
      description: tag(itemXml, "description"),
      pubDate: tag(itemXml, "pubDate"),
      "지원사업명": tag(itemXml, "지원사업명"),
      "사업명": tag(itemXml, "사업명"),
      "소관부처명": tag(itemXml, "소관부처명"),
      "수행기관명": tag(itemXml, "수행기관명"),
      "신청기간": tag(itemXml, "신청기간"),
      "신청방법": tag(itemXml, "신청방법"),
      "지원대상": tag(itemXml, "지원대상"),
      "지원내용": tag(itemXml, "지원내용"),
      "지역": tag(itemXml, "지역"),
    };
  });

  const reqErr = tag(xml, "reqErr");
  return { items, reqErr, raw: xml };
}

function tag(xml, name) {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"));
  if (!match) return "";
  return decodeHtml(match[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim());
}

function decodeHtml(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeBizinfoPrograms(payload) {
  const items = findItems(payload);
  return items.map((item, index) => {
    const title = pick(item, ["pblancNm", "title", "지원사업명", "사업명", "bizPbancNm"]) || "기업마당 지원사업";
    const agency = pick(item, ["jrsdInsttNm", "excInsttNm", "소관부처명", "수행기관명", "agency"]) || "기업마당";
    const url = pick(item, ["pblancUrl", "link", "url", "dtlUrl"]) || "https://www.bizinfo.go.kr/";
    const description =
      pick(item, ["bsnsSumryCn", "description", "지원내용", "summary", "contents"]) ||
      "기업마당에서 수집한 지원사업 공고입니다.";
    const deadlineText = pick(item, ["reqstEndDe", "신청기간", "receptClosDe", "endDate"]) || "";
    const supportType = inferSupportType(`${title} ${description}`);

    return {
      id: `bizinfo-${hash(`${title}-${url}-${index}`)}`,
      source: "기업마당",
      title,
      agency,
      type: supportType,
      regions: inferRegions(`${title} ${description} ${pick(item, ["지역", "areaNm", "region"])}`),
      industries: inferIndustries(`${title} ${description} ${pick(item, ["지원대상", "trgetNm", "target"])}`),
      businessTypes: inferBusinessTypes(`${title} ${description}`),
      amount: null,
      deadline: normalizeDeadline(deadlineText),
      url,
      description: cleanHtmlText(description),
      required: ["공고문 확인"],
      eligibilityText: pick(item, ["지원대상", "trgetNm", "target"]) || "",
      collectedAt: new Date().toISOString().slice(0, 10),
    };
  });
}

function findItems(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.jsonArray)) return value.jsonArray;
  if (Array.isArray(value.items)) return value.items;
  if (Array.isArray(value.item)) return value.item;
  if (value.response?.body?.items?.item) {
    return Array.isArray(value.response.body.items.item)
      ? value.response.body.items.item
      : [value.response.body.items.item];
  }
  if (value.channel?.item) {
    return Array.isArray(value.channel.item) ? value.channel.item : [value.channel.item];
  }
  return [];
}

function pick(object, keys) {
  for (const key of keys) {
    if (object && object[key] !== undefined && object[key] !== null && String(object[key]).trim()) {
      return String(object[key]).trim();
    }
  }
  return "";
}

function inferRegions(text) {
  const regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
  const found = regions.filter((region) => text.includes(region));
  return found.length ? found : ["전국"];
}

function inferIndustries(text) {
  const result = [];
  if (/음식|식당|카페|외식|숙박/.test(text)) result.push("음식점업");
  if (/도소매|소매|도매|판매|유통|온라인몰|전자상거래/.test(text)) result.push("도소매업");
  if (/제조|공장|생산|스마트공장/.test(text)) result.push("제조업");
  if (/SW|소프트웨어|정보통신|ICT|AI|플랫폼|앱|데이터/.test(text)) result.push("IT/소프트웨어");
  if (/콘텐츠|미디어|디자인|영상|게임|출판|예술|공연|문화예술/.test(text)) result.push("콘텐츠");
  if (/의료|보건|한의원|병원|의원|치과|약국|요양기관|의료기관/.test(text)) result.push("보건/의료업");
  if (/서비스|컨설팅|교육/.test(text) && result.length === 0) result.push("서비스업");
  return result.length ? [...new Set(result)] : ["전업종"];
}

function inferBusinessTypes(text) {
  if (/예비창업|예비 창업/.test(text)) return ["예비창업자"];
  if (/중소기업|소상공인|중견기업|법인|개인기업|사업자등록|기업/.test(text)) {
    return ["개인사업자", "법인사업자"];
  }
  return ["개인사업자", "법인사업자", "예비창업자"];
}

function inferSupportType(text) {
  if (/R&D|기술개발|연구개발/.test(text)) return "R&D";
  if (/융자|자금|대출|정책자금/.test(text)) return "정책자금";
  if (/보증/.test(text)) return "보증";
  if (/바우처/.test(text)) return "바우처";
  if (/고용|채용|인건비/.test(text)) return "고용지원";
  if (/교육|컨설팅|멘토링/.test(text)) return "교육/컨설팅";
  return "보조금";
}

function normalizeDeadline(value) {
  if (/예산\s*소진|상시|수시/.test(String(value))) return "";
  const digits = String(value).match(/20[0-9]{2}[^0-9]?[01]?[0-9][^0-9]?[0-3]?[0-9]/g);
  if (!digits || digits.length === 0) return "";
  const last = digits[digits.length - 1].replace(/\D/g, "");
  return `${last.slice(0, 4)}-${last.slice(4, 6)}-${last.slice(6, 8)}`;
}

function cleanHtmlText(value) {
  return String(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 360);
}

function hash(value) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result << 5) - result + value.charCodeAt(index);
    result |= 0;
  }
  return Math.abs(result).toString(36);
}

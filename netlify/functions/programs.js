const { handler: bizinfoHandler } = require("./bizinfo");

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
    status: "needs_api",
    envKey: "KSTARTUP_API_KEY",
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
    configured: Boolean(process.env[source.envKey]),
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

  const pendingSources = sources
    .filter((source) => source.id !== "bizinfo" && requestedSources.includes(source.id))
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

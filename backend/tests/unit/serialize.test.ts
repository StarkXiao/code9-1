import { describe, expect, it } from "vitest";
import { deriveAccessNotes, serializeSpot, type SpotLike } from "../../src/modules/shared/serialize";

function makeSpot(attributes: unknown): SpotLike {
  return {
    uuid: "spot-1",
    title: "测试长椅",
    description: null,
    status: "published",
    attributes,
    exactLat: 31.23,
    exactLng: 121.47,
    publicLat: 31.2301,
    publicLng: 121.4701,
    fuzzEnabled: true,
    fuzzRadiusM: 50,
    addressText: null,
    freshnessScore: 60,
    confirmCount: 1,
    isStale: false,
    publishedAt: new Date("2026-09-01T00:00:00Z"),
    createdAt: new Date("2026-09-01T00:00:00Z"),
    updatedAt: new Date("2026-09-01T00:00:00Z"),
    category: { code: "bench", name: "长椅", icon: "bench", color: "#8B5E3C" },
  };
}

describe("出入口通行提示", () => {
  it("没填出入口属性时不给提示，避免被误读成已确认平坦", () => {
    expect(deriveAccessNotes({ has_backrest: true })).toEqual([]);
    expect(deriveAccessNotes(null)).toEqual([]);
    expect(deriveAccessNotes(undefined)).toEqual([]);
  });

  it("明确填 false 视为确认过没有台阶坡道，同样不给提示", () => {
    expect(deriveAccessNotes({ entrance_steps: false, entrance_ramp: false })).toEqual([]);
  });

  it("只有台阶时提示注意通行", () => {
    const notes = deriveAccessNotes({ entrance_steps: true });
    expect(notes).toHaveLength(1);
    expect(notes[0]!.kind).toBe("steps");
    expect(notes[0]!.text).toContain("台阶");
  });

  it("只有坡道时提示可通行", () => {
    const notes = deriveAccessNotes({ entrance_ramp: true });
    expect(notes).toHaveLength(1);
    expect(notes[0]!.kind).toBe("ramp");
    expect(notes[0]!.text).toContain("坡道");
  });

  it("台阶与坡道并存时两条提示都给出，台阶提示里说明可绕行", () => {
    const notes = deriveAccessNotes({ entrance_steps: true, entrance_ramp: true });
    expect(notes.map((note) => note.kind)).toEqual(["steps", "ramp"]);
    expect(notes[0]!.text).toContain("坡道");
  });
});

describe("serializeSpot 的步行耗时与通行提示字段", () => {
  it("附近搜索传入 walkingMinutes 时带上该字段，accessNotes 始终存在", () => {
    const payload = serializeSpot(makeSpot({ entrance_steps: true }), {
      distanceMeters: 312.4,
      walkingMinutes: 6,
    });

    expect(payload.walkingMinutes).toBe(6);
    expect(payload.distanceMeters).toBe(312);
    expect(payload.accessNotes).toHaveLength(1);
  });

  it("非附近搜索不带 walkingMinutes，没有出入口属性时 accessNotes 为空数组", () => {
    const payload = serializeSpot(makeSpot({}));

    expect(payload).not.toHaveProperty("walkingMinutes");
    expect(payload.accessNotes).toEqual([]);
  });
});

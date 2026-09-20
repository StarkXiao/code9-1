import { describe, expect, it } from "vitest";
import { accessNoticeFromAttributes } from "../../src/modules/shared/access";

describe("出入口通行提示", () => {
  it("只有台阶时提示注意台阶", () => {
    expect(accessNoticeFromAttributes({ entrance_steps: true })).toBe("入口有台阶，通行请注意");
  });

  it("只有坡道时提示可通行", () => {
    expect(accessNoticeFromAttributes({ entrance_ramp: true })).toBe("入口有坡道，轮椅、婴儿车可通行");
  });

  it("台阶与坡道并存时两者都说明", () => {
    expect(accessNoticeFromAttributes({ entrance_steps: true, entrance_ramp: true })).toBe(
      "入口有台阶，旁侧有坡道，轮椅、婴儿车可通行",
    );
  });

  it("明确没有台阶/坡道，或字段缺失时不输出提示", () => {
    expect(accessNoticeFromAttributes({ entrance_steps: false, entrance_ramp: false })).toBeNull();
    expect(accessNoticeFromAttributes({ has_backrest: true })).toBeNull();
    expect(accessNoticeFromAttributes({})).toBeNull();
  });

  it("非对象输入安全降级为 null", () => {
    expect(accessNoticeFromAttributes(null)).toBeNull();
    expect(accessNoticeFromAttributes(undefined)).toBeNull();
    expect(accessNoticeFromAttributes("nope")).toBeNull();
  });
});

/**
 * 出入口通行提示。
 *
 * 各分类的属性 Schema 里可以带两个公共布尔字段（见 seed 中的分类定义）：
 * - entrance_steps：到达该地点需要经过台阶
 * - entrance_ramp：出入口有坡道可通行
 *
 * 这里只根据结构化属性生成一句话提示，供附近搜索列表与详情页展示；
 * 字段缺失（老数据、用户没填）时返回 null，不做猜测。
 */
export const ACCESS_ATTR_STEPS = "entrance_steps";
export const ACCESS_ATTR_RAMP = "entrance_ramp";

export function accessNoticeFromAttributes(attributes: unknown): string | null {
  if (!attributes || typeof attributes !== "object") return null;
  const attrs = attributes as Record<string, unknown>;
  const hasSteps = attrs[ACCESS_ATTR_STEPS] === true;
  const hasRamp = attrs[ACCESS_ATTR_RAMP] === true;

  if (hasSteps && hasRamp) return "入口有台阶，旁侧有坡道，轮椅、婴儿车可通行";
  if (hasSteps) return "入口有台阶，通行请注意";
  if (hasRamp) return "入口有坡道，轮椅、婴儿车可通行";
  return null;
}

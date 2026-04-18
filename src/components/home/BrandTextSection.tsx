/**
 * Figma node 0:885 — Brand / Feature section  (1420 × 900 px, offset left=-52px)
 *
 * Typographic elements (decorative large text):
 *   "PLACEHOLDER" center  85px  top=124/900=13.78%   (node 0:890-0:891)
 *   "PLACEHOLDER" right   83px  top=306/900=34.00%   (node 0:892-0:893)
 *   "PLACEHOLDER" right   83px  top=388/900=43.11%   (node 0:894-0:895)
 *
 * Large image (left side):
 *   left≈0,  top=317/900=35.22%,  w=486/1440=33.75%,  h=583/900=64.78%
 *   (node 0:896)
 *
 * Text block (right side, node 0:897):
 *   left=494/1440=34.31%,  top=644/900=71.56%,  w=585/1440=40.63%
 *   - "Label"          8px  uppercase  tracking 0.2057px  (0:899)
 *   - Heading          20px           (0:900-0:901)
 *   - Body 5 lines     20px           (0:902-0:912)
 *   - "Text Link" + square indicator  (0:913-0:916)
 *
 * Section height responsive: height = 900/1440 × 100vw = 62.5vw
 */
export function BrandTextSection(): React.JSX.Element {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(480px, 62.5vw, 900px)" }}
    >
      {/* ── Decorative typography ── */}

      {/* "PLACEHOLDER" centered — node 0:890-0:891, top=13.78% */}
      <div
        className="absolute left-0 right-0 flex justify-center"
        style={{ top: "13.78%" }}
      >
        <span
          className="font-medium text-[#0a0a0a] leading-none whitespace-nowrap select-none"
          style={{
            fontSize: "clamp(28px, 5.9vw, 85px)",
            letterSpacing: "-0.053em",
          }}
        >
          PLACEHOLDER
        </span>
      </div>

      {/* "PLACEHOLDER" right — node 0:892-0:893, top=34% */}
      <div
        className="absolute right-0 flex justify-end"
        style={{ top: "34%" }}
      >
        <span
          className="font-medium text-[#0a0a0a] leading-none whitespace-nowrap select-none"
          style={{
            fontSize: "clamp(27px, 5.76vw, 83px)",
            letterSpacing: "-0.053em",
          }}
        >
          PLACEHOLDER
        </span>
      </div>

      {/* "PLACEHOLDER" right — node 0:894-0:895, top=43.11% */}
      <div
        className="absolute right-0 flex justify-end"
        style={{ top: "43.11%" }}
      >
        <span
          className="font-medium text-[#0a0a0a] leading-none whitespace-nowrap select-none"
          style={{
            fontSize: "clamp(27px, 5.76vw, 83px)",
            letterSpacing: "-0.053em",
          }}
        >
          PLACEHOLDER
        </span>
      </div>

      {/* ── Large product image (left) — node 0:896 ── */}
      {/* left≈0, top=35.22%, w=33.75%, h=64.78% */}
      <div
        className="absolute overflow-hidden bg-[#e3e3e3]"
        style={{
          left: 0,
          top: "35.22%",
          width: "33.75%",
          height: "64.78%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/main/main_2_1.png"
          alt="Featured product"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* ── Text block (right) — node 0:897 ── */}
      {/* left=34.31%, top=71.56%, w=40.63% */}
      <div
        className="absolute"
        style={{
          left: "34.31%",
          top: "71.56%",
          width: "40.63%",
        }}
      >
        {/* Label — node 0:899 */}
        <p className="text-[8px] font-normal text-[#0a0a0a] uppercase tracking-[0.2057px] leading-[12px] mb-[10px]">
          Label
        </p>

        {/* Heading — node 0:900-0:901 */}
        <p
          className="font-normal text-[#0a0a0a] leading-[22px] tracking-[-0.45px] whitespace-nowrap mb-[20px]"
          style={{ fontSize: "clamp(10px, 1.39vw, 20px)" }}
        >
          Placeholder text goes here with description
        </p>

        {/* Body copy — node 0:902-0:912 */}
        <div className="flex flex-col gap-[3px] mb-[18px]">
          {[
            "Placeholder text line one with content description text here",
            "placeholder line two with more content and description",
            "placeholder line three continuing the description text",
            "placeholder line four with additional content here now",
            "placeholder line five ending.",
          ].map((line, i) => (
            <p
              key={i}
              className="font-normal text-[#0a0a0a] leading-[22px] tracking-[-0.45px] whitespace-nowrap"
              style={{ fontSize: "clamp(9px, 1.39vw, 20px)" }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Text Link + square — node 0:913-0:916 */}
        <div className="flex items-center gap-[5px]">
          <span className="text-[8px] font-normal text-[#0a0a0a] uppercase tracking-[0.2057px] leading-[12px]">
            Text Link
          </span>
          <div className="w-[20px] h-[20px] bg-[#231f20] shrink-0" />
        </div>
      </div>
    </section>
  );
}

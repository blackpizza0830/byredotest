import Link from "next/link";

/**
 * Figma node 0:917 — Journal section  (1440 × 1080 px)
 *
 * Responsive approach: section height = 75vw (1080/1440 × 100vw)
 * All child positions expressed as % of 1440 (horizontal) or 1080 (vertical).
 *
 * Image layout (all % of 1440px width / 1080px height):
 *   imgContainer6 (top-left):    left=8.96%  top=-3.80%  w=32.36%  h=34.44%  node 0:918
 *   imgContainer7 (top-right):   left=75.14% top=24.26%  w=7.57%   h=12.78%  node 0:919
 *   imgContainer8 (bottom-left): left=0.69%  top=62.69%  w=15.83%  h=26.67%  node 0:920
 *   imgContainer9 (bottom-right):left=75.14% top=74.35%  w=24.17%  h=25.65%  node 0:921
 *
 * Center card (node 0:922):
 *   left=34.98%  top=36.02%  w=30.04%
 *   Contains: "Journal" 69px, subtitle 21px, body 8px, hr + black button 50px
 */
export function JournalSection(): React.JSX.Element {
  return (
    <section className="relative w-full overflow-hidden mt-[200px]"
      style={{ height: "75vw" }}>

      {/* Top-left image — node 0:918 */}
      <div
        className="absolute overflow-hidden bg-[#e3e3e3]"
        style={{
          left: "8.96%",
          top: "-3.80%",
          width: "32.36%",
          height: "34.44%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/main/main_2_2.png"
          alt="Journal feature"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Top-right small image — node 0:919 */}
      <div
        className="absolute overflow-hidden bg-[#e3e3e3]"
        style={{
          left: "75.14%",
          top: "24.26%",
          width: "7.57%",
          height: "12.78%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/main/main_3_1.png"
          alt="Journal detail"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom-left image — node 0:920 */}
      <div
        className="absolute overflow-hidden bg-[#e3e3e3]"
        style={{
          left: "0.69%",
          top: "62.69%",
          width: "15.83%",
          height: "26.67%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/main/main_3_2.png"
          alt="Journal lifestyle"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom-right image — node 0:921 */}
      <div
        className="absolute overflow-hidden bg-[#e3e3e3]"
        style={{
          left: "75.14%",
          top: "74.35%",
          width: "24.17%",
          height: "25.65%",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/main/main_1_2.png"
          alt="Journal editorial"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Center card — node 0:922 */}
      <div
        className="absolute flex flex-col items-center"
        style={{
          left: "34.98%",
          top: "36.02%",
          width: "30.04%",
        }}
      >
        {/* "Journal" heading — node 0:924 */}
        <p
          className="capitalize font-medium text-[#0a0a0a] text-center leading-none tracking-[-0.052em] whitespace-nowrap"
          style={{ fontSize: "clamp(28px, 4.79vw, 69px)" }}
        >
          Journal
        </p>

        {/* Subtitle lines — node 0:925-0:929 */}
        <div className="mt-[5.56%] flex flex-col gap-[3px] items-center w-full">
          <p
            className="font-normal text-[#0a0a0a] text-center uppercase tracking-[-0.069em] leading-none whitespace-nowrap"
            style={{ fontSize: "clamp(10px, 1.46vw, 21px)" }}
          >
            PLACEHOLDER TEXT
          </p>
          <p
            className="font-normal text-[#0a0a0a] text-center uppercase tracking-[-0.069em] leading-none whitespace-nowrap"
            style={{ fontSize: "clamp(10px, 1.46vw, 21px)" }}
          >
            PLACEHOLDER
          </p>
        </div>

        {/* Body text — node 0:930-0:936 */}
        <div className="mt-[3.47%] flex flex-col gap-[3px] items-center">
          {[
            "Placeholder text for newsletter description here",
            "with additional line of text and content here too",
            "ending text.",
          ].map((line, i) => (
            <p key={i} className="text-[8px] font-normal text-[#0a0a0a] text-center tracking-[0.2057px] leading-[9px] whitespace-nowrap">
              {line}
            </p>
          ))}
        </div>

        {/* Divider + button — node 0:937-0:940 */}
        <div className="mt-[5.21%] flex flex-col gap-[25px] w-full items-center">
          <div className="w-full h-px bg-[#dedcdc]" />
          <Link
            href="/journal"
            className="w-full h-[50px] bg-[#231f20] flex items-center justify-center"
          >
            <span className="text-[8px] font-normal text-[#ebebeb] uppercase tracking-[0.2057px] leading-[12px]">
              Explore
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

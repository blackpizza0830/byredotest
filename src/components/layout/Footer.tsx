/**
 * Figma node 0:952-0:958
 * Footer text sits below the BYREDO signature SVG/text rendered in ByredoSignature.
 * Layout: two rows, each with left/right aligned text at 12px medium.
 */
export function Footer(): React.JSX.Element {
  return (
    <footer className="w-full px-[10px] pb-4">
      {/* Row 1 — node 0:954 / 0:955 */}
      <div className="flex justify-between items-baseline">
        <p className="capitalize text-[12px] font-medium text-black leading-none">
          Horace Ortiz
        </p>
        <p className="capitalize text-[12px] font-medium text-black leading-none">
          BYREDO all right reserved
        </p>
      </div>

      {/* Row 2 — node 0:956 / 0:957 */}
      <div className="flex justify-between items-baseline mt-[4px]">
        <p className="capitalize text-[12px] font-medium text-black leading-none">
          Gladys.Romaguera10@gmail.com
        </p>
        <p className="capitalize text-[12px] font-medium text-black leading-none">
          Fri Jan 14 2039 16:54:41 GMT+0900
        </p>
      </div>

      {/* Row 3 — node 0:958 */}
      <div className="mt-[4px]">
        <p className="capitalize text-[12px] font-medium text-black leading-none">
          59362
        </p>
      </div>
    </footer>
  );
}

import PropTypes from "prop-types";
import { ParapetSlot, BacklitSlot } from "~components/ParapetSlot";
import WIPWrapper from "~components/WIPWrapper";
const FPJ = ({ backlitData = [], SBparapetData = [], ticketBoothsData = [], onClick1, onClick2, onClick3 }) => {
  const positionsP = [
    // === Top row (y = 148) ===
    { x: 690, y: 148 },
    { x: 868, y: 148 },
    { x: 1368, y: 148 },
    { x: 1584, y: 148 },
    { x: 1800, y: 148 },
    { x: 2016, y: 148 },
    { x: 2591, y: 148 },
    { x: 2810, y: 148 },
    { x: 3029, y: 148 },
    { x: 3248, y: 148 },

    // === Bottom row (y = 654) ===
    { x: 347, y: 654 },
    { x: 600, y: 654 },
    { x: 853, y: 654 },
    { x: 1368, y: 654 },
    { x: 1584, y: 654 },
    { x: 1800, y: 654 },
    { x: 2016, y: 654 },
    { x: 2493, y: 654 },
    { x: 2640, y: 654 },
  ];

  const positionsB = [
    // === Backlits (y = 505) ===
    { x: 875, y: 505 },
    { x: 1456, y: 505 },
    { x: 2037, y: 505 },
    { x: 2618, y: 505 },
  ];

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMin meet"
        fill="none"
        viewBox="0 0 3623 1045"
      >
        <g className="FPJ Station">
          <g className="Vector">
            <path fill="#000" d="M246 511v4H128v-4h118Zm4 171h-4V481h4v201Z" />
            <path fill="#000" d="M790 678v4H246v-4h544Zm37 43v4H512v-4h315Z" />
            <path fill="#000" d="M823 680h4v45h-4v-45Zm1935 0v4H827v-4h1931Z" />
            <path fill="#000" d="M2469 572h4v112h-4V572Z" />
            <path fill="#000" d="M2181 576v-4h292v4h-292Zm1220-99v4H246v-4h3155Zm-643 247h-4v-40h4v40Z" />
            <path fill="#000" d="M3068 721v4h-314v-4h314Zm333-37h-4V481h4v203Zm-616 4v-4h616v4h-616Z" />
            <path fill="#000" d="M3513.01 511v4h-116.02v-4h116.02ZM3140 534h-4v-40h4v40Z" />
            <path fill="#000" d="M2143 535v-4h998v4h-998Z" />
            <path
              fill="#000"
              d="M2835 624h-4v-90h4v90Zm-689 17h-4V534h4v107ZM246 301v4H103v-4h143Zm4 27h-4V140h4v188Z"
            />
            <path fill="#000" d="M3395 326v4H246v-4h3149Z" />
            <path fill="#000" d="M503 286h4v42h-4v-42Zm852 2v4H507v-4h848Z" />
            <path fill="#000" d="M641 199h4v91h-4v-91Zm712-18h4v109h-4V181ZM247 339h-4v-13h4v13Z" />
            <path fill="#000" d="M3395 337v4H243v-4h3152Z" />
            <path fill="#000" d="M3394.02 139.995h4v201.01h-4v-201.01Z" />
            <path fill="#000" d="M3511 303.5v4h-114v-4h114ZM245.999 498v-4H3397v4H245.999ZM2823 136v4H246v-4h2577Z" />
            <path
              fill="#000"
              d="M2819 94h4v44h-4V94Zm322 0v4h-318v-4h318Zm258.01 43-.01 4-576-1 .01-4 576 1ZM824 98h4v42h-4V98Z"
            />
            <path
              fill="#000"
              d="M515 102v-4h313v4H515Zm495.03 149-.03-4 279-2 .03 4-279 2Zm278.97-6h-4V140h4v105Zm1184-2v4h-294v-4h294Z"
            />
            <path
              fill="#000"
              d="M2469 140h4v107h-4V140ZM1000 574h4v110h-4V574Zm295-4v4h-295v-4h295ZM497 283h15v15h-15v-15Zm138-1h15v15h-15v-15Zm712 1h15v15h-15v-15Zm1-108h15v15h-15v-15Zm788 458h15v15h-15v-15Z"
            />
            <path
              fill="#000"
              d="M2136 633h15v15h-15v-15Zm0-45h15v15h-15v-15Zm0-60h15v15h-15v-15Zm688-2h15v15h-15v-15Zm306 1h15v15h-15v-15Z"
            />
          </g>
          <g className="FPJ Assets">
            {SBparapetData.map((item, index) => {
              const pos = positionsP[index];
              if (!pos) return null;
              return <ParapetSlot key={item.asset_id} item={item} pos={pos} onClick={onClick2} />;
            })}
            {backlitData.slice(0, backlitData.length).map((item, index) => {
              const pos = positionsB[index];
              if (!pos) return null;
              return <BacklitSlot key={item.asset_id} item={item} pos={pos} onClick={onClick1} />;
            })}
          </g>
        </g>
      </svg>
      <WIPWrapper details="Mezzanine details to follow">
        <svg className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 3820 1351">
          <g className="FPJ Mezzanine">
            <path fill="url(#a)" d="M0 0h3819v1351H0z" className="FPJ Mezzannine" opacity=".7" />
            <g className="FPJ Mezzanine Frame">
              <path
                stroke="#000"
                strokeWidth="4"
                d="M905 372.5V446l1009.5-6.5v-221l-137.5-109h-716v-44h860v-18h789V104h-463l-148 114.5v221h951V371h561.5v308h206v65h-206v311h-698v-66H2099v45l142 110.5h511.5v63.5H1095v-47.5h664l160.5-126.5v-45H831v66H404V744H61.5v-66H404V372.5h501Z"
                className="Vector 12"
              />
              <g className="ENTRY/EXIT_SB_R">
                <g className="ENTRY/EXIT_SB_R">
                  <path
                    fill="#000"
                    d="M1118.93 692v-23.273h15.68v4.057h-10.76v5.546h9.95v4.056h-9.95v5.557h10.81V692h-15.73Zm39.06-23.273V692h-4.25l-10.13-14.648h-.17V692h-4.92v-23.273h4.32l10.05 14.637h.2v-14.637h4.9Zm3.18 4.057v-4.057h19.11v4.057h-7.12V692h-4.87v-19.216h-7.12ZM1183.43 692v-23.273h9.18c1.76 0 3.26.315 4.5.943 1.25.622 2.2 1.504 2.85 2.648.66 1.137.99 2.474.99 4.012 0 1.545-.33 2.875-1 3.988-.66 1.106-1.63 1.955-2.9 2.546-1.25.591-2.78.886-4.56.886h-6.15v-3.955h5.35c.94 0 1.72-.128 2.34-.386.62-.257 1.08-.644 1.39-1.159.31-.515.46-1.155.46-1.92 0-.773-.15-1.425-.46-1.955-.31-.53-.77-.932-1.4-1.205-.62-.28-1.41-.42-2.35-.42h-3.32V692h-4.92Zm12.57-10.591 5.78 10.591h-5.43l-5.66-10.591h5.31Zm6.1-12.682h5.51l5.3 10.023h.23l5.31-10.023h5.51l-8.49 15.046V692h-4.88v-8.227l-8.49-15.046Zm34.59-1.091-7.5 27.864h-4.17l7.5-27.864h4.17ZM1142.62 731v-23.273h15.68v4.057h-10.76v5.546h9.95v4.056h-9.95v5.557h10.8V731h-15.72Zm24.2-23.273 4.7 7.932h.18l4.71-7.932h5.56l-7.1 11.637 7.26 11.636h-5.66l-4.77-7.943h-.18l-4.78 7.943h-5.63l7.28-11.636-7.15-11.637h5.58Zm23.19 0V731h-4.92v-23.273h4.92Zm3.16 4.057v-4.057h19.11v4.057h-7.12V731h-4.87v-19.216h-7.12Z"
                    className="ENTRY/EXIT_SB_R"
                  />
                </g>
              </g>
              <g className="ENTRY/EXIT_SB_R">
                <g className="ENTRY/EXIT_SB_R">
                  <path
                    fill="#000"
                    d="M2719.93 706v-23.273h15.68v4.057h-10.76v5.546h9.95v4.056h-9.95v5.557h10.81V706h-15.73Zm39.06-23.273V706h-4.25l-10.13-14.648h-.17V706h-4.92v-23.273h4.32l10.05 14.637h.2v-14.637h4.9Zm3.18 4.057v-4.057h19.11v4.057h-7.12V706h-4.87v-19.216h-7.12ZM2784.43 706v-23.273h9.18c1.76 0 3.26.315 4.5.943 1.25.622 2.2 1.504 2.85 2.648.66 1.137.99 2.474.99 4.012 0 1.545-.33 2.875-1 3.988-.66 1.106-1.63 1.955-2.9 2.546-1.25.591-2.78.886-4.56.886h-6.15v-3.955h5.35c.94 0 1.72-.128 2.34-.386.62-.257 1.08-.644 1.39-1.159.31-.515.46-1.155.46-1.92 0-.773-.15-1.425-.46-1.955-.31-.53-.77-.932-1.4-1.205-.62-.28-1.41-.42-2.35-.42h-3.32V706h-4.92Zm12.57-10.591 5.78 10.591h-5.43l-5.66-10.591h5.31Zm6.1-12.682h5.51l5.3 10.023h.23l5.31-10.023h5.51l-8.49 15.046V706h-4.88v-8.227l-8.49-15.046Zm34.59-1.091-7.5 27.864h-4.17l7.5-27.864h4.17ZM2743.62 745v-23.273h15.68v4.057h-10.76v5.546h9.95v4.056h-9.95v5.557h10.8V745h-15.72Zm24.2-23.273 4.7 7.932h.18l4.71-7.932h5.56l-7.1 11.637 7.26 11.636h-5.66l-4.77-7.943h-.18l-4.78 7.943h-5.63l7.28-11.636-7.15-11.637h5.58Zm23.19 0V745h-4.92v-23.273h4.92Zm3.16 4.057v-4.057h19.11v4.057h-7.12V745h-4.87v-19.216h-7.12Z"
                    className="ENTRY/EXIT_SB_R"
                  />
                </g>
              </g>
            </g>
            <g className="FPJ Mezzanine Assets">
              <g className="TURNSTILE_SB_R">
                <path stroke="#000" d="M1104.5 628.5v159h-54v-159z" />
                <g className="TURNSTILE_SB_R">
                  <path stroke="#000" strokeWidth="3" d="M1103.5 629.5v157h-52v-157z" className="TURNSTILE_SB_R" />
                </g>
              </g>
              <g className="TURNSTILE_SB_R">
                <path stroke="#000" d="M2918.5 628.5v171h-53v-171z" />
                <g className="TURNSTILE_SB_R">
                  <path stroke="#000" strokeWidth="3" d="M2917.5 629.5v169h-51v-169z" className="TURNSTILE_SB_R" />
                </g>
              </g>
              <g className="GeneralAsset">
                <path stroke="#000" strokeWidth="3" d="M1119.5 830.5h61v47h-61z" />
                <path stroke="#000" d="M1118.5 829.5h63v49h-63z" className="Rectangle" />
              </g>
              <g className="GeneralAsset">
                <path stroke="#000" strokeWidth="3" d="M1912.5 618.5h179v180h-179z" />
                <path stroke="#000" d="M1911.5 617.5h181v182h-181z" className="Rectangle" />
              </g>
              <g className="GeneralAsset">
                <path stroke="#000" strokeWidth="3" d="M2837.5 557.5h60v47h-60z" />
                <path stroke="#000" d="M2836.5 556.5h62v49h-62z" className="Rectangle" />
              </g>
            </g>
          </g>
        </svg>
      </WIPWrapper>
    </>
  );
};
FPJ.propTypes = {
  backlitData: PropTypes.array,
  SBparapetData: PropTypes.array,
  ticketBoothsData: PropTypes.array,
  onClick1: PropTypes.func,
  onClick2: PropTypes.func,
  onClick3: PropTypes.func,
  handleSouthClick: PropTypes.func,
  handleNorthClick: PropTypes.func,
};
export default FPJ;

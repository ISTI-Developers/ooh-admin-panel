import PropTypes from "prop-types";
import { ParapetSlot, BacklitSlot } from "~components/ParapetSlot";
import WIPWrapper from "~components/WIPWrapper";
const Balintawak = ({ backlitData = [], SBparapetData = [], ticketBoothsData = [], onClick1, onClick2, onClick3 }) => {
  const positionsB = [
    // === Backlits (y = 334) ===
    { x: 978, y: 335 },
    { x: 1559, y: 335 },
    { x: 2140, y: 335 },
    { x: 2721, y: 335 },
  ];

  const positionsP = [
    // === Top row (y = 180) ===
    { x: 955, y: 180 },
    { x: 1617, y: 180 },
    { x: 1915, y: 180 },
    { x: 2213, y: 180 },
    { x: 2676, y: 180 },
    { x: 2877, y: 180 },
    { x: 3078, y: 180 },

    // === Bottom row (y = 701) ===
    { x: 608, y: 701 },
    { x: 906, y: 701 },
    { x: 1617, y: 701 },
    { x: 1915, y: 701 },
    { x: 2213, y: 701 },
    { x: 2702, y: 701 },
    { x: 2903, y: 701 },
  ];

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMin meet"
        fill="none"
        viewBox="0 0 3677 1150"
      >
        <g className="Balintawak Station">
          <path fill="url(#a)" d="M0 0h3677v1150H0z" className="Balintawak" opacity=".7" />
          <g className="Vector">
            <path fill="#000" d="M161 736h-4V558h4v178Z" />
            <path fill="#000" d="M1087 732v4H157v-4h930Zm38 45v4H687v-4h438Z" />
            <path fill="#000" d="M1121 732h4v49h-4v-49Zm1751 0v4H1125v-4h1747Zm0 49h-4v-45h4v45Z" />
            <path fill="#000" d="M3202 777v4h-333v-4h333Zm282-44v4h-576v-4h576Z" />
            <path fill="#000" d="M3480 525h4v212h-4V525Z" />
            <path fill="#000" d="M157 528v-4h3327v4H157Z" />
            <path fill="#000" d="M161 538h-4v-14h4v14Z" />
            <path fill="#000" d="M3484 534.5v4H157v-4h3327Z" />
            <path fill="#000" d="M168 557h-4v-20h4v20Zm-11 4v-4h11v4h-11Zm3054 21h-4v-43h4v43Z" />
            <path fill="#000" d="M2292 584v-4h916v4h-916Z" />
            <path fill="#000" d="M3069 662h-4v-82h4v82Zm-776 30h-4V582h4v110Z" />
            <path fill="#000" d="M2365 687v4h-73v-4h73Zm4 30h-4v-95h4v95Z" />
            <path fill="#000" d="M2643 713v4h-300v-4h300Z" />
            <path fill="#000" d="M2639 622h4v114h-4V622Z" />
            <path fill="#000" d="M2365 626v-4h278v4h-278Zm-916-7.5v4h-298v-4h298ZM1155 736h-4V623h4v113Z" />
            <path fill="#000" d="M1449 660v4h-298v-4h298ZM48 565v-4h109v4H48Zm113-214h-4V170h4v181Z" />
            <path fill="#000" d="M45.035 347 45 343l112-1.009.036 4-112 1.009ZM170 347v4h-13v-4h13Z" />
            <path fill="#000" d="M170 369h-4v-19h4v19Zm-13 4v-4h13v4h-13Z" />
            <path fill="#000" d="M161 382h-4v-13h4v13Z" />
            <path fill="#000" d="M3483 378v4H157v-4h3326Z" />
            <path fill="#000" d="M3480.5 168.989h4V382.01h-4V168.989Z" />
            <path fill="#000" d="M2908 173v-4h576v4h-576Zm516-52h4v48h-4v-48Zm-556 8v-4h335v4h-335Z" />
            <path fill="#000" d="M2872 169h-4v-44h4v44Zm-1748 4v-4h1748v4H1124Zm-4-46h4v42h-4v-42Z" />
            <path fill="#000" d="M793 129v-4h331v4H793Zm289 36.5v4H156.999v-4H1082ZM3473 364v4H166v-4h3307Z" />
            <path fill="#000" d="M3469 347h4v20h-4v-20Zm14-4v4h-14v-4h14ZM429.5 323.994h4v42.012h-4v-42.012Z" />
            <path fill="#000" d="M1501 321.5v4H433v-4h1068Z" />
            <path
              fill="#000"
              d="M757 241h4v84h-4v-84Zm744-26h4v110h-4V215Zm1144-28v4h-302v-4h302Zm4 96h-4V169h4v114Zm-306 4v-4h302v4h-302Zm1263 270v4h-122v-4h122Zm1-218v4h-123v-4h123ZM423 319h15v15h-15v-15Z"
            />
            <path
              fill="#000"
              d="M752 317h15v15h-15v-15Zm743-1h15v15h-15v-15Zm0-60h15v15h-15v-15Zm-1-46h15v15h-15v-15Zm790 472h15v15h-15v-15Zm-2-106h15v15h-15v-15Zm777 0h15v15h-15v-15Zm142-2h15v15h-15v-15Z"
            />
          </g>
          <g className="Balintawak Assets">
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
        <svg className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 3820 1370">
          <g className="Balintawak Mezzanine">
            <path fill="url(#a)" d="M.5 0h3819v1370H.5z" className="Balintawak Mezzanine 1" opacity=".7" />
            <g className="Balintawak Mezzanine Frame">
              <path
                stroke="#000"
                strokeWidth="4"
                d="M109 636H2v86h107v-11h350v96h-10.5v211.5h725V949h578v267.5h-850v54H2800V1215h-472.5v-54.5H1934V949h1151v69h547V710.5h174v-64h-174V340h-547v66H1934V214h309v-53.5h1089.5V103H1307v50h441.5v253h-575v-67.5H451V551h9.5v98H109v-13Z"
                className="Vector 13"
              />
            </g>
            <g className="Balintawak Mezzanine Station">
              <g className="TURNSTILE_SB_R">
                <path stroke="#000" d="M1303 586.5v169h-77v-169z" />
                <g className="TURNSTILE_SB_R">
                  <path stroke="#000" strokeWidth="3" d="M1302 587.5v167h-75v-167z" className="TURNSTILE_SB_R" />
                </g>
              </g>
              <g className="GeneralAsset">
                <path stroke="#000" strokeWidth="3" d="M1860 587.5h177v184h-177z" />
                <path stroke="#000" d="M1859 586.5h179v186h-179z" className="Rectangle" />
              </g>
              <g className="TURNSTILE_SB_R">
                <path stroke="#000" d="M3042 588.5v171h-70v-171z" />
                <g className="TURNSTILE_SB_R">
                  <path stroke="#000" strokeWidth="3" d="M3041 589.5v169h-68v-169z" className="TURNSTILE_SB_R" />
                </g>
              </g>
              <g className="GeneralAsset">
                <path stroke="#000" strokeWidth="3" d="M2870 518.5h58v45h-58z" />
                <path stroke="#000" d="M2869 517.5h60v47h-60z" className="Rectangle" />
              </g>
              <g className="GeneralAsset">
                <path stroke="#000" strokeWidth="3" d="M1234 792.5h57v45h-57z" />
                <path stroke="#000" d="M1233 791.5h59v47h-59z" className="Rectangle" />
              </g>
            </g>
          </g>
        </svg>
      </WIPWrapper>
    </>
  );
};
Balintawak.propTypes = {
  backlitData: PropTypes.array,
  SBparapetData: PropTypes.array,
  ticketBoothsData: PropTypes.array,
  onClick1: PropTypes.func,
  onClick2: PropTypes.func,
  onClick3: PropTypes.func,
  handleSouthClick: PropTypes.func,
  handleNorthClick: PropTypes.func,
};
export default Balintawak;

import PropTypes from "prop-types";
import { ParapetSlot, BacklitSlot } from "~components/ParapetSlot";
const Tayuman = ({ backlitData = [], SBparapetData = [], ticketBoothsData = [], onClick1, onClick2, onClick3 }) => {
  const positionsP = [
    // === y = 323 ===
    { x: 744.018, y: 323 },
    { x: 876.018, y: 323 },
    { x: 1008.02, y: 323 },
    { x: 1140.02, y: 323 },
    { x: 1272.02, y: 323 },
    { x: 1404.02, y: 323 },
    { x: 1536.02, y: 323 },
    { x: 1668.02, y: 323 },
    { x: 1800.02, y: 323 },
    { x: 1932.02, y: 323 },
    { x: 2064.02, y: 323 },
    { x: 2196.02, y: 323 },
    { x: 2328.02, y: 323 },
    { x: 2460.02, y: 323 },
    { x: 2592.02, y: 323 },
    { x: 2724.02, y: 323 },
    { x: 2856.02, y: 323 },
    { x: 2988.02, y: 323 },
    { x: 3120.02, y: 323 },

    // === y = 604 ===
    { x: 451.018, y: 604 },
    { x: 576.018, y: 604 },
    { x: 701.018, y: 604 },
    { x: 826.018, y: 604 },
    { x: 951.018, y: 604 },
    { x: 1076.02, y: 604 },
    { x: 1201.02, y: 604 },
    { x: 1326.02, y: 604 },
    { x: 1451.02, y: 604 },
    { x: 1960.02, y: 608 },
    { x: 2117.02, y: 608 },
    { x: 2274.02, y: 608 },
    { x: 2431.02, y: 608 },
    { x: 2588.02, y: 608 },
    { x: 2745.02, y: 608 },
    { x: 2902.02, y: 608 },
    { x: 3059.02, y: 608 },
    { x: 3216.02, y: 608 },
  ];

  const positionsB = [
    { x: 1184.52, y: 359.5 },
    { x: 1915.52, y: 359.5 },
    { x: 2646.52, y: 359.5 },
    { x: 982.518, y: 555 },
    { x: 2191.52, y: 555 },
  ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMin meet"
      fill="none"
      viewBox="0 0 3915 1098"
    >
      <g className="Tayuman Station">
        <g className="Vector">
          <path fill="#000" d="M3226.02 310v4H689.017v-4H3226.02Z" />
          <path
            fill="#000"
            d="M3222.02 223h4v91h-4v-91Zm579 0v4h-575v-4h575Zm0 32v4h-539v-4h539Zm-535 59h-4v-55h4v55Z"
          />
          <path fill="#000" d="M3489.02 310v4h-227v-4h227Zm0 87h-4v-83h4v83Z" />
          <path
            fill="#000"
            d="M3716.02 362v4h-231v-4h231Zm-227 35v4H234.017v-4H3489.02ZM685.017 66h4v248h-4V66Zm17 .016 4-.016 1 248-4 .016-1-248Z"
          />
          <path fill="#000" d="M315.017 70v-4h391v4h-391Z" />
          <path fill="#000" d="M319.017 148h-4V66h4v82Zm12.5-82.003h4v82.006h-4V65.997ZM150.017 101v-4h165v4h-165Z" />
          <path fill="#000" d="M154.017 220h-4V97h4v123Z" />
          <path fill="#000" d="M336.017 216v4h-186v-4h186Z" />
          <path fill="#000" d="M313.517 219.976h4v94.048h-4v-94.048Zm26.5 57.024h-4v-61h4v61Z" />
          <path fill="#000" d="M233.017 318v-4h85v4h-85Z" />
          <path
            fill="#000"
            d="M237.017 401h-4v-87h4v87ZM0 372.964l.018-4L233.017 370l-.017 4-233-1.036Zm220.035 203.041-.018 4L.017 579l.019-4 219.999 1.005Z"
          />
          <path fill="#000" d="M224.017 631h-4v-61h4v61Z" />
          <path fill="#000" d="M233.017 627v4h-13v-4h13Z" />
          <path
            fill="#000"
            d="M229.017 549h4v82h-4v-82Zm0 17v4h-9v-4h9Zm3260.003-21v4H229.017v-4H3489.02Zm0 29h-4v-25h4v25Z"
          />
          <path fill="#000" d="M3711.02 570v4h-226v-4h226Zm-240.04 59 .04 4-114 1-.04-4 114-1Z" />
          <path fill="#000" d="M3467.02 562h4v71h-4v-71Zm-106 121h-4v-50h4v50Z" />
          <path fill="#000" d="M3895.02 679v4h-538v-4h538Zm-578 40v-4h578v4h-578Zm-4-85h4v85h-4v-85Z" />
          <path fill="#000" d="M1940.02 638v-4h1377v4h-1377Z" />
          <path fill="#000" d="M1944.02 886h-4V634h4v252Zm-270.03-16 .03-4 266 2-.03 4-266-2Z" />
          <path fill="#000" d="M1678.02 939h-4v-73h4v73Z" />
          <path fill="#000" d="M1912.02 935v4h-355v-4h355Z" />
          <path fill="#000" d="M1908.02 882h4v57h-4v-57Z" />
          <path fill="#000" d="M1674.02 886v-4h266v4h-266Zm-121-253h4v306h-4V633Z" />
          <path fill="#000" d="M1574.02 629.25v4L229.017 633l.001-4 1345.002.25Z" />
          <path fill="#000" d="M1574.02 877h-4V633h4v244Zm-17 4v-4h17v4h-17Zm48 31v-4h63v4h-63Z" />
          <path fill="#000" d="M1605.02 804h4v107h-4V804Z" />
          <path fill="#000" d="M1832.02 804v4h-224v-4h224Z" />
          <path fill="#000" d="M1829.02 593h4v215h-4V593Z" />
          <path fill="#000" d="M3215.02 591.5v4l-1387-.5v-4l1387 .5Z" />
          <path fill="#000" d="M3212.02 562h4v31h-4v-31Z" />
          <path
            fill="#000"
            d="M3206.02 586h15v15h-15v-15Zm-1383-1h15v15h-15v-15Zm1 214h15v15h-15v-15Zm-225 0h15v15h-15v-15Zm0 103h15v15h-15v-15Zm-44-124h15v15h-15v-15Zm0-114h15v15h-15v-15Zm133 203h15v15h-15v-15Zm109 0h15v15h-15v-15Zm128 2h15v15h-15v-15ZM408.078 186l-.06 4-66.001-1 .061-4 66 1Z"
          />
          <path fill="#000" d="M411.017 267h-4v-79h4v79Z" />
          <path fill="#000" d="m616.997 263.975.02 4-207 1.025-.019-4 206.999-1.025Z" />
          <path fill="#000" d="M620.017 354h-4v-89h4v89Z" />
          <path fill="#000" d="M511.017 357v-4h107v4h-107Z" />
          <path
            fill="#000"
            d="M512.017 384h-4v-31h4v31Zm-110-202h15v15h-15v-15Zm0 77h15v15h-15v-15Zm207 0h15v15h-15v-15Zm0 88h15v15h-15v-15Z"
          />
          <path
            fill="#000"
            d="M502.017 347h15v15h-15v-15Zm534.003-90v4H902.517v-4h133.503Zm0-50.5v4H845.517V259h-4v-52.5h194.503Zm2-139V160H873.517v-47.5h4V156h156.503V71.5h-42.003v-4h46.003Zm-34 43v4h-94.503v-4h94.503Zm1352 723.5v54.5h-4V838h-301v84.5h212.5v4h-216.5V834h309Zm-683.07-193v-23.273h15.68v4.057h-10.76v5.545h9.95v4.057h-9.95v5.557h10.8V641h-15.72Zm39.06-23.273V641h-4.25l-10.13-14.648h-.17V641h-4.92v-23.273h4.32l10.04 14.636h.21v-14.636h4.9Zm3.18 4.057v-4.057h19.11v4.057h-7.13V641h-4.86v-19.216h-7.12ZM1737.45 641v-23.273h9.18c1.76 0 3.26.314 4.5.943 1.25.621 2.2 1.504 2.85 2.648.66 1.136.99 2.473.99 4.011 0 1.546-.33 2.875-1 3.989-.67 1.106-1.63 1.954-2.9 2.545-1.26.591-2.78.887-4.57.887h-6.14v-3.955h5.35c.94 0 1.72-.129 2.34-.386.62-.258 1.08-.644 1.39-1.159.31-.515.46-1.156.46-1.921 0-.772-.15-1.424-.46-1.954-.31-.531-.77-.932-1.4-1.205-.62-.28-1.41-.42-2.35-.42h-3.32V641h-4.92Zm12.56-10.591L1755.8 641h-5.43l-5.66-10.591h5.3Zm6.1-12.682h5.52l5.3 10.023h.23l5.31-10.023h5.51l-8.49 15.045V641h-4.89v-8.228l-8.49-15.045Zm34.6-1.091-7.5 27.864h-4.17l7.5-27.864h4.17ZM1696.63 680v-23.273h15.69v4.057h-10.77v5.545h9.96v4.057h-9.96v5.557h10.81V680h-15.73Zm24.21-23.273 4.69 7.932h.19l4.71-7.932h5.56l-7.1 11.636 7.26 11.637h-5.66l-4.77-7.943h-.19l-4.77 7.943h-5.63l7.28-11.637-7.15-11.636h5.58Zm23.18 0V680h-4.92v-23.273h4.92Zm3.17 4.057v-4.057h19.11v4.057h-7.13V680h-4.86v-19.216h-7.12ZM565.946 208v-23.273h15.682v4.057h-10.761v5.545h9.954v4.057h-9.954v5.557h10.807V208h-15.728Zm39.06-23.273V208h-4.25l-10.125-14.648h-.17V208h-4.921v-23.273h4.318l10.046 14.636h.204v-14.636h4.898Zm3.179 4.057v-4.057h19.114v4.057h-7.125V208h-4.864v-19.216h-7.125ZM630.446 208v-23.273h9.182c1.758 0 3.258.314 4.5.943 1.25.621 2.201 1.504 2.852 2.648.66 1.136.989 2.473.989 4.011 0 1.546-.333 2.875-1 3.989-.667 1.106-1.632 1.954-2.898 2.545-1.257.591-2.78.887-4.568.887h-6.148v-3.955h5.353c.939 0 1.719-.129 2.341-.386.621-.258 1.083-.644 1.386-1.159.311-.515.466-1.156.466-1.921 0-.772-.155-1.424-.466-1.954-.303-.531-.769-.932-1.398-1.205-.621-.28-1.405-.42-2.352-.42h-3.318V208h-4.921Zm12.569-10.591L648.799 208h-5.432l-5.659-10.591h5.307Zm6.099-12.682h5.511l5.307 10.023h.227l5.307-10.023h5.512l-8.489 15.045V208h-4.886v-8.228l-8.489-15.045Zm34.597-1.091-7.5 27.864h-4.171l7.5-27.864h4.171ZM589.634 247v-23.273h15.682v4.057h-10.762v5.545h9.955v4.057h-9.955v5.557h10.807V247h-15.727Zm24.207-23.273 4.693 7.932h.182l4.716-7.932h5.557l-7.102 11.636L629.148 247h-5.659l-4.773-7.943h-.182L613.762 247h-5.637l7.284-11.637-7.147-11.636h5.579Zm23.182 0V247h-4.92v-23.273h4.92Zm3.162 4.057v-4.057h19.114v4.057h-7.125V247h-4.864v-19.216h-7.125Z"
          />
        </g>
        <g className="Tayuman Assets">
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
          <g className="Stairs">
            <path stroke="#000" d="M220.518 211.5v-44h118v44z" />
            <path
              stroke="#000"
              strokeWidth="2"
              d="M220.579 212v-45m5.613 45v-45m5.613 45v-45m5.614 45v-45m5.613 45v-45m5.613 45v-45m5.613 45v-45m5.613 45v-45m5.614 45v-45m5.613 45v-45m5.613 45v-45m5.613 45v-45m5.613 45v-45m5.614 45v-45m5.613 45v-45m5.613 45v-45m5.613 45v-45m5.613 45v-45m5.614 45v-45m5.613 45v-45m5.613 45v-45m-112.825 0v45h118.438v-45H220.018Z"
              className="Vector"
            />
          </g>
          <g className="Stairs">
            <path stroke="#000" d="M220.518 148.5v-44h89v44z" />
            <path
              stroke="#000"
              strokeWidth="2"
              d="M220.442 149v-45m4.245 45v-45m4.246 45v-45m4.245 45v-45m4.245 45v-45m4.246 45v-45m4.245 45v-45m4.245 45v-45m4.245 45v-45m4.246 45v-45m4.245 45v-45m4.245 45v-45m4.246 45v-45m4.245 45v-45m4.245 45v-45m4.245 45v-45m4.246 45v-45m4.245 45v-45m4.245 45v-45m4.245 45v-45m4.246 45v-45m-85.33 0v45h89.575v-45h-89.575Z"
              className="Vector"
            />
          </g>
          <g className="Stairs">
            <path stroke="#000" d="M901.518 254.5v-42h134v42z" />
            <path
              stroke="#000"
              strokeWidth="2"
              d="M901.654 255v-43m6.368 43v-43m6.368 43v-43m6.368 43v-43m6.368 43v-43m6.368 43v-43m6.368 43v-43m6.368 43v-43m6.368 43v-43m6.368 43v-43m6.368 43v-43m6.368 43v-43m6.367 43v-43m6.368 43v-43m6.368 43v-43m6.368 43v-43m6.367 43v-43m6.37 43v-43m6.37 43v-43m6.36 43v-43m6.37 43v-43m-127.992 0v43h134.362v-43H901.018Z"
              className="Vector"
            />
          </g>
          <g className="Stairs">
            <path stroke="#000" d="M910.518 153.5v-37h93v37z" />
            <path
              stroke="#000"
              strokeWidth="2"
              d="M910.461 154v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.433 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m4.434 38v-38m-89.122 0v38h93.552v-38h-93.552Z"
              className="Vector"
            />
          </g>
          <g className="Stairs">
            <path stroke="#000" d="M1699.52 931.5v-41h147v41z" />
            <path
              stroke="#000"
              strokeWidth="2"
              d="M1699.72 932v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.99 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.98 42v-42m6.99 42v-42m6.98 42v-42m6.98 42v-42m-140.32 0v42h147.3v-42h-147.3Z"
              className="Vector"
            />
          </g>
          <g className="Stairs">
            <path stroke="#000" d="M2105.52 917.5v-31h157v31z" />
            <path
              stroke="#000"
              strokeWidth="2"
              d="M2105.76 918v-32m7.46 32v-32m7.45 32v-32m7.45 32v-32m7.45 32v-32m7.46 32v-32m7.45 32v-32m7.45 32v-32m7.46 32v-32m7.45 32v-32m7.45 32v-32m7.45 32v-32m7.46 32v-32m7.45 32v-32m7.45 32v-32m7.46 32v-32m7.45 32v-32m7.45 32v-32m7.45 32v-32m7.46 32v-32m7.45 32v-32m-149.8 0v32h157.25v-32h-157.25Z"
              className="Vector"
            />
          </g>
          <g className="Stairs">
            <path stroke="#000" d="M2105.52 874.5v-31h195v31z" />
            <path
              stroke="#000"
              strokeWidth="2"
              d="M2105.94 875v-32m9.25 32v-32m9.24 32v-32m9.25 32v-32m9.24 32v-32m9.25 32v-32m9.24 32v-32m9.25 32v-32m9.24 32v-32m9.25 32v-32m9.24 32v-32m9.25 32v-32m9.25 32v-32m9.24 32v-32m9.25 32v-32m9.24 32v-32m9.25 32v-32m9.24 32v-32m9.25 32v-32m9.24 32v-32m9.25 32v-32m-185.83 0v32h195.07v-32h-195.07Z"
              className="Vector"
            />
          </g>
          <g className="TURNSTILE_SB_R">
            <path stroke="#000" d="M485.518 259.5v-121h70v121z" />
            <g className="TURNSTILE_SB_R">
              <path stroke="#000" strokeWidth="3" d="M486.518 258.5v-119h68v119z" className="TURNSTILE_SB_R" />
            </g>
          </g>
          <g className="TURNSTILE_SB_R">
            <path stroke="#000" d="M1697.52 700.5h127v59h-127z" />
            <g className="TURNSTILE_SB_R">
              <path stroke="#000" strokeWidth="3" d="M1698.52 701.5h125v57h-125z" className="TURNSTILE_SB_R" />
            </g>
          </g>
          <g className="GeneralAsset">
            <path stroke="#000" strokeWidth="3" d="M393.518 283.5h97v30h-97z" />
            <path stroke="#000" d="M392.518 282.5h99v32h-99z" className="Rectangle" />
          </g>
          <g className="GeneralAsset">
            <path stroke="#000" strokeWidth="3" d="M498.518 72.5h56v53h-56z" />
            <path stroke="#000" d="M497.518 71.5h58v55h-58z" className="Rectangle" />
          </g>
          <g className="GeneralAsset">
            <path stroke="#000" strokeWidth="3" d="M1849.52 717.5h46v33h-46z" />
            <path stroke="#000" d="M1848.52 716.5h48v35h-48z" className="Rectangle" />
          </g>
        </g>
      </g>
    </svg>
  );
};
Tayuman.propTypes = {
  backlitData: PropTypes.array,
  SBparapetData: PropTypes.array,
  ticketBoothsData: PropTypes.array,
  onClick1: PropTypes.func,
  onClick2: PropTypes.func,
  onClick3: PropTypes.func,
  handleSouthClick: PropTypes.func,
  handleNorthClick: PropTypes.func,
};
export default Tayuman;

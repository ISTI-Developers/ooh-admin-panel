import PropTypes from "prop-types";
import { ParapetSlot, BacklitSlot } from "~components/ParapetSlot";
const RPapa = ({ backlitData = [], SBparapetData = [], ticketBoothsData = [], onClick1, onClick2, onClick3 }) => {
  const positionsP = [
    // === Upper row (y = 422) ===
    { x: 337, y: 422 },
    { x: 443, y: 422 },
    { x: 549, y: 422 },
    { x: 655, y: 422 },
    { x: 761, y: 422 },
    { x: 867, y: 422 },
    { x: 973, y: 422 },
    { x: 1079, y: 422 },
    { x: 1185, y: 422 },
    { x: 1291, y: 422 },
    { x: 1397, y: 422 },
    { x: 1503, y: 422 },
    { x: 1609, y: 422 },
    { x: 1715, y: 422 },
    { x: 1821, y: 422 },
    { x: 1927, y: 422 },
    { x: 2033, y: 422 },
    { x: 2139, y: 422 },
    { x: 2245, y: 422 },
    { x: 2650, y: 422 },

    // === Lower row (y = 636–638) ===
    { x: 334, y: 636 },
    { x: 457, y: 636 },
    { x: 580, y: 636 },
    { x: 703, y: 636 },
    { x: 826, y: 636 },
    { x: 949, y: 636 },
    { x: 1072, y: 636 },
    { x: 1195, y: 636 },
    { x: 1318, y: 636 },
    { x: 1441, y: 636 },
    { x: 1564, y: 636 },
    { x: 1959, y: 636 },
    { x: 2085, y: 636 },
    { x: 2211, y: 636 },
    { x: 2337, y: 636 },
    { x: 2463, y: 636 },
    { x: 2589, y: 636 },
  ];

  const positionsB = [
    // === Upper backlits (y = 450) ===
    { x: 771, y: 450 },
    { x: 1152, y: 450 },
    { x: 1533, y: 450 },
    { x: 1914, y: 450 },

    // === Lower backlits (y = 606) ===
    { x: 771, y: 601 },
    { x: 1152, y: 601 },
    { x: 1533, y: 601 },
    { x: 1914, y: 601 },
  ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMin meet"
      fill="none"
      viewBox="0 0 2979 1200"
    >
      <g id="R. Papa">
        <g id="Vector">
          <path fill="#000" d="M329 287v4H110v-4h219Z" />
          <path fill="#000" d="m332 417.97-4 .03-1-131 4-.031 1 131.001Z" />
          <path fill="#000" d="M2341 414v4H328v-4h2013Z" />
          <path fill="#000" d="M2337 224h4v194h-4V224Zm164-4v4h-164v-4h164Z" />
          <path fill="#000" d="M2497 103h4v121h-4V103Zm134 0v4h-130v-4h130Zm4 121h-4V103h4v121Z" />
          <path fill="#000" d="M2644 220v4h-13v-4h13Zm4 190h-4V220h4v190Z" />
          <path fill="#000" d="M2802 406v4h-158v-4h158Zm4 53h-4v-53h4v53Z" />
          <path fill="#000" d="M2911 455v4h-109v-4h109Zm4 164h-4V455h4v164Zm-113 0v-4h109v4h-109Z" />
          <path fill="#000" d="M2806 658h-4v-43h4v43Zm-850 4v-4h850v4h-850Z" />
          <path fill="#000" d="M1960 852h-4V658h4v194Zm-23 4v-4h23v4h-23Z" />
          <path fill="#000" d="M1938 970h-4V852h4v118Zm-133 4v-4h133v4h-133Zm0-122h4v118h-4V852Z" />
          <path fill="#000" d="M1662 856v-4h147v4h-147Zm0-198h4v194h-4V658Z" />
          <path fill="#000" d="M328 662v-4h1336v4H328Z" />
          <path fill="#000" d="M332 777h-4V658h4v119Zm-219 0v-4h215v4H113Z" />
          <path fill="#000" d="M113 747h4v29h-4v-29Zm181-4v4H113v-4h181Z" />
          <path fill="#000" d="M290 621h4v126h-4V621Z" />
          <path fill="#000" d="M102 625v-4h192v4H102Z" />
          <path fill="#000" d="M102 446h4v176h-4V446Z" />
          <path fill="#000" d="M294 443v4H102v-4h192Z" />
          <path fill="#000" d="M290 317h4v130h-4V317Zm-180-26h4v26h-4v-26Z" />
          <path fill="#000" d="M110 321v-4h184v4H110Zm2692 275v4H329v-4h2473Z" />
          <path fill="#000" d="M2798 599h4v20h-4v-20Zm0-145h4v15.133h-4V454Z" />
          <path fill="#000" d="M2802 469v4H329v-4h2473ZM507 442.5h4V469h-4v-26.5Z" />
          <path fill="#000" d="M2436 442.502v4H510.999v-4H2436Z" />
          <path fill="#000" d="M2432 271h4v174h-4V271Zm97-4v4h-97v-4h97Z" />
          <path fill="#000" d="M2528 233h4v38h-4v-38Zm4 400h-4v-33h4v33Z" />
          <path fill="#000" d="M1759 631v-4h771v4h-771Z" />
          <path fill="#000" d="M1761 802h-4V629h4v173Z" />
          <path fill="#000" d="M1837 801v4h-78v-4h78Zm4 45h-4v-48h4v48Z" />
          <path
            fill="#000"
            d="M1832 835h15v14h-15v-14Zm0-39h15v14h-15v-14Zm-82 0h15v14h-15v-14Zm0-174h15v14h-15v-14Zm772 0h15v14h-15v-14Zm1-396h15v14h-15v-14Zm0 36h15v14h-15v-14Zm-96 0h15v14h-15v-14Zm0 176h15v14h-15v-14Zm-1925 0h15v14h-15v-14Zm1714 375.5V934h118V813.5h4V938h-126V813.5h4ZM2081 153v120.5h-4V157h-118.5v116.5h-4V153H2081Zm386.14 239v-17.455h11.76v3.043h-8.07v4.159h7.47v3.043h-7.47v4.167h8.11V392h-11.8Zm29.3-17.455V392h-3.19l-7.59-10.986h-.13V392h-3.69v-17.455h3.24l7.53 10.978h.15v-10.978h3.68Zm2.38 3.043v-3.043h14.34v3.043h-5.35V392h-3.65v-14.412h-5.34Zm16.7 14.412v-17.455h6.88c1.32 0 2.45.236 3.38.708.94.466 1.65 1.128 2.14 1.986.49.852.74 1.855.74 3.008 0 1.159-.25 2.156-.75 2.992-.5.829-1.23 1.466-2.17 1.909-.95.443-2.09.664-3.43.664h-4.61v-2.965h4.01c.71 0 1.29-.097 1.76-.29.46-.193.81-.483 1.04-.869.23-.387.35-.867.35-1.441 0-.579-.12-1.068-.35-1.466-.23-.397-.58-.699-1.05-.903-.47-.21-1.05-.316-1.76-.316h-2.49V392h-3.69Zm9.42-7.943 4.34 7.943h-4.07l-4.25-7.943h3.98Zm4.58-9.512h4.13l3.98 7.517h.17l3.98-7.517h4.14l-6.37 11.285V392h-3.67v-6.17l-6.36-11.285Zm25.95-.818-5.63 20.898h-3.13l5.63-20.898h3.13Zm1.81 18.273v-17.455h11.76v3.043h-8.07v4.159h7.47v3.043h-7.47v4.167h8.11V392h-11.8Zm18.16-17.455 3.52 5.949h.13l3.54-5.949h4.17l-5.33 8.728 5.45 8.727h-4.25l-3.58-5.957h-.13l-3.58 5.957h-4.23l5.46-8.727-5.36-8.728h4.19Zm17.38 0V392h-3.69v-17.455h3.69Zm2.38 3.043v-3.043h14.33v3.043h-5.34V392h-3.65v-14.412h-5.34ZM1781.14 677v-17.455h11.76v3.043h-8.07v4.159h7.47v3.043h-7.47v4.167h8.11V677h-11.8Zm29.3-17.455V677h-3.19l-7.59-10.986h-.13V677h-3.69v-17.455h3.24l7.53 10.978h.15v-10.978h3.68Zm2.38 3.043v-3.043h14.34v3.043h-5.35V677h-3.65v-14.412h-5.34Zm16.7 14.412v-17.455h6.88c1.32 0 2.45.236 3.38.708.94.466 1.65 1.128 2.14 1.986.49.852.74 1.855.74 3.008 0 1.159-.25 2.156-.75 2.992-.5.829-1.23 1.466-2.17 1.909-.95.443-2.09.664-3.43.664h-4.61v-2.965h4.01c.71 0 1.29-.097 1.76-.29.46-.193.81-.483 1.04-.869.23-.387.35-.867.35-1.441 0-.579-.12-1.068-.35-1.466-.23-.397-.58-.699-1.05-.903-.47-.21-1.05-.316-1.76-.316h-2.49V677h-3.69Zm9.42-7.943 4.34 7.943h-4.07l-4.25-7.943h3.98Zm4.58-9.512h4.13l3.98 7.517h.17l3.98-7.517h4.14l-6.37 11.285V677h-3.67v-6.17l-6.36-11.285Zm25.95-.818-5.63 20.898h-3.13l5.63-20.898h3.13Zm1.81 18.273v-17.455h11.76v3.043h-8.07v4.159h7.47v3.043h-7.47v4.167h8.11V677h-11.8Zm18.16-17.455 3.52 5.949h.13l3.54-5.949h4.17l-5.33 8.728 5.45 8.727h-4.25l-3.58-5.957h-.13l-3.58 5.957h-4.23l5.46-8.727-5.36-8.728h4.19Zm17.38 0V677h-3.69v-17.455h3.69Zm2.38 3.043v-3.043h14.33v3.043h-5.34V677h-3.65v-14.412h-5.34ZM122 518h-4v-27h4v27Zm2782 0h-4v-27h4v27Z"
          />
          <path fill="#000" d="M2903 514v4H118v-4h2785Zm0-23v4H118v-4h2785ZM122 581h-4v-27h4v27Zm2782 0h-4v-27h4v27Z" />
          <path fill="#000" d="M2903 577v4H118v-4h2785Zm0-23v4H118v-4h2785Z" />
        </g>
        <g id="R. Papa Assets">
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
          <g id="TURNSTILE_SB_R">
            <path id="TURNSTILE_SB_R_2" stroke="currentColor" strokeWidth="3" d="M1766.5 730.5h73v44h-73z" />
          </g>
          <g id="TURNSTILE_SB_R_3">
            <path id="TURNSTILE_SB_R_4" stroke="currentColor" strokeWidth="3" d="M1696.5 730.5h50v37h-50z" />
          </g>
          <g id="TURNSTILE_SB_R_5">
            <path id="TURNSTILE_SB_R_6" stroke="currentColor" strokeWidth="3" d="M2745.5 611.5h40v43h-40z" />
          </g>
          <g id="TURNSTILE_SB_R_7">
            <path id="TURNSTILE_SB_R_8" stroke="currentColor" strokeWidth="3" d="M2694.5 611.5h45v43h-45z" />
          </g>
          {/* <g id="TURNSTILE_SB_R_9">
            <path id="TURNSTILE_SB_R_10" stroke="currentColor" strokeWidth="3" d="M2646.5 418.5h143v32h-143z" />
          </g> */}
          <g id="TURNSTILE_SB_R_11">
            <path stroke="currentColor" d="M2442.5 302.5h79v47h-79z" />
            <path id="TURNSTILE_SB_R_12" stroke="currentColor" strokeWidth="3" d="M2443.5 303.5h77v45h-77z" />
          </g>
          <g id="TURNSTILE_SB_R_13">
            <path stroke="currentColor" d="M2373.5 305.5h48v38h-48z" />
            <path id="TURNSTILE_SB_R_14" stroke="currentColor" strokeWidth="3" d="M2374.5 306.5h46v36h-46z" />
          </g>
          <g id="Stairs">
            <path stroke="currentColor" d="M1960.5 196.5h54v82h-54z" />
            <path
              id="Vector_2"
              stroke="currentColor"
              strokeWidth="2"
              d="M1960 196.392h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.916h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m0-78.693h-55v82.608h55V196Z"
            />
          </g>
          <g id="Stairs_2">
            <path stroke="currentColor" d="M2019.5 196.5h54v82h-54z" />
            <path
              id="Vector_3"
              stroke="currentColor"
              strokeWidth="2"
              d="M2019 196.392h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.916h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m-55 3.915h55m0-78.693h-55v82.608h55V196Z"
            />
          </g>
          <g id="Stairs_3">
            <path stroke="currentColor" d="M2503.5 152.5h59v71h-59z" />
            <path
              id="Vector_4"
              stroke="currentColor"
              strokeWidth="2"
              d="M2503 152.34h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.397h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.397h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.397h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.397h60m-60 3.396h60m-60 3.396h60m0-68.264h-60v71.66h60V152Z"
            />
          </g>
          <g id="Stairs_4">
            <path stroke="currentColor" d="M2567.5 152.5h59v71h-59z" />
            <path
              id="Vector_5"
              stroke="currentColor"
              strokeWidth="2"
              d="M2567 152.34h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.397h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.397h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.397h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.396h60m-60 3.397h60m-60 3.396h60m-60 3.396h60m0-68.264h-60v71.66h60V152Z"
            />
          </g>
          <g id="Stairs_5">
            <path stroke="currentColor" d="M1811.5 855.5h57v79h-57z" />
            <path
              id="Vector_6"
              stroke="currentColor"
              strokeWidth="2"
              d="M1811 855.377h58m-58 3.774h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m0-75.849h-58v79.623h58V855Z"
            />
          </g>
          <g id="Stairs_6">
            <path stroke="currentColor" d="M1872.5 855.5h57v79h-57z" />
            <path
              id="Vector_7"
              stroke="currentColor"
              strokeWidth="2"
              d="M1872 855.377h58m-58 3.774h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m-58 3.773h58m-58 3.774h58m0-75.849h-58v79.623h58V855Z"
            />
          </g>
          <g id="Stairs_7">
            <path stroke="currentColor" d="M2218.5 813.5h52v92h-52z" />
            <path
              id="Vector_8"
              stroke="currentColor"
              strokeWidth="2"
              d="M2218 813.439h53m-53 4.386h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.386h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.386h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.386h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m0-88.175h-53v92.561h53V813Z"
            />
          </g>
          <g id="Stairs_8">
            <path stroke="currentColor" d="M2280.5 813.5h52v92h-52z" />
            <path
              id="Vector_9"
              stroke="currentColor"
              strokeWidth="2"
              d="M2280 813.439h53m-53 4.386h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.386h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.386h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.386h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m-53 4.387h53m0-88.175h-53v92.561h53V813Z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
RPapa.propTypes = {
  backlitData: PropTypes.array,
  SBparapetData: PropTypes.array,
  ticketBoothsData: PropTypes.array,
  onClick1: PropTypes.func,
  onClick2: PropTypes.func,
  onClick3: PropTypes.func,
  handleSouthClick: PropTypes.func,
  handleNorthClick: PropTypes.func,
};
export default RPapa;

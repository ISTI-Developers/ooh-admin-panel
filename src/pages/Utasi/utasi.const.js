import { useImageUrl } from "~/misc/useImageUrl";

export function useUtasiImages() {
  const Picture1 = useImageUrl("Picture1.png");
  const Picture2 = useImageUrl("Picture2.jpg");
  const Picture3 = useImageUrl("Picture3.jpg");
  const Picture4 = useImageUrl("Picture4.jpg");
  const Picture5 = useImageUrl("Picture5.jpg");
  const Picture6 = useImageUrl("Picture6.jpg");
  const Picture7 = useImageUrl("Picture7.jpg");
  const Pic1Map = useImageUrl("Pic1Map.png");
  const Pic2Map = useImageUrl("Pic2Map.png");
  const Pic3Map = useImageUrl("Pic3Map.png");
  const Pic4Map = useImageUrl("Pic4Map.jpg");

  const imageMap = {
    1: Picture1,
    2: Picture2,
    3: Picture3,
    4: Picture4,
    5: Picture5,
    6: Picture6,
    7: Picture7,
  };
  const imageMap2 = {
    1: Pic1Map,
    2: Pic2Map,
    3: Pic3Map,
    4: Pic4Map,
  };

  return { imageMap, imageMap2 };
}
export const sb_ticketBooth_top = "sb_top";
export const sb_ticketBooth_mid = "sb_mid";
export const sb_ticketBooth_bot = "sb_below";

export const nb_ticketBooth_top = "nb_top";
export const nb_ticketBooth_mid = "nb_mid";
export const nb_ticketBooth_bot = "nb_below";

export const SWS = "South West Stairs";
export const NWS = "North West Stairs";
export const SES = "South East Stairs";
export const NES = "North East Stairs";
export const SBS = "South Bound Stairs";
export const NBS = "North Bound Stairs";

import { useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebase";

export function useImageUrl(filename) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let mounted = true;

    if (!filename) {
      setUrl(null);
      return;
    }

    getDownloadURL(ref(storage, filename))
      .then((downloadUrl) => {
        if (mounted) setUrl(downloadUrl);
      })
      .catch(() => {
        if (mounted) setUrl(null);
      });

    return () => {
      mounted = false;
    };
  }, [filename]);

  return url;
}

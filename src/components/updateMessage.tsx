import { useState, useEffect } from "react";
import SystemUpdateAltIcon from "../icons/updateIcon";

type updateState = {
  isLatest: boolean;
  name: string;
};

export const UpdateMessage = (): React.ReactElement => {
  const localVersion = process.env.REACT_APP_VERSION;
  const [latestVersion, setLatestVersion] = useState<updateState>({
    isLatest: false,
    name: "",
  });

  useEffect(() => {
    checkForUpdates();

    return () => {
      checkForUpdates();
    };
  });

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // TODO: Should we change this link to other place?
    window.open("https://github.com/opsdroid/opsdroid-web/releases/latest");
  };

  const checkForUpdates = () => {
    const RELEASES_URL =
      "https://api.github.com/repos/opsdroid/opsdroid-desktop/releases/latest";

    fetch(RELEASES_URL, {
      method: "GET",
      mode: "cors",
      cache: "default",
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Unexpected response code: ${response.status}`);
        } else {
          return response.json();
        }
      })
      .then((latest_tag) => {
        const latest_version = latest_tag.tag_name.replace("v", "");
        setLatestVersion({
          isLatest: latest_version === localVersion,
          name: latest_version,
        });
      })
      .catch((err) => {
        console.log(
          "Unable to fetch latest version from GitHub. Reason: ",
          err
        );
      });
  };

  return (
    <div className="updates-available" onClick={handleClick}>
      <span className="icon">
        <SystemUpdateAltIcon />
      </span>
      <span>Update available. Download version {latestVersion.name} now.</span>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import SystemUpdateAltIcon from "../icons/updateIcon";

type updateState = {
  checkedForUpdate: boolean;
  localIsLatest: boolean;
  name: string;
};

export const UpdateMessage = () => {
  const localVersion = process.env.REACT_APP_VERSION;
  const isRunningDev = process.env.REACT_APP_ENV;

  const [latestVersion, setLatestVersion] = useState<updateState>({
    checkedForUpdate: false,
    localIsLatest: true,
    name: "",
  });

  useEffect(() => {
    if (!latestVersion.checkedForUpdate) {
      checkForUpdates();
    }

    return () => {
      checkForUpdates();
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // TODO: Should we change this link to other place?
    window.open("https://github.com/opsdroid/opsdroid-web/releases/latest");
  };

  const checkForUpdates = () => {
    if (!isRunningDev) {
      const RELEASES_URL =
        "https://api.github.com/repos/opsdroid/opsdroid-web/releases/latest";

      fetch(RELEASES_URL, {
        method: "GET",
        mode: "cors",
        cache: "default",
      })
        .then((response) => {
          if (response.status !== 200) {
            console.error(`Unexpected response code: ${response.status}`);
          } else {
            return response.json();
          }
        })
        .then((latest_tag) => {
          const latest_version = latest_tag?.tag_name.replace("v", "");
          if (latest_version) {
            setLatestVersion({
              checkedForUpdate: true,
              localIsLatest: latest_version === localVersion,
              name: latest_version,
            });
          } else {
            setLatestVersion({
              checkedForUpdate: true,
              localIsLatest: true,
              name: "",
            });
          }
        })
        .catch((err) => {
          console.error(
            "Unable to fetch latest version from GitHub. Reason: ",
            err
          );
        });
    }
  };

  return (
    <React.Fragment>
      {latestVersion.localIsLatest ? null : (
        <div className="updates-available" onClick={handleClick}>
          <span className="icon">
            <SystemUpdateAltIcon />
          </span>
          <span>
            Update available. Download version {latestVersion.name} now.
          </span>
        </div>
      )}
    </React.Fragment>
  );
};

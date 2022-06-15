export const checkForUrl = (text: string): boolean | string => {
  const match = text.match(
    new RegExp(
      "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
    )
  );
  if (match) {
    return true;
  } else {
    return false;
  }
};

export const expandMessage = (
  message: string
): Promise<string | undefined> | void => {
  const url = checkForUrl(message);
  if (url) {
    const isMessage = fetch(message, {
      method: "GET",
      headers: new Headers(),
      mode: "cors",
      cache: "default",
    })
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        if (
          blob.type == "image/gif" ||
          blob.type == "image/png" ||
          blob.type == "image/jpg" ||
          blob.type == "image/jpeg"
        ) {
          return message;
        }
      });
    return isMessage;
  }
};

/*
 * Code stolen from https://stackoverflow.com/questions/49474775
 */

export function forceDownload(blob: string, filename: string) {
  const a = document.createElement("a");
  a.download = filename;
  a.href = blob;
  // For Firefox https://stackoverflow.com/a/32226068
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Current blob size limit is around 500MB for browsers
export function download(url: string, filename: string) {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      forceDownload(blobUrl, filename);
    })
    .catch(e => console.error(e));
}

export function shallowEqual(
  object1: { [props: string]: any },
  object2: { [props: string]: any }
) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}

export function fileSizeFormat(size: number) {
  const unitArr = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  while (size >= 1024) {
    // eslint-disable-next-line no-param-reassign
    size /= 1024;
    index += 1;
  }
  return `${size.toFixed(2)}${unitArr[index]}`;
}

export function saveAs(file: Blob, fileName: string) {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(file);
  link.download = fileName;
  link.click();
}

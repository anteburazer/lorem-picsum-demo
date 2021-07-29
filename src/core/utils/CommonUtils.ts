import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

export const downloadImage = (data: string) => {
  const imgBinary = Buffer.from(data, 'binary');
  const url = window.URL.createObjectURL(new Blob([imgBinary]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "image.jpg");
  document.body.appendChild(link);
  link.click();
};
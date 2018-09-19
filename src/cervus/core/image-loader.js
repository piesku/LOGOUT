export function image_loader(url) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject('Error loading image.');
    img.src = url;
    if (img.complete) {
      resolve(img);
    }
  });
}

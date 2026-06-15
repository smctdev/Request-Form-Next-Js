export const isImageFile = (fileUrl: any) => {
  const imageExtensions = ["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"];
  const extension = fileUrl.split(".").pop().toLowerCase();
  return imageExtensions.includes(extension);
};

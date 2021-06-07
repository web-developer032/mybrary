const rootStyle = getComputedStyle(document.documentElement);

if (rootStyle.getPropertyValue("--book-cover-width-large")) ready();
else {
  document.getElementById("main-css").addEventListener("load", ready);
}

function ready() {
  const coverWidth = parseFloat(
    rootStyle.getPropertyValue("--book-cover-width-large")
  );
  const aspectRatio = parseFloat(
    rootStyle.getPropertyValue("--book-cover-aspect-ratio")
  );
  const coverheight = coverWidth / aspectRatio;
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
  );

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / aspectRatio,

    // when image saves on server it will never be greater than these sizes
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverheight,
  });
  FilePond.parse(document.body);
}

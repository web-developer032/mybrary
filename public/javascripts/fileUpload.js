FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRatio: 150 / 100,

  // when image saves on server it will never be greater than these sizes
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
});
FilePond.parse(document.body);

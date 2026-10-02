const rewrite = (source, version) =>
  source.replace(
    /(?<![a-z0-9.:/])\/(?:images|assets|svg|fonts)\/[^\s"'\x60)<>\\]+?\.(?:png|jpe?g|gif|webp|avif|svg|ico|css|woff2?|ttf|otf|mp3|mp4|pdf)(?![a-z0-9?])/gi,
    (url) => url + "?v=" + version,
  );
class PublicAssetVersionPlugin {
  constructor(version) {
    this.version = version;
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("PublicAssetVersion", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "PublicAssetVersion",
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        (assets) => {
          for (const [name, asset] of Object.entries(assets)) {
            if (!/\.(js|css)$/.test(name)) continue;
            const original = asset.source().toString();
            const changed = rewrite(original, this.version);
            if (changed !== original)
              compilation.updateAsset(
                name,
                new compiler.webpack.sources.RawSource(changed),
              );
          }
        },
      );
    });
  }
}
module.exports = { PublicAssetVersionPlugin, rewrite };

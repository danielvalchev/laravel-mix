let webpack = require('webpack');
let VersionFilesTask = require('../tasks/VersionFilesTask');

class Version {
    /**
     * Register the component.
     *
     * @param {Array} files
     */
    register(files = []) {
        Mix.addTask(new VersionFilesTask({ files }));
    }

    /**
     * webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        if (Mix.inProduction()) {
            return [new webpack.HashedModuleIdsPlugin()];
        }
    }
}

module.exports = Version;

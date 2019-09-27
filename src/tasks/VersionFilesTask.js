let glob = require('glob');
let path = require('path');
let Task = require('./Task');
let FileCollection = require('../FileCollection');

class VersionFilesTask extends Task {
    /**
     * Run the task.
     */
    run() {
        let resolvedFiles = this.getFiles(this.data.files);
        this.files = new FileCollection(resolvedFiles);

        this.assets = resolvedFiles.map(file => {
            file = new File(file);

            Mix.manifest.hash(file.pathFromPublic());

            return file;
        });
    }

    /**
     * Handle when a relevant source file is changed.
     *
     * @param {string} updatedFile
     */
    onChange(updatedFile) {
        Mix.manifest.hash(new File(updatedFile).pathFromPublic()).refresh();
    }

    /**
     * Resolve destination files
     *
     * @param {Array} files
     */
    getFiles(files = []) {
        return flatten(
            [].concat(files).map(filePath => {
                if (File.find(filePath).isDirectory()) {
                    filePath += path.sep + '**/*';
                }

                if (!filePath.includes('*')) return filePath;

                return glob.sync(
                    new File(filePath).forceFromPublic().relativePath(),
                    { nodir: true }
                );
            })
        );
    }
}

module.exports = VersionFilesTask;

import "tsx/esm";
import * as path from 'node:path';
import * as sass from 'sass';

export default function (eleventyConfig: any) {
    eleventyConfig.addTemplateFormats("scss");
    eleventyConfig.addWatchTarget('./src/_sass');
    eleventyConfig.addExtension("scss", {
        outputFileExtension: "css",
        compileOptions: {
          cache: false,
        },
        compile: async function (inputContent: any, inputPath: string) {
            const parsedPath = path.parse(inputPath);
            if (parsedPath.name.startsWith("_")) {
                return;
            }

            let result = sass.compileString(inputContent, {
                loadPaths: [
                    parsedPath.dir || '.',
                ],
            });

            this.addDependencies(inputPath, result.loadedUrls);
            // This is the render function, `data` is the full data cascade
            return async () => {
                return result.css;
            };
        },
    });

    eleventyConfig.setServerOptions({
        port: 4000,
        watch: ['src/_sass'],
    });

    return {
        htmlTemplateEngine: 'liquid',
        dir: {
            input: 'src/content',
            output: '_site',
            layouts: '../_layouts',
            includes: '../_includes',
            data: '../_data',
        },
    };
}

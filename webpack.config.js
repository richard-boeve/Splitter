module.exports = {
    entry: "./app/splitter.js",
    output: {
        path: __dirname + "/build/app/js",
        filename: "splitter.js"
    },
    module: {
        rules: []
    }
};
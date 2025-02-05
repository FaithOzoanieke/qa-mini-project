// // babel.config.cjs
// module.exports = {
//   presets: [
//     [
//       "@babel/preset-env",
//       {
//         // Ensure that modules are transformed to CommonJS (required by Jest)
//         modules: "commonjs",
//         targets: { node: "current" }
//       },
//     ],
//     "@babel/preset-react",
//     "@babel/preset-typescript",
//   ],
// };


// babel.config.cjs
// module.exports = {
//   presets: [
//     [
//       "@babel/preset-env",
//       {
//         modules: "commonjs",
//         targets: { node: "current" },
//       },
//     ],
//     "@babel/preset-react",
//     "@babel/preset-typescript",
//   ],
// };


module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: "commonjs",
        targets: { node: "current" },
      },
    ],
    // Use the new JSX transform
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
};

const { spawn } = require("child_process");

const updateAntd = () => {
  const packageName = ["ant-design-vue"];
  spawn("npm", ["i", [...packageName, ""].join("@latest ")], {
    stdio: "inherit",
    shell: true
  });
};

updateAntd();

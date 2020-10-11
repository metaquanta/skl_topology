const txt = `
                'media0_in mi, , media0_in cpr 0'
                'media0_in cpr 0, , System Playback'
                'media0_out mo, media0_in mi Switch, media0_in mi'
                'media0_out mo, codec0_in mi Switch, codec0_in mi'
                'media0_out mo, dmic01_hifi_in mi Switch, dmic01_hifi_in mi'
                'media0_out cpr 6, , media0_out mo'
                'System Capture, , media0_out cpr 6'
                'codec0_out mo, media0_in mi Switch, media0_in mi'
                'codec0_out mo, codec0_in mi Switch, codec0_in mi'
                'codec0_out mo, dmic01_hifi_in mi Switch, dmic01_hifi_in mi'
                'codec0_out cpr 4, , codec0_iv_in'
                'codec0_iv_in, Switch, codec0_lp_in cpr 14'
                'codec0_out cpr 4, , codec0_out mo'
                'codec0_out, , codec0_out cpr 4'
                'codec0_lp_in cpr 14, , codec0_lp_in'
                'codec1_out mo, media0_in mi Switch, media0_in mi'
                'codec1_out mo, codec0_in mi Switch, codec0_in mi'
                'codec1_out mo, dmic01_hifi_in mi Switch, dmic01_hifi_in mi'
                'codec1_out cpr 5, , codec1_out mo'
                'codec1_out, , codec1_out cpr 5'
                'codec0_in mi, , codec0_in cpr 1'
                'codec0_in cpr 1, , codec0_in'
                'dmic01_hifi_in mi, , dmic01_hifi_in cpr 3'
                'dmic01_hifi_in cpr 3, , dmic01_hifi'
                'hdmi1_pt_out cpr 8, , hdmi1_pt_out cpr 7'
                'hdmi1_pt_out cpr 7, , HDMI1 Playback'
                'iDisp1_out, , hdmi1_pt_out cpr 8'
                'media2_out cpr 10, , kpd_in kpb 0'
                'media2_out cpr 11, , hwd_in sink'
                'hwd_in cpr 12, , kpd_in kpb 0'
                'kpd_in mic_select 0, , kpd_in cpr 9'
                'kpd_in kpb 0, , kpd_in mic_select 0'
                'kpd_in cpr 9, , dmic01_hifi'
                'media2_out cpr 11, , media2_out cpr 10'
                'Reference Capture, , media2_out cpr 11'
                'hwd_in sink, , hwd_in cpr 12'
                'mch_cap_in cpr 16, , mch_cap_in cpr 15'
                'DMIC Capture, , mch_cap_in cpr 16'
                'mch_cap_in cpr 15, , dmic01_hifi'
                'hdmi2_pt_out cpr 18, , hdmi2_pt_out cpr 17'
                'hdmi2_pt_out cpr 17, , HDMI2 Playback'
                'iDisp2_out, , hdmi2_pt_out cpr 18'

`;
const edges = txt
  .split("\n")
  .map((l) => l.slice(l.indexOf("'") + 1, l.lastIndexOf("'")))
  .map((l) => l.trim())
  .filter((l) => l !== "");
const g = edges.map((l) =>
  l
    .split(",")
    .map((n) => n.trim())
    .filter((n) => n !== "")
);
const gp = g.map((l) => {
  if (l.length === 3) {
    return [l[0], `${l[0]} ${l[2]}`, l[2]];
  } else {
    return l;
  }
});
const labels = new Map();
let i = 0;
gp.filter((e) => e.length === 2)
  .flat()
  .forEach((n) => {
    if (!labels.has(n)) labels.set(n, `V${i++}`);
  });
gp.filter((e) => e.length === 3)
  .map((e) => [e[0], e[2]])
  .flat()
  .forEach((n) => {
    if (!labels.has(n)) labels.set(n, `V${i++}`);
  });
gp.filter((e) => e.length === 3).forEach((s) => {
  labels.set(s[1], `S${i++}`);
});
const dot = `
graph Topology {
${Array.from(labels.entries())
  .filter(([k, v]) => v.indexOf("V") === 0)
  .map(([k, v]) => `${v} [label="${k}"];`)
  .join("\n")}
${Array.from(labels.entries())
  .filter(([k, v]) => v.indexOf("S") === 0)
  .map(([k, v]) => `${v} [label="S"];`)
  .join("\n")}

${gp.map((e) => e.map((v) => labels.get(v)).join(" -- ")).join(";\n")};
}
`;
console.log(dot);

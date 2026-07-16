import { useState } from "react";

const S = {
  root: { fontFamily: "'Inter','Helvetica Neue',sans-serif", background: "#111", color: "#E8E6E1", minHeight: "100vh" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 56, borderBottom: "1px solid #1E1E1E" },
  logo: { fontSize: 15, fontWeight: 700, letterSpacing: "0.5px", color: "#E8E6E1" },
  logoAccent: { color: "#C0281F" },
  navLinks: { display: "flex", gap: 32, listStyle: "none" },
  navLink: { fontSize: 13, color: "#666", cursor: "pointer", letterSpacing: "0.2px" },
  navEnter: { fontSize: 13, color: "#E8E6E1", border: "1px solid #2A2A2A", borderRadius: 4, padding: "7px 16px", cursor: "pointer", background: "transparent", fontFamily: "inherit" },
  hero: { padding: "96px 40px 80px", maxWidth: 680 },
  heroLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "#C0281F", textTransform: "uppercase", marginBottom: 28 },
  heroH1: { fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-1.5px", color: "#E8E6E1", marginBottom: 24 },
  heroH1Em: { color: "#C0281F", fontStyle: "normal" },
  heroSub: { fontSize: 16, color: "#666", lineHeight: 1.7, maxWidth: 440, marginBottom: 40 },
  searchWrap: { display: "flex", alignItems: "center", maxWidth: 420 },
  plateInput: { flex: 1, background: "#1A1A1A", border: "1px solid #2A2A2A", borderRight: "none", borderRadius: "4px 0 0 4px", padding: "13px 16px", fontSize: 15, fontFamily: "'Inter',monospace", fontWeight: 600, letterSpacing: "2px", color: "#E8E6E1", outline: "none", textTransform: "uppercase" },
  searchBtn: { background: "#C0281F", color: "#fff", border: "none", borderRadius: "0 4px 4px 0", padding: "13px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", letterSpacing: "0.3px" },
  searchHint: { marginTop: 12, fontSize: 12, color: "#444" },
  divider: { border: "none", borderTop: "1px solid #1A1A1A" },
  section: { padding: "72px 40px", maxWidth: 900, margin: "0 auto" },
  sectionLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "#444", textTransform: "uppercase", marginBottom: 20 },
  sectionTitle: { fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, letterSpacing: "-0.8px", color: "#E8E6E1", marginBottom: 40, lineHeight: 1.15 },
  steps: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#1A1A1A", border: "1px solid #1A1A1A", borderRadius: 6, overflow: "hidden" },
  step: { background: "#111", padding: "28px 24px" },
  stepN: { fontSize: 11, fontWeight: 700, color: "#C0281F", letterSpacing: "2px", marginBottom: 14 },
  stepTitle: { fontSize: 14, fontWeight: 700, color: "#E8E6E1", marginBottom: 8, letterSpacing: "-0.2px" },
  stepText: { fontSize: 13, color: "#555", lineHeight: 1.6 },
  workshops: { display: "flex", flexDirection: "column", gap: 1, background: "#1A1A1A", border: "1px solid #1A1A1A", borderRadius: 6, overflow: "hidden" },
  workshop: { background: "#111", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, cursor: "pointer" },
  workshopHover: { background: "#151515" },
  wLeft: { flex: 1 },
  wName: { fontSize: 14, fontWeight: 700, color: "#E8E6E1", marginBottom: 3, letterSpacing: "-0.2px" },
  wMeta: { fontSize: 12, color: "#555", display: "flex", gap: 16 },
  wTags: { display: "flex", gap: 6, marginTop: 8 },
  wTag: { fontSize: 11, color: "#444", border: "1px solid #222", borderRadius: 3, padding: "2px 7px", letterSpacing: "0.3px" },
  wRight: { display: "flex", alignItems: "center", gap: 24, flexShrink: 0 },
  wStat: { textAlign: "right" },
  wStatVal: { fontSize: 16, fontWeight: 800, color: "#E8E6E1", letterSpacing: "-0.5px" },
  wStatLabel: { fontSize: 11, color: "#444", marginTop: 1 },
  score: { background: "#C0281F", color: "#fff", fontWeight: 800, fontSize: 18, borderRadius: 4, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "-0.5px", flexShrink: 0 },
  ctaSection: { padding: "72px 40px", borderTop: "1px solid #1A1A1A", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, maxWidth: 900, margin: "0 auto" },
  ctaLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "3px", color: "#444", textTransform: "uppercase", marginBottom: 14 },
  ctaTitle: { fontSize: 18, fontWeight: 800, color: "#E8E6E1", lineHeight: 1.2, marginBottom: 10, letterSpacing: "-0.4px" },
  ctaText: { fontSize: 13, color: "#555", lineHeight: 1.65, marginBottom: 20 },
  btnR: { background: "#C0281F", color: "#fff", border: "none", borderRadius: 4, padding: "11px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.2px" },
  btnGhost: { background: "transparent", color: "#666", border: "1px solid #2A2A2A", borderRadius: 4, padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  footer: { borderTop: "1px solid #1A1A1A", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  footerLogo: { fontSize: 13, fontWeight: 700, color: "#333" },
  footerNote: { fontSize: 12, color: "#333" },
};

const workshops = [
  { name: "Auto Performance SP", city: "São Paulo, SP", servicos: "318", tags: ["Motor","Freios","Suspensão"], prazo: "94%", retrabalho: "1.2%", score: "9.4" },
  { name: "Mecânica Bonfim", city: "Belo Horizonte, MG", servicos: "204", tags: ["Injeção","Elétrica"], prazo: "91%", retrabalho: "2.0%", score: "9.1" },
  { name: "Rede Confiança", city: "Curitiba, PR", servicos: "477", tags: ["Revisão","Alinhamento"], prazo: "88%", retrabalho: "2.7%", score: "8.8" },
];

export default function LandingPage() {
  const [plate, setPlate] = useState("");
  const [hovered, setHovered] = useState(null);

  return (
    <div style={S.root}>
      <nav style={S.nav}>
        <div style={S.logo}><span style={S.logoAccent}>■</span> MekaRank</div>
        <ul style={S.navLinks}>
          {["Ranking", "Consultar placa", "Para oficinas"].map(l => (
            <li key={l}><a style={S.navLink}>{l}</a></li>
          ))}
        </ul>
        <button style={S.navEnter}>Entrar</button>
      </nav>

      <section style={S.hero}>
        <p style={S.heroLabel}>Ranking automotivo</p>
        <h1 style={S.heroH1}>
          Oficinas ranqueadas<br />
          por dados.<br />
          <em style={S.heroH1Em}>Não por estrelas.</em>
        </h1>
        <p style={S.heroSub}>
          Consulte o histórico real de qualquer veículo pela placa. Encontre oficinas
          avaliadas por preço, prazo e taxa de retrabalho.
        </p>
        <div style={S.searchWrap}>
          <input
            style={S.plateInput}
            placeholder="Placa do veículo"
            maxLength={7}
            value={plate}
            onChange={e => setPlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
          />
          <button style={S.searchBtn}>Consultar</button>
        </div>
        <p style={S.searchHint}>Prévia gratuita · Sem cadastro</p>
      </section>

      <hr style={S.divider} />

      <div style={S.section}>
        <p style={S.sectionLabel}>Como funciona</p>
        <h2 style={S.sectionTitle}>Três passos.</h2>
        <div style={S.steps}>
          {[
            { n: "01", title: "Consulte pela placa", text: "Digite qualquer placa. Veja quantos registros existem antes de desbloquear o histórico completo." },
            { n: "02", title: "Veja o histórico real", text: "Serviços, oficinas e datas vinculados ao veículo — não ao proprietário atual." },
            { n: "03", title: "Escolha com dados", text: "Compare oficinas por prazo e retrabalho. Sem subjetividade." },
          ].map(s => (
            <div key={s.n} style={S.step}>
              <p style={S.stepN}>{s.n}</p>
              <p style={S.stepTitle}>{s.title}</p>
              <p style={S.stepText}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      <hr style={S.divider} />

      <div style={S.section}>
        <p style={S.sectionLabel}>Oficinas em destaque</p>
        <h2 style={S.sectionTitle}>Ranqueadas por performance real.</h2>
        <div style={S.workshops}>
          {workshops.map((w, i) => (
            <div
              key={w.name}
              style={{ ...S.workshop, ...(hovered === i ? S.workshopHover : {}) }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={S.wLeft}>
                <p style={S.wName}>{w.name}</p>
                <div style={S.wMeta}>
                  <span>{w.city}</span>
                  <span>{w.servicos} serviços</span>
                </div>
                <div style={S.wTags}>
                  {w.tags.map(t => <span key={t} style={S.wTag}>{t}</span>)}
                </div>
              </div>
              <div style={S.wRight}>
                <div style={S.wStat}>
                  <div style={S.wStatVal}>{w.prazo}</div>
                  <div style={S.wStatLabel}>Prazo</div>
                </div>
                <div style={S.wStat}>
                  <div style={S.wStatVal}>{w.retrabalho}</div>
                  <div style={S.wStatLabel}>Retrabalho</div>
                </div>
                <div style={S.score}>{w.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.ctaSection}>
        <div>
          <p style={S.ctaLabel}>Para donos e compradores</p>
          <p style={S.ctaTitle}>Antes de comprar um usado, veja o que já foi feito no carro.</p>
          <p style={S.ctaText}>Histórico vinculado à placa. Sem depender do vendedor.</p>
          <button style={S.btnR}>Consultar placa</button>
        </div>
        <div>
          <p style={S.ctaLabel}>Para oficinas</p>
          <p style={S.ctaTitle}>Seja ranqueado por quem realmente entrega.</p>
          <p style={S.ctaText}>Cadastre sua oficina e apareça para clientes que buscam por dados, não por indicação.</p>
          <button style={S.btnGhost}>Cadastrar minha oficina</button>
        </div>
      </div>

      <footer style={S.footer}>
        <div style={S.footerLogo}><span style={S.logoAccent}>■</span> MekaRank</div>
        <p style={S.footerNote}>© 2025 MekaRank</p>
      </footer>
    </div>
  );
}

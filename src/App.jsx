import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0F1115",
  surface: "#181C23",
  surface2: "#212734",
  text: "#F3F4F6",
  sub: "#94A3B8",
  orange: "#FF7A3D",
  blue: "#3BA7FF",
  green: "#22C55E",
  yellow: "#FACC15",
};

const MEMBERS = ["しんや", "まつお", "友達2"];

const VENUES = ["札幌","函館","福島","新潟","東京","中山","中京","京都","阪神","小倉"];

const RACES = Array.from({ length: 12 }, (_, i) => `${i + 1}R`);

const BET_TYPES = ["単勝","複勝","馬連","馬単","ワイド","3連複","3連単"];

export default function App() {
  const [tab, setTab] = useState("input");
  const [member, setMember] = useState("しんや");
  const [venue, setVenue] = useState("東京");
  const [race, setRace] = useState("11R");
  const [betType, setBetType] = useState("3連複");
  const [amount, setAmount] = useState(100);
  const [horses, setHorses] = useState([]);

  const [bets, setBets] = useState(() => {
    const saved = localStorage.getItem("bets");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleHorse = (num) => {
    setHorses(
      horses.includes(num)
        ? horses.filter((h) => h !== num)
        : [...horses, num]
    );
  };

  const addBet = () => {
    if (horses.length === 0) return;

    const newBet = {
      id: Date.now(),
      member,
      venue,
      race,
      betType,
      amount,
      horses: [...horses],
      hit: false,
      payout: 0,
    };

    setBets([newBet, ...bets]);
    setHorses([]);
    setAmount(100);
  };

  const deleteBet = (id) => {
    setBets(bets.filter((b) => b.id !== id));
  };

  const toggleHit = (id) => {
    setBets(
      bets.map((b) =>
        b.id === id ? { ...b, hit: !b.hit } : b
      )
    );
  };

  useEffect(() => {
    localStorage.setItem("bets", JSON.stringify(bets));
  }, [bets]);

  const totalAmount = bets.reduce(
    (sum, b) => sum + Number(b.amount),
    0
  );

  const memberTotals = MEMBERS.map((m) => {
    const total = bets
      .filter((b) => b.member === m)
      .reduce((sum, b) => sum + Number(b.amount), 0);

    return { member: m, total };
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      padding: 24,
      fontFamily: "sans-serif",
    }}>
      <h1>🏇 馬券共有アプリ</h1>

      {/* TAB */}
      <div style={{ display: "flex", gap: 10, margin: "20px 0" }}>
        {[
          ["input", "入力"],
          ["list", "一覧"],
          ["share", "共有"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              border: "none",
              padding: "10px 18px",
              borderRadius: 999,
              background: tab === id ? COLORS.orange : COLORS.surface2,
              color: tab === id ? "#fff" : COLORS.sub,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* INPUT */}
      {tab === "input" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* 総投資額 */}
          <div style={{ padding: 20, background: COLORS.surface, borderRadius: 20 }}>
            <div style={{ color: COLORS.sub, fontWeight: 700 }}>総投資額</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: COLORS.yellow }}>
              ¥{totalAmount.toLocaleString()}
            </div>
          </div>

          {/* メンバー別 */}
          <div style={{ padding: 20, background: COLORS.surface, borderRadius: 20 }}>
            <div style={{ color: COLORS.sub, fontWeight: 700, marginBottom: 12 }}>
              メンバー別
            </div>

            {memberTotals.map((item) => (
              <div
                key={item.member}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: COLORS.surface2,
                  padding: 14,
                  borderRadius: 14,
                  marginBottom: 10,
                }}
              >
                <div>{item.member}</div>
                <div style={{ color: COLORS.yellow, fontWeight: 800 }}>
                  ¥{item.total.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* メンバー */}
          <div style={{ padding: 20, background: COLORS.surface, borderRadius: 20 }}>
            <div style={{ marginBottom: 12, color: COLORS.sub }}>メンバー</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {MEMBERS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMember(m)}
                  style={{
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: 999,
                    background: member === m ? COLORS.orange : COLORS.surface2,
                    color: member === m ? "#fff" : COLORS.sub,
                    fontWeight: 700,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* レース */}
          <div style={{ padding: 20, background: COLORS.surface, borderRadius: 20 }}>
            <div style={{ marginBottom: 12, color: COLORS.sub }}>レース</div>

            <div style={{ display: "flex", gap: 10 }}>
              <select value={venue} onChange={(e) => setVenue(e.target.value)}
                style={{ flex: 1, background: COLORS.surface2, color: COLORS.text, border: "none", borderRadius: 12 }}>
                {VENUES.map(v => <option key={v}>{v}</option>)}
              </select>

              <select value={race} onChange={(e) => setRace(e.target.value)}
                style={{ width: 100, background: COLORS.surface2, color: COLORS.text, border: "none", borderRadius: 12 }}>
                {RACES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* 馬券 */}
          <div style={{ padding: 20, background: COLORS.surface, borderRadius: 20 }}>
            <div style={{ marginBottom: 12, color: COLORS.sub }}>馬券</div>

            <select value={betType} onChange={(e) => setBetType(e.target.value)}
              style={{ width: "100%", marginBottom: 10, background: COLORS.surface2, color: COLORS.text, border: "none", borderRadius: 12 }}>
              {BET_TYPES.map(b => <option key={b}>{b}</option>)}
            </select>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              style={{
                width: "100%",
                background: COLORS.surface2,
                border: "none",
                color: COLORS.text,
                borderRadius: 12,
                padding: 10,
              }}
            />

            {/* 馬番 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10, marginTop: 15 }}>
              {Array.from({ length: 18 }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => toggleHorse(num)}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: "none",
                    background: horses.includes(num) ? COLORS.orange : COLORS.surface2,
                    color: "#fff",
                  }}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={addBet}
              style={{
                marginTop: 20,
                width: "100%",
                padding: 14,
                borderRadius: 14,
                border: "none",
                background: COLORS.orange,
                color: "#fff",
                fontWeight: 800,
              }}
            >
              馬券を登録
            </button>
          </div>

        </div>
      )}

      {/* LIST */}
      {tab === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {bets.map((bet) => (
            <div key={bet.id} style={{ padding: 20, background: COLORS.surface, borderRadius: 20 }}>
              <div style={{ fontWeight: 800 }}>{bet.member}</div>
              <div style={{ color: COLORS.sub }}>{bet.venue} {bet.race}</div>
              <div>{bet.betType}</div>
              <div>馬番: {bet.horses.join("-")}</div>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <div style={{ color: COLORS.yellow }}>
                  ¥{Number(bet.amount).toLocaleString()}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => toggleHit(bet.id)}>
                    {bet.hit ? "的中" : "ハズレ"}
                  </button>
                  <button onClick={() => deleteBet(bet.id)}>削除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
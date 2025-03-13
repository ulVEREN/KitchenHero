import TableComponent from "./Tabell";

function App() {
  return (
    <div>
      <h1
        style={{
          textAlign: "center", // Sentrerer teksten

          fontWeight: "bold", // Gjør teksten litt tydeligere
        }}
      >
        🦸Kjøkkenheltene!🦸‍♀️
      </h1>
      <p
        style={{
          textAlign: "center", // Sentrerer teksten

          fontWeight: "bold", // Gjør teksten litt tydeligere
        }}
      >
        Registrer aktivitet som gavner fellesskapet og tok mer enn 2 min. for
        eksempel:
      </p>
      <ul
        style={{
          textAlign: "center", // Sentrerer hele listen horisontalt
          listStylePosition: "inside", // Holder punktmerkene på riktig sted
        }}
      >
        <div style={{ display: "inline-block", textAlign: "left" }}>
          <li>Ta inn/ut av oppvaskmaskin</li>
          <li>Legge på plass pålegg etter felleslunsj</li>
          <li>
            Gå på butikken for å handle basics som alle trenger (brød for eks)
          </li>
          <li>Tørke over alle bord og benker etter felleslunsj</li>
          <li>Rydde etter felles arrangementer</li>
        </div>
      </ul>

      <TableComponent />
      <p> </p>
      <p
        style={{
          listStyleType: "none",
          padding: 0,
          margin: 0,
          textAlign: "center", // Sentrerer teksten
          fontSize: "1.5rem", // Øker skriftstørrelsen
          fontWeight: "bold", // Gjør teksten litt tydeligere
        }}
      >
        En premiepott på tre tusen kroner deles på de beste heltene hver måned!
      </p>
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          margin: 0,
          textAlign: "center", // Sentrerer teksten
          fontSize: "1.5rem", // Øker skriftstørrelsen
          fontWeight: "bold", // Gjør teksten litt tydeligere
        }}
      >
        <li>🥇 1500 kr</li>
        <li>🥈 1000 kr</li>
        <li>🥉 500 kr</li>
      </ul>
    </div>
  );
}

export default App;

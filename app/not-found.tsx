export default function NotFound() {
  return (
    <section className="card error-card">
      <h1>❌ Link não encontrado</h1>
      <p>O link solicitado não existe.</p>
      <a href="/" className="back-link">
        ← Voltar
      </a>
    </section>
  );
}

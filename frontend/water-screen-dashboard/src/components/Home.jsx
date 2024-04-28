import '../styles/App.css'

function Home() {

  return (
      <div className="main_content">
          <h1>Strona konfiguracyjna Ekranu Wodnego!</h1>
          <h5>Ekran Wodny znaoduje się w holu budynku C (Instytut Politechniczny)</h5>
          <p>Ekran wyświetla animacje graficzne, oraz informjuje o aktualnej godzinie i pogodzie</p>

          <h5>Autorzy modernizacji sytemu:</h5>
          <p>Marcin Onik</p>
          <p>Dawid Wołek</p>

          <h5>Koordynator projektu:</h5>
          <a href="https://danielkrol.pwsztar.edu.pl/" target="_blank"><p>dr inż. Daniel Król</p> </a>
      </div>
  )
}

export default Home

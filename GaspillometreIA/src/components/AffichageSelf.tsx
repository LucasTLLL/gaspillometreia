

const AffichageSelf = () => {

  const dateDuJour = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });


  



  return (


    <div>


      <div className="p-10" >

        <p className="text-center font-bold text-5xl md:text-7xl text-base-content tracking-tight mb-4 mt-15 uppercase">
          Gaspillometre
        </p>

        <p className="text-center font-semibold text-xl md:text-2xl text-base-content  mb-4 mt-15 ">Aujourd'hui, {dateDuJour}</p>
      </div>

      <div className="justify-center items-center flex flex-col ">
        <div className="stats shadow w-full max-4xl ">


          <div className="stat place-items-center">
            <div className="stat-title text-2xl">Total gaspiller</div>
            <div className="stat-value">31K</div>
            <div className="stat-desc">{dateDuJour}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title text-2xl">Equivalent repas </div>
            <div className="stat-value text-secondary">4,200</div>
            <div className="stat-desc text-secondary">↗︎ 40 (2%)</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title text-2xl">Par rapport a hier </div>
            <div className="stat-value">1,200</div>
            <div className="stat-desc">↘︎ 90 (14%)</div>
          </div>
        </div>
      </div>


      <div>
        <div className="text-center font-semibold text-xl md:text-2xl text-base-content mt-15 mb-15">
          Classement des aliments les plus gaspillés 
        </div>



        </div>
      </div>



        
      
   
  )
}

export default AffichageSelf

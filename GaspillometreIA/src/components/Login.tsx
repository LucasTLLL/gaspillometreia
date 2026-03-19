import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

const Login = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [username, setUsername] = useState('Lucas')
  const [password, setPassword] = useState('Tana92i')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      
     

      const reponse = await fetch(`http://10.0.200.78:8000/connexion`, {
        method: 'POST',
        body: JSON.stringify({nom: username, password: password}),
        headers: {
          'Content-Type': 'application/json'
        }
      })




      if (reponse.ok) {
        const json = await reponse.json()

       
        if (json.erreur === 0) {
          onLoginSuccess()

          
          if (json.data.permission === 0) {
            navigate('/Tendance') 
          } 

          else {
            alert("Tu n'as pas la permission d'accéder au site.")
          }
        } else {
        
          alert('Identifiants ou mot de passe incorrects')
        }
      }
    } catch (erreur) {
      alert('Impossible de joindre le serveur')
    }
  }

  return (
    <div className='bg-[url(/src/assets/bg2.jpeg)] bg-cover bg-center bg-no-repeat min-h-screen p-20'>
    <div 
 className="flex min-h-full flex-col justify-center px- py-12 lg:px-8 
             bg-black/60 p-8 rounded-xl 
             max-w-md mx-auto" 
 >
      
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white ">
          <Logo/>
        </h2>
      </div>

      <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-100">
              Nom d'utilisateur
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent   sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
              Mot de passe
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-accent sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-accent px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-success focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Connexion
            </button>
          </div>
        </form>
      </div>
      </div>
 
    </div>

  )
}

export default Login

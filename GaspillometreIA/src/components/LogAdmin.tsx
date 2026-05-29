import { useState, useEffect, useRef } from 'react';
import { ScrollText } from 'lucide-react';
import NavBarAdmin from './NavBArAdmin';

const LogAdmin = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const finDesLogsRef = useRef<HTMLDivElement>(null);

  const scrollerToutEnBas = () => {
    finDesLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollerToutEnBas();
  }, [logs]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('userToken');

      const date1 = new Date();
      const date2 = new Date();
      date2.setDate(date2.getDate() + 1)

      const rech = date1.toISOString().split('T')[0];
      const rech1 = date2.toISOString().split('T')[0];

      console.log("Date début :", rech);
      console.log("Date din :", rech1);

      const reponse = await fetch(
        `http://10.0.200.78:8000/logs?date_from=${rech}&date_to=${rech1}&rasp=rasp1&token=${token}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (reponse.ok) {
        const json = await reponse.json();
        console.log(json);
        let listeLogs = json.data || json;
        listeLogs = listeLogs.slice(-100);
        setLogs(listeLogs);
        console.log(json);
      }
    } catch (erreur) {
      console.error("Erreur API Logs", erreur);
    }
  };


  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 60000);
    console.log("UPDATE")
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pb-12">

      <div>
        <NavBarAdmin />
      </div>

      {/* TON EN-TÊTE */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 mt-8 mx-5 lg:mx-auto max-w-6xl bg-base-100 p-6 rounded-3xl shadow-sm border border-base-300">
        <div>
          <h1 className="text-3xl font-black text-base-content flex items-center gap-3">
            <ScrollText className="text-success h-8 w-8" />
            Gestion des logs
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
          </span>
          <span className="text-sm font-semibold text-gray-600">Flux en direct (100 max)</span>
        </div>
      </div>

      <div className="flex justify-center px-5">

        <div className="w-full max-w-4xl bg-[#0c0c0c] rounded-sm shadow-2xl border border-gray-700 overflow-hidden flex flex-col">


          <div className="bg-[#1e1e1e] px-4 py-1.5 border-b border-gray-700 flex justify-between items-center">
            <span className="font-mono text-gray-400 text-xs">root@serveur-gaspillometre: ~/logs</span>

          </div>


          <div className="h-[500px] overflow-y-auto p-5 space-y-1 font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500 mt-2"> Connexion au serveur... Attente des données.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="hover:bg-gray-800/60 px-2 py-0.5 flex flex-col sm:flex-row gap-2 sm:gap-6">

                  <span className="text-green-500 shrink-0">
                    {log.date || '00:00:00'}
                  </span>

                  <span className={`shrink-0 ${log.level === 'DEBUG' ? 'text-green-500' :
                      log.level === 'INFO' ? 'text-blue-500' : 'text-red-500'
                  }`}
                  >

                    [{log.level}]
                  </span>

                  <span className="text-gray-300 break-words">
                    {log.message || JSON.stringify(log)}
                  </span>
                </div>
              ))
            )}

            <div ref={finDesLogsRef} className="h-4" />
          </div>

        </div>
      </div>

    </div>
  );
}

export default LogAdmin;
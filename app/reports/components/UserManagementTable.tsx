export function UserManagementTable() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold tracking-tight text-neutral-dark dark:text-white">Active Team Members</h3>
        <div className="flex gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-neutral-500 text-[18px]">search</span>
            <input 
              className="h-9 pl-9 pr-4 rounded-full bg-white dark:bg-[#23220f] border border-neutral-200 dark:border-neutral-700 text-sm focus:ring-primary focus:border-primary text-neutral-dark dark:text-white placeholder-neutral-500" 
              placeholder="Filter users" 
              type="text"
            />
          </div>
          <button className="h-9 px-4 rounded-full bg-primary text-black text-xs font-bold hover:brightness-95 transition-colors">
            Invite User
          </button>
        </div>
      </div>
      <div className="bg-white dark:bg-[#23220f] rounded-[2rem] border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 dark:border-neutral-700/50">
                <th className="p-5 text-xs uppercase tracking-wider text-neutral-500 font-bold">User</th>
                <th className="p-5 text-xs uppercase tracking-wider text-neutral-500 font-bold">Role</th>
                <th className="p-5 text-xs uppercase tracking-wider text-neutral-500 font-bold">Region</th>
                <th className="p-5 text-xs uppercase tracking-wider text-neutral-500 font-bold">Last Active</th>
                <th className="p-5 text-xs uppercase tracking-wider text-neutral-500 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              <tr className="hover:bg-neutral-50 dark:hover:bg-black/20 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-cover size-8 rounded-full" data-alt="Portrait of Sarah Chen" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBn26oqo047ja6eRDdHXe70qNoLHYZun4HY7kzefaIeRDZsQ3fe059pCOXftUCtWdtcMk10sSuNykTv_YHgJEMelKbGYpRsgfRXFw6FC5vEZyqcquPdrWeIWmxREWvqwqncuv-YR1aYLI9pqXezQU2kCXhw5DIoHZ3tTcG0jpA38B94_bwblNIhRNUJ0mY3wG74l6KTEdEvigFjDt6VU4pm50zFDlk3fDHrmgSVcDPSJf1mu5wWFGH5fkGZ2RYJgoCnLH95GepSG1Q')"}}></div>
                    <div>
                      <p className="text-sm font-bold text-neutral-dark dark:text-white">Sarah Chen</p>
                      <p className="text-xs text-neutral-500">sarah.c@gov.org</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                    Super Admin
                  </span>
                </td>
                <td className="p-5 text-sm text-neutral-dark dark:text-white">Central HQ</td>
                <td className="p-5 text-sm text-neutral-500">Just now</td>
                <td className="p-5 text-right">
                  <button className="text-neutral-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-neutral-50 dark:hover:bg-black/20 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-cover size-8 rounded-full" data-alt="Portrait of Marcus Johnson" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCsguqMDLgkUDeXcszRKwbCOctcIaLcBSmotdtmAFE3MrXIXkW6tICh0XTn-3LjQvtyl_LF9SEN59qO0BP0lxE9_RoRaW4-gVD8UV4rlHQimNI1LaokSr_hrJTBPi0nZvQswWxIb1CK9SIbQZwOL8eaVvj9qfc63EGxIssIchTvh5M4RkH4FaX6mviy7rAZb2OWfvW4J4Xv-cxRA8NfsnHwnYlewu-KsAlemhjSioarYIrk97kJDwWpoD3PH8L2ApFHtzl4W3hulM0')"}}></div>
                    <div>
                      <p className="text-sm font-bold text-neutral-dark dark:text-white">Marcus Johnson</p>
                      <p className="text-xs text-neutral-500">m.johnson@relief.org</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    Logistician
                  </span>
                </td>
                <td className="p-5 text-sm text-neutral-dark dark:text-white">North District</td>
                <td className="p-5 text-sm text-neutral-500">2 hrs ago</td>
                <td className="p-5 text-right">
                  <button className="text-neutral-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-neutral-50 dark:hover:bg-black/20 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-center bg-cover size-8 rounded-full" data-alt="Portrait of Priya Patel" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfgxh5pLac9NLXFYI3oBTOSJ7T8yyYjGexx08fdW6l-SxmkU6E_YP9x1BhJ2_Oa0m-hlO2-3pX8eF-wmGValRI1ajAy1lZUwpJ1did0fd8obtNMvI-uxOr09fW0InJzzTtXZ_DoditKlxaCeCE45bnJaX0bKLjhzKzp9QuVxQzqC5hXZm6Li08BbJEIa9TuE4ENDbV3vWTblxBmsxpthzgIjBoNwhyvNFi_KSWXNt8xr9OUNLdDOZNj-zKYBlHzcAk15WnAcajTQM')"}}></div>
                    <div>
                      <p className="text-sm font-bold text-neutral-dark dark:text-white">Priya Patel</p>
                      <p className="text-xs text-neutral-500">priya.p@health.gov</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                    Viewer
                  </span>
                </td>
                <td className="p-5 text-sm text-neutral-dark dark:text-white">East Region</td>
                <td className="p-5 text-sm text-neutral-500">Yesterday</td>
                <td className="p-5 text-right">
                  <button className="text-neutral-500 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-background-light dark:bg-black/20 p-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-center">
          <button className="text-sm font-bold text-neutral-500 hover:text-neutral-dark dark:hover:text-white transition-colors">View All 42 Users</button>
        </div>
      </div>
    </section>
  );
}
